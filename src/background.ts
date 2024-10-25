import { Host } from "./utils/types";
import { syncAuthHeaders } from "./utils/storage";
import { fetchUserInfoService } from "./services/auth";

// 点击插件图标，打开index.html
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("../index.html") });
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: chrome.runtime.getURL("../index.html") });
  }
});

chrome.webRequest.onSendHeaders.addListener(
  async (details: chrome.webRequest.WebRequestHeadersDetails) => {
    const { url, initiator } = details;
    // 只监听x的请求
    if (initiator !== Host) {
      return;
    }

    /**
     * The interface for members and non-members is different.
     * Members request folders first, while regular users directly request bookmarks.
     */
    if (!url.includes("/Bookmarks")) {
      return;
    }
    await syncAuthHeaders(details.requestHeaders);
    console.log("syncAuthHeaders");
  },
  {
    types: ["xmlhttprequest"],
    urls: [`${Host}/i/api/graphql/*`],
  },
  ["requestHeaders"]
);

async function fetchUserInfo() {
  try {
    return await fetchUserInfoService();
  } catch (error) {
    console.error("获取用户信息失败:", error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchUserInfo") {
    fetchUserInfo()
      .then((userInfo) => sendResponse({ success: true, data: userInfo }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // 保持消息通道开放，以便异步发送响应
  }
});
