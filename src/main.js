import { createApp } from "vue";
import App from "./App.vue";
import reveal from "./reveal.js";
import { startTheme } from "./theme.js";
import "./styles/site.css";

// public/theme-boot.js already painted the theme before the first frame; this
// picks it up and keeps it honest when macOS flips underneath us.
startTheme();

createApp(App).directive("reveal", reveal).mount("#app");
