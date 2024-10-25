import { useEffect } from "react";
import useLikesStore from "../hooks/use-likes";
import { openNewTab } from "../utils/browser";
import { getAuthInfo, getCurrentUserId } from "../utils/storage";
import { ActionPage } from "../utils/types";
import { Alert } from "./Alert";
import Indicator from "./Indicator";

const Authenticate = () => {
  const store = useLikesStore();
  let timerId, tab: chrome.tabs.Tab;
  const checkAuth = async () => {
    const user_id = await getCurrentUserId();
    if (!user_id) return false;

    const auth = await getAuthInfo();

    const authenticated = !!(auth && auth.token);
    store.setIsAuthFailed(!authenticated);
    if (authenticated) {
      clearInterval(timerId);
      if (tab) chrome.tabs.remove(tab.id);
      // Always use the latest csrf & token
      // Only migrate bookmark cursor and lastSyncedTime if needed
      location.reload();
    }

    return authenticated;
  };

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, []);
  const startAuth = async (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    const authed = await checkAuth();
    if (authed) return;
    store.setIsAuthenicating(true);
    // 个人猜测大部份用户 twitter 已经登录，所以不需要聚焦到这个窗口
    tab = await openNewTab(ActionPage.AUTHENTICATE, false);
    timerId = setInterval(checkAuth, 5000);
  };
  return (
    <>
      {store.isAuthenicating ? (
        <Indicator text="Authenticating, please wait..." />
      ) : (
        <div onClick={startAuth} className="cursor-pointer text-center">
          <Alert type="error" message="Click here to authenticate" />
        </div>
      )}
    </>
  );
};

export default Authenticate;
