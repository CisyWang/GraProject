import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import axios from "axios"

import fabric from "fabric";
Vue.use(fabric);

import VueTouch from "vue-touch";
Vue.use(VueTouch, { name: "v-touch" });

// import Bus from "./library/Bus/bus";
// Vue.use(Bus);

import element from "./element/index";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/index.scss";

import lutils from "./library/utils";

Vue.prototype.$axios = axios;
Vue.prototype.$utils = lutils;

Vue.config.productionTip = false;
Vue.use(element);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// 用于子组件通信
Vue.prototype.$Bus = new Vue();
