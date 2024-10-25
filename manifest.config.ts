import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

export default defineManifest({
  name: "Xlike likes for X/Twitter",
  author: {
    email: "zfyoung799699@gmail.com",
  },
  description: "Sync and Search your Twitter Likes",
  version,
  manifest_version: 3,
  icons: {
    16: "icon16.png",
    32: "icon32.png",
    48: "icon48.png",
    128: "icon128.png",
  },
  action: {},
  options_ui: {
    page: "index.html",
    open_in_tab: true,
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://x.com/*"],
      js: ["src/content.ts"],
      run_at: "document_start",
    },
  ],
  host_permissions: [
    "https://x.com/*",
    "http://localhost:3000/*",
    "http://localhost:5173/*",
  ],
  content_security_policy: {
    extension_pages:
      "script-src 'self' http://localhost:5173; object-src 'self'",
  },
  permissions: ["storage", "webRequest", "tabs"],
});
