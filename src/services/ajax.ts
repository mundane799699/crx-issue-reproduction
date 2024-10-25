import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_HOST}/api`,
  timeout: 30 * 1000,
});

instance.interceptors.response.use((res) => {
  const { data } = res;
  return data as any;
});

export default instance;
