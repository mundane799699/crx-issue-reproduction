import { create } from "zustand";
import { CountInfo, Tweet } from "../utils/types";

type LikesStore = {
  keyword: string;
  category: string;
  folder: string;
  pageSize: number;
  totalCount: null | CountInfo;
  likes: Tweet[];
  hasMore: boolean;
  isAuthFailed: boolean;
  isAuthenicating: boolean;
  isSyncing: boolean;
  addLikes: (likes: Tweet[]) => void;
  deleteLike: (tweet: Tweet) => void;
  setLikes: (likes: Tweet[]) => void;
  setTotalCount: (totalCount: CountInfo) => void;
  setHasMore: (hasMore: boolean) => void;
  setKeyword: (keyword: string) => void;
  setIsAuthFailed: (isAuthFailed: boolean) => void;
  setIsAuthenicating: (isAuthenicating: boolean) => void;
  setIsSyncing: (isSyncing: boolean) => void;
};

const useLikesStore = create<LikesStore>((set) => ({
  keyword: "",
  category: "",
  folder: "",
  pageSize: 100,
  totalCount: null,
  likes: [],
  hasMore: true,
  isAuthFailed: false,
  isAuthenicating: false,
  isSyncing: false,
  addLikes: (likes: Tweet[]) =>
    set((state) => ({ likes: [...state.likes, ...likes] })),
  deleteLike: (tweet: Tweet) =>
    set((state) => ({ likes: state.likes.filter((t) => t.id !== tweet.id) })),
  setLikes: (likes: Tweet[]) => set({ likes }),
  setTotalCount: (totalCount: CountInfo) => set({ totalCount }),
  setHasMore: (hasMore: boolean) => set({ hasMore }),
  setKeyword: (keyword: string) => set({ keyword }),
  setIsAuthFailed: (isAuthFailed: boolean) => set({ isAuthFailed }),
  setIsAuthenicating: (isAuthenicating: boolean) => set({ isAuthenicating }),
  setIsSyncing: (isSyncing: boolean) => set({ isSyncing }),
}));

export default useLikesStore;
