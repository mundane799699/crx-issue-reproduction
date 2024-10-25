import { Media } from "../utils/types/tweet";
import { Image } from "./Tweet";

export const MediaItems = ({ media_items }: { media_items: Media[] }) => {
  const width = () => {
    return media_items.length > 1 ? "w-[calc(50%-4px)]" : "w-full";
  };

  return (
    <div>
      {media_items?.map((item) => (
        <div
          key={item.id_str}
          className={`relative ${width()} flex items-center`}
        >
          <Image
            src={item.media_url_https}
            alt={item.ext_alt_text}
            url={
              item.video_info
                ? item.video_info.variants[item.video_info.variants.length - 1]
                    .url
                : item.media_url_https.split("?")[0] + "?format=jpg&name=large"
            }
          />
          {item.type !== "photo" && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 -ml-8 -mt-8 flex h-14 w-14 items-center justify-center rounded-full">
              <svg viewBox="0 0 60 61" aria-hidden="true">
                <g>
                  <circle
                    cx="30"
                    cy="30.4219"
                    fill="#333333"
                    opacity="0.6"
                    r="30"
                  ></circle>
                  <path
                    d="M22.2275 17.1971V43.6465L43.0304 30.4218L22.2275 17.1971Z"
                    fill="white"
                  ></path>
                </g>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
