import { useEffect } from "react";
import {
  getAuthInfo,
  getCurrentUserId,
  getLastBookmarksSyncTime,
  getLastLikesSyncTime,
  getLocal,
  getValue,
  logout,
  removeLocal,
  setLocal,
  StorageKeys,
} from "./utils/storage";
import { LIKE_FEATURES } from "./utils/api/twitter-features";
import { flatten, request } from "./utils/api/twitter-base";
import {
  AuthStatus,
  Endpoint,
  LikesResponse,
  TimelineAddEntriesInstruction,
  TimelineEntry,
  TimelineTimelineItem,
  TimelineTweet,
} from "./utils/types";
import { FetchError } from "./utils/xfetch";
import { getBookmarks, getTweetId, toRecord } from "./utils/api/twitter";
import {
  countRecords,
  findRecords,
  getRecord,
  upsertRecords,
} from "./utils/db/tweets";
import useLikesStore from "./hooks/use-likes";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    likes,
    addLikes,
    setLikes,
    hasMore,
    setHasMore,
    keyword,
    pageSize,
    setKeyword,
    setTotalCount,
    totalCount,
    isAuthFailed,
    setIsAuthFailed,
    setIsSyncing,
    isSyncing,
  } = useLikesStore();
  useEffect(() => {
    onMount();
  }, []);

  const onMount = async () => {
    const user_id = await getCurrentUserId();
    if (!user_id) {
      console.log("user_id not found");
      setIsAuthFailed(true);
      return;
    }
    initSync();
  };

  const initSync = async () => {
    try {
      const [auth, lastLikesSyncTime, lastBookmarksSyncTime] =
        await Promise.all([
          getAuthInfo(),
          getLastLikesSyncTime(),
          getLastBookmarksSyncTime(),
        ]);
      console.log("auth = ", auth);
      console.log("lastLikesSyncTime = ", lastLikesSyncTime);
      console.log("lastBookmarksSyncTime = ", lastBookmarksSyncTime);
      if (!auth || !auth.token) {
        throw new Error(AuthStatus.AUTH_FAILED);
      }
      setIsSyncing(true);
      // 点赞同步
      if (!lastLikesSyncTime) {
        console.log("full likes update");
        await syncAllLikes(true);
        const syncedTime = Math.floor(Date.now() / 1000);
        await setLocal({
          [StorageKeys.Last_Likes_Sync]: syncedTime,
        });
      } else {
        console.log("incremental likes update");
        await syncAllLikes(false);
      }
      console.log("sync likes success");

      // 书签同步
      if (!lastBookmarksSyncTime) {
        console.log("full bookmarks update");
        await syncAllBookmarks(true);
        const syncedTime = Math.floor(Date.now() / 1000);
        await setLocal({
          [StorageKeys.Last_Bookmarks_Sync]: syncedTime,
        });
      } else {
        console.log("incremental bookmarks update");
        await syncAllBookmarks(false);
      }
      console.log("sync bookmarks success");
    } catch (err) {
      console.error("initSync error", err);
      if (
        err.name == FetchError.IdentityError ||
        err.message == AuthStatus.AUTH_FAILED
      ) {
        setIsAuthFailed(true);
        await logout(await getCurrentUserId());
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const syncAllBookmarks = async (forceSync: boolean = false) => {
    let cursor = forceSync
      ? await getValue(StorageKeys.Bookmarks_Cursor)
      : undefined;
    while (true) {
      const json = await getBookmarks(cursor);
      const instruction =
        json.data.bookmark_timeline_v2.timeline.instructions?.find(
          (i) => i.type === "TimelineAddEntries"
        ) as TimelineAddEntriesInstruction | undefined;
      if (!instruction) {
        console.error("break, No instructions found in bookmarks response");
        break;
      }

      let tweets = instruction.entries.filter(
        (e) => e.content.entryType === "TimelineTimelineItem"
      ) as TimelineEntry<TimelineTweet, TimelineTimelineItem<TimelineTweet>>[];
      if (!tweets.length) {
        console.log(
          `Reached end of bookmarks with cursor ${cursor}, ${tweets.length}`
        );
        await removeLocal(StorageKeys.Bookmarks_Cursor);
        break;
      } else {
        const docs = tweets
          .map((i) => toRecord(i.content.itemContent, i.sortIndex, "bookmark"))
          .filter((i) => i !== null);
        await upsertRecords(docs, "bookmark");
        setTotalCount(await countRecords());
      }
      const target =
        instruction.entries[instruction.entries.length - 1].content;
      if (target.entryType === "TimelineTimelineCursor") {
        cursor = target.value;
        if (forceSync) {
          await setLocal({ [StorageKeys.Bookmarks_Cursor]: cursor });
        }
      } else {
        console.log("break, target = ", target);
        break;
      }
    }
  };

  const syncAllLikes = async (forceSync: boolean = false) => {
    let cursor: string | undefined = forceSync
      ? (await getLocal(StorageKeys.Likes_Cursor))[StorageKeys.Likes_Cursor]
      : undefined;
    while (true) {
      const json = await getLikes(cursor);
      const instruction =
        json.data.user.result.timeline_v2.timeline.instructions?.find(
          (i) => i.type === "TimelineAddEntries"
        ) as TimelineAddEntriesInstruction | undefined;
      if (!instruction) {
        console.error("break, No instructions found in likes response");
        break;
      }

      let tweets = instruction.entries.filter(
        (e) => e.content.entryType === "TimelineTimelineItem"
      ) as TimelineEntry<TimelineTweet, TimelineTimelineItem<TimelineTweet>>[];
      if (!tweets.length) {
        // 第一次全量同步完成后，代码会走这里跳出循环
        console.log(
          `break, Reached end of likes with cursor ${cursor}, ${tweets.length}`
        );
        await removeLocal(StorageKeys.Likes_Cursor);
        queryByCondition();
        break;
      } else {
        const docs = tweets
          .map((i) => toRecord(i.content.itemContent, i.sortIndex, "like"))
          .filter((i) => i !== null);
        if (await isLikesSynced(tweets)) {
          setTotalCount(await countRecords());
          console.log("break, All likes have been synchronized");
          queryByCondition();
          break;
        }
        await upsertRecords(docs, "like");
        console.log("upsertRecords success");
        setTotalCount(await countRecords());
      }
      const target =
        instruction.entries[instruction.entries.length - 1].content;
      if (target.entryType === "TimelineTimelineCursor") {
        cursor = target.value;
        if (forceSync) {
          console.log("cursor = ", cursor);
          await setLocal({ [StorageKeys.Likes_Cursor]: cursor });
        }
      } else {
        console.log("break, target = ", target);
        break;
      }
      if (useLikesStore.getState().likes.length === 0) {
        queryByCondition();
      }
    }
  };

  const queryByCondition = async (append = false, limit = 100) => {
    console.log("queryByCondition");
    const lastId = append ? likes[likes.length - 1]?.sort_index : "";
    const tweets = await findRecords(keyword, lastId, limit);
    console.log("tweets = ", tweets);
    setHasMore(tweets.length === limit);
    if (append) {
      addLikes(tweets);
    } else {
      setLikes(tweets);
    }
  };

  const isLikesSynced = async (
    tweets: TimelineEntry<TimelineTweet, TimelineTimelineItem<TimelineTweet>>[]
  ) => {
    const remoteLatest = tweets[0];
    const remoteLast = tweets[tweets.length - 1];
    const [localLatest, localLast] = await Promise.all([
      getRecord(getTweetId(remoteLatest)),
      getRecord(getTweetId(remoteLast)),
    ]);
    /**
     * 首尾两条都同步过了，说明已经同步完毕，可以退出循环
     * 如果因为同步被中断导致部分旧数据未同步，可以手动调用时设置 forceSync 参数为 true
     */
    if (localLatest && localLast) {
      return true;
    }

    return false;
  };

  const getLikes = async (cursor?: string, count: number = 100) => {
    try {
      const userId = await getCurrentUserId();
      const variables = {
        userId,
        cursor: "",
        count,
        includePromotedContent: false,
        withClientEventToken: false,
        withBirdwatchNotes: false,
        withVoice: true,
        withV2Timeline: true,
      };
      if (cursor) {
        variables.cursor = cursor;
      }
      const query = flatten({
        variables,
        features: LIKE_FEATURES,
        fieldToggles: { withArticlePlainText: false },
      });
      const json = (await request(`${Endpoint.USER_LIKES}?${query}`, {
        body: null,
        method: "GET",
      })) as LikesResponse;

      return json;
    } catch (e) {
      if (
        e.name !== FetchError.TimeoutError &&
        e.name !== FetchError.DataError
      ) {
        e.name = FetchError.IdentityError;
      }

      throw e;
    }
  };

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
