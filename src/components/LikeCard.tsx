import { ExternalLink, Trash2 } from "lucide-react";
import { Host, Tweet } from "../utils/types";
import { MediaItems } from "./MediaItems";
import QuotedTweet from "./QuotedTweet";
import Text from "./text";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { countRecords, deleteRecord } from "../utils/db/tweets";
import useLikesStore from "../hooks/use-likes";

export default function LikeCard({
  tweet,
  isLast,
  keyword,
}: {
  tweet: Tweet;
  isLast: boolean;
  keyword?: string;
}) {
  const { deleteLike, setTotalCount } = useLikesStore();

  const highlightKeyword = (text: string, keyword?: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const deleteTweet = async (tweet: Tweet) => {
    deleteRecord(tweet.id).then(async () => {
      deleteLike(tweet);
      setTotalCount(await countRecords());
    });
  };

  return (
    <div
      className={`p-2 hover:bg-[#121212] hover:bg-opacity-5 border-t border-r border-l ${
        isLast ? "border-b" : ""
      }`}
    >
      <div className="flex flex-shrink-0 pb-0">
        <div className="flex w-full items-start">
          <div className="mr-2">
            <a href={`${Host}/${tweet.screen_name}`} target="_blank">
              <img
                className="inline-block h-10 w-10 rounded-full"
                src={tweet.avatar_url.replace("_normal", "_x96")}
                alt="avatar"
              />
            </a>
          </div>
          <p className="flex-1 cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-bold leading-6">
            <a href={`${Host}/${tweet.screen_name}`} target="_blank">
              {tweet.username}&nbsp;
            </a>
            <span className="ml-1 text-sm font-normal leading-5 text-[rgb(83,100,113)]">
              <a href={`${Host}/${tweet.screen_name}`} target="_blank">
                @{tweet.screen_name} ·{" "}
              </a>
              <span
                data-text={`${Host}/${tweet.screen_name}/status/${tweet.tweet_id}`}
              >
                {new Date(tweet.created_at * 1000).toLocaleString()}
              </span>
            </span>
          </p>
        </div>
      </div>
      <div className="-mt-2 pl-12 text-[rgb(15,20,25)]">
        <Text text={tweet.full_text} searchTerm={keyword} />
        <div className="my-2 flex flex-wrap space-x-1 space-y-1 justify-center">
          <MediaItems media_items={tweet.media_items} />
        </div>
        {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
        {/* 底部布局，放删除按钮 */}
        <div className="flex justify-between items-center mt-2 py-2">
          <div className="text-sm text-gray-500">
            {new Date(tweet.created_at * 1000).toLocaleString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`https://x.com/${tweet.screen_name}/status/${tweet.tweet_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:cursor-pointer"
            >
              <ExternalLink className="h-6 w-6 text-gray-400 hover:text-blue-500" />
            </a>
            <div>
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Trash2 className="hover:cursor-pointer h-6 w-6 text-gray-400 hover:text-red-500" />
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth="450px">
                  <AlertDialog.Title>
                    Confirm to delete this tweet?
                  </AlertDialog.Title>

                  <div className="flex gap-2 mt-8 justify-end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button
                        variant="solid"
                        color="red"
                        onClick={() => deleteTweet(tweet)}
                      >
                        Confirm
                      </Button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
