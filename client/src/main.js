import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueClipboard from 'vue-clipboard2'

import firebase from "firebase/app"
import 'firebase/database';
import 'firebase/storage'

var config = {
  apiKey: "AIzaSyCsL0073emSNV-4drHv0Z9m7kD5htx7Xig",
  authDomain: "mvk-charpstar.firebaseapp.com",
  databaseURL: "https://mvk-charpstar.firebaseio.com",
  projectId: "mvk-charpstar",
  storageBucket: "mvk-charpstar.appspot.com",
  messagingSenderId: "303757422323",
  appId: "1:303757422323:web:549c8559145f377de19186"
}

firebase.initializeApp(config)

import loginView from './components/LoginView'
import adminView from "./components/AdminView";
import orderListView from "./components/OrderListView";
import orderView from "./components/OrderView";
import modelListView from "./components/ModelListView";
import modelView from "./components/ModelView";
import userListView from "./components/UserListView";
import userView from "./components/UserView";

Vue.config.productionTip = false
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: loginView },
    { path: '/home', component: adminView },
    { path: '/admin/users', component: userListView },
    { path: '/admin/orders', component: orderListView },
    { path: '/admin/models', component: modelListView },
    { path: '/modeller/models', component: modelListView },
    { path: '/user/:id', component: userView },
    { path: '/user/:id/orders', component: orderListView },
    { path: '/user/:id/models', component: modelListView },
    { path: '/order/:id', component: orderView },
    { path: '/order/:id/models', component: modelListView },
    { path: '/model/:id', component: modelView },

  ]
})

const customPlugin = {
  install(Vue) {
    Vue.prototype.$formatTime = function (timestamp) {
      var now = new Date(Date.parse(timestamp));
      var date = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
      var time = [now.getHours(), now.getMinutes()];
      for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
          time[i] = "0" + time[i];
        }
      }
      return date.join("/") + " " + time.join(":")
    }
  }
}
Vue.use(customPlugin)
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
