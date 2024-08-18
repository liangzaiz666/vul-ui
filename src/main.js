import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import locale from 'element-plus/es/locale/lang/zh-cn';
import * as ElIconModules from '@element-plus/icons'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import naive from "naive-ui";
import Echarts from 'vue-echarts';

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(naive);
app.use(ElementPlus, {locale});
for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}
app.mount('#app')
app.component('ECharts',Echarts)
