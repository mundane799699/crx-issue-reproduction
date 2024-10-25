import axios from "./ajax";

export async function fetchUserInfoService(): Promise<any> {
  return await axios.get("/auth/userInfo");
}

export async function fetchSessionService(): Promise<any> {
  return await axios.get("/auth/session");
}
