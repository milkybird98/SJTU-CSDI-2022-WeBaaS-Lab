// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import { AlertPlugin, ConfirmPlugin } from 'vux';
import router from './router';
import store from './store';
import App from './App';
import * as DBrequest from './api/request';

// cheat eslint
console.log(DBrequest);

let ctx = {};
ctx.appID = 'deadbeaf';
ctx.myselfID = undefined;
ctx.chatPeopleList = [];
ctx.peopleNum = undefined;
ctx.othersDataCache = [];
ctx.peopleSocket = undefined;
ctx.peopleNotifyID = undefined;

window.ctx = ctx;

Vue.prototype.$socketIoClient = window.io; // 将socket client赋给Vue实例
Vue.use(VueRouter); // 使用vue-router
Vue.use(AlertPlugin); // 使用alert插件
Vue.use(ConfirmPlugin); // 使用confirm插件

FastClick.attach(document.body);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app-box');
