import axios from "./ajax";

export async function inertTweetLikeService(): Promise<any> {
  return await axios.post("/tweet/likes/insert");
}
