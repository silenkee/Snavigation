import { createApp } from "vue";
// Pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// IconFont
import SvgIcon from "@/components/SvgIcon.vue";
// 主组件
import App from "@/App.vue";
// 全局样式
import "@/style/global.scss";
import { siteStore, setStore } from "@/stores";
import { onlineConfig } from "./api";

// 根组件
const app = createApp(App);

// Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 挂载
app.use(pinia);
app.component("SvgIcon", SvgIcon);
app.mount("#app");

// api获取，写入本地配置
const config = setStore();
const site = siteStore();
const data = await onlineConfig(null);
if (data.hasOwnProperty('config')) {
    config.recoverSiteData(data.config)
    config.$subscribe(({ newData }) => {
        console.log(config);
        onlineConfig({ 'config': config.$state });
    });
}
if (data.hasOwnProperty('site')) {
    site.setShortcutData(data.site);
    site.$subscribe(({ newData }) => {
        console.log(site);
        onlineConfig({ 'site': site.shortcutData });
    });
}