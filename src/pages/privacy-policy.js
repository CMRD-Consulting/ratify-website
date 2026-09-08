import { createApp } from "vue";
import PrivacyPolicyPage from "./PrivacyPolicyPage.vue";
import { startTheme } from "../theme.js";
import "../styles/site.css";

// public/theme-boot.js already painted the theme; this keeps it in step with
// macOS and powers the switcher. Same two lines as src/main.js — see there.
startTheme();

// No `reveal` directive registered: these pages have no scroll animation.
// Directives are per-app, so registering one that nothing uses would only
// hide the fact that it is unused.
createApp(PrivacyPolicyPage).mount("#app");
