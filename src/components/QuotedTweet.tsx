import { Host, TweetQuoted } from "../utils/types";
import { MediaItems } from "./MediaItems";

const QuotedTweet = ({ tweet }: { tweet: TweetQuoted }) => {
  return (
    <div className="border rounded-lg p-2">
      <div className="flex flex-shrink-0 pb-0">
        <div className="flex w-full items-center">
          <div className="mr-2">
            <a href={`/?q=from:${tweet.screen_name}`}>
              <img
                className="inline-block h-6 w-6 rounded-full"
                src={tweet.avatar_url.replace("_normal", "_x96")}
                alt="avatar"
              />
            </a>
          </div>
          <p className="flex-1 cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap text-base font-bold leading-6">
            <span data-text={`${Host}/${tweet.screen_name}/`}>
              {tweet.username}&nbsp;
            </span>
            <span className="ml-1 text-sm font-normal leading-5 text-[rgb(83,100,113)]">
              <span data-text={`${Host}/${tweet.screen_name}/`}>
                @{tweet.screen_name} ·{" "}
              </span>
              <span
                data-text={`${Host}/${tweet.screen_name}/status/${tweet.tweet_id}`}
              >
                {new Date(tweet.created_at * 1000).toLocaleString()}
              </span>
            </span>
          </p>
        </div>
      </div>
      <div className="width-auto text-base font-normal leading-6">
        <span className="whitespace-pre-wrap break-words leading-snug">
          {tweet.full_text}
        </span>
      </div>
      <div className="my-2 flex flex-wrap space-x-1 space-y-1 justify-center">
        <MediaItems media_items={tweet.media_items} />
      </div>
    </div>
  );
};

export default QuotedTweet;
