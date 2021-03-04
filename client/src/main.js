import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueClipboard from 'vue-clipboard2'
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

    /* Separate function to get only date */
    Vue.prototype.$formatDate = function (timestamp) {
      var now = new Date(Date.parse(timestamp));
      var date = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
      return date.join("/")
    }
    
    Vue.prototype.$emptyObj = function (obj) {
        return Object.keys(obj).length === 0
    }
  }
}

Vue.config.productionTip = false
VueClipboard.config.autoSetContainer = true

Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.use(customPlugin)

import loginView from './components/LoginView'
import adminView from "./components/AdminView";
import orderOverview from "./components/OrderOverview";
import modelOverview from "./components/ModelOverview";
import userListView from "./components/UserListView";
import userView from "./components/UserView";

/* Previously used components that are replaced here by ModelOverview and OrderOverview */

// import modelListView from "./components/ModelListView";
// import modelView from "./components/ModelView";
// import orderListView from "./components/OrderListView";
// import orderView from "./components/OrderView";

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: loginView },
    { path: '/home', component: adminView },
    { path: '/admin/users', component: userListView }, 
    { path: '/admin/orders', component: adminView }, 
    // { path: '/admin/orders', component: orderListView },
    { path: '/admin/models', component: modelOverview },
    // { path: '/admin/models', component: modelListView },
    { path: '/modeller/:id', component: modelOverview },
    // { path: '/modeller/:id', component: modelListView },
    { path: '/user/:id', component: userView },
  
    { path: '/user/:id/orders', component: orderOverview },
    // { path: '/user/:id/orders', component: orderListView },

    { path: '/order/:id/models', component: modelOverview },
    // { path: '/order/:id/models', component: modelListView },

    /* Where is this route used? */
    /* replace with component: modelOverview if route is used */
    // { path: '/user/:id/models', component: modelListView },
    
    /* this path is not necessary when we use the OrderOverview component */
    // { path: '/order/:id', component: orderView }

    /* this path is not necessary when we use the ModelOverview component */
    // { path: '/model/:id', component: modelView }

  ]
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
