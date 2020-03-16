import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

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

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
