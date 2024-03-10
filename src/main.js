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
const data = await onlineConfig(config.configKey);
// 存在config配置，则需要监控配置修改
if (data.hasOwnProperty('config')) {
    if (data.config) {
        // config配置不为空，则需要更新本地配置
        config.recoverSiteData(data.config);
    }
    config.$subscribe(({ newData }) => {
        onlineConfig(config.configKey, { 'config': JSON.stringify(config.$state) });
    });
}
// 同上
if (data.hasOwnProperty('site')) {
    if (data.site) {
        site.setShortcutData(data.site);
    }
    site.$subscribe(({ newData }) => {
        onlineConfig(config.configKey, { 'site': JSON.stringify(site.shortcutData) });
    });
}