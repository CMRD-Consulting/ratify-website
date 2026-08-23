import { createApp } from "vue";
import App from "./App.vue";
import reveal from "./reveal.js";
import "./styles/site.css";

createApp(App).directive("reveal", reveal).mount("#app");
