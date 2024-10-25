import { ChevronsDown } from "lucide-react";
import LikeCard from "../components/LikeCard";
import ScrollToTop from "../components/ScrollToTop";
import useLikesStore from "../hooks/use-likes";
import { findRecords } from "../utils/db/tweets";
import Authenticate from "../components/Authenticate";
import Indicator from "../components/Indicator";
import { useEffect, useState } from "react";
import logo from "../assets/icon128.png";
import { fetchUserInfoService } from "../services/auth";
import ButtonSignIn from "../components/ButtonSignIn";
import { Button } from "@radix-ui/themes";

const Home = () => {
  // 设置页面title
  useEffect(() => {
    document.title = "Xlike - sync and search your tweet likes";
  }, []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUploading, setUploading] = useState(false);

  useEffect(() => {
    const handleTabActivated = (activeInfo: any) => {};

    chrome.tabs.onActivated.addListener(handleTabActivated);
    return () => {
      chrome.tabs.onActivated.removeListener(handleTabActivated);
    };
  }, []);

  // useEffect(() => {
  //   queryByCondition();
  // }, []);

  const handleClearData = () => {
    setModalOpen(true);
  };

  const clearData = () => {
    setModalOpen(false);
    const storageClearPromise = new Promise<void>((resolve) => {
      chrome.storage.local.clear(() => {
        console.log("All data in storage cleared");
        resolve();
      });
    });

    const dbDeletePromise = new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase("xlike");
      request.onsuccess = () => {
        console.log("Database xlike deleted successfully");
        resolve();
      };
      request.onerror = () => {
        console.error("Error deleting database xlike");
        reject();
      };
    });

    Promise.all([storageClearPromise, dbDeletePromise])
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        console.error("Failed to clear storage or delete database");
      });
  };

  const {
    likes,
    addLikes,
    setLikes,
    hasMore,
    setHasMore,
    keyword,
    setKeyword,
    pageSize,
    totalCount,
    isAuthFailed,
    isSyncing,
  } = useLikesStore();

  const queryByCondition = async (append = false, limit = 100) => {
    console.log("keyword = ", keyword);
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

  const handleSearch = () => {
    queryByCondition(false);
  };

  const upload = async () => {};

  return (
    <div className="flex">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="relative max-w-screen-sm mx-auto flex items-center justify-center h-16">
          <input
            type="text"
            value={keyword}
            placeholder="input the keyword"
            className="w-2/3 px-4 py-2 border rounded-l-md focus:outline-none text-base"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 text-base"
          >
            search
          </button>
        </div>
        <a
          href="https://xlike.pro?utm_source=extension"
          target="_blank"
          className="absolute left-8 top-1/2 transform -translate-y-1/2 flex w-60"
        >
          <img src={logo} className="me-3 h-8" />
          <span className="flex-1 self-center whitespace-nowrap text-xl font-semibold">
            Xlike
          </span>
        </a>

        <ButtonSignIn
          className="absolute right-4 top-1/2 transform -translate-y-1/2 ml-4 rounded-md bg-slate-100 hover:bg-slate-200 px-4 py-2"
          user={user}
        />
      </header>
      <aside className="fixed top-16 left-0 w-60 h-screen p-4 bg-gray-100 overflow-y-auto z-10 grid grid-cols-1 gap-y-4 content-start">
        <span className="rounded-md px-4 py-2 bg-slate-300">
          Total Likes:{totalCount?.total}
        </span>
        <Button onClick={handleClearData} color="red" size="3">
          Clear All Data
        </Button>
        <Button
          onClick={upload}
          loading={isUploading}
          disabled={isUploading}
          color="blue"
          size="3"
        >
          upload
        </Button>
      </aside>
      <main className="w-[calc(100%-240px)] ml-auto pt-20 p-4">
        {isAuthFailed && <Authenticate />}
        {isSyncing && (
          <Indicator
            text={
              <span className="text-center">
                Sync in progress: {totalCount?.total} tweets.
              </span>
            }
          />
        )}
        <div className="mb-4 max-w-screen-sm mx-auto">
          {likes.length > 0 && (
            <ul>
              {likes.map((like, index) => {
                return (
                  <li key={like.id}>
                    <LikeCard
                      tweet={like}
                      keyword={keyword}
                      isLast={index === likes.length - 1}
                    />
                  </li>
                );
              })}
            </ul>
          )}
          {hasMore && (
            <p
              className="my-6 flex justify-center text-blue-500 cursor-pointer"
              onClick={() => queryByCondition(true)}
            >
              <ChevronsDown />
            </p>
          )}
        </div>
      </main>
      <ScrollToTop />
      {isModalOpen && (
        <div className="z-[9999] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">
              Confirm to clear all the data?
            </h2>
            <button
              onClick={clearData}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="ml-2 bg-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
