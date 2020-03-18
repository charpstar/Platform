<template>
  <div id="app" data-app>
    <topBar :user="user" :loggedIn="view != 'login'" @logout="view = 'login'"/>
    <div id="center">
      <v-card class="card">
        <transitionExpandHeight>
          <loginView v-if="view == 'login'" v-on:login="login"/>
        </transitionExpandHeight>

        <transitionExpandHeight>
          <orderListView 
          v-if="view == 'orderList'" 
          :orders="orders" 
          :user="user" 
          @back="view = 'overview'"
          @select="order = $event; view = 'order'"/>
        </transitionExpandHeight>

        <transitionExpandHeight>
          <orderView 
          v-if="view == 'order'" 
          :order="order" 
          :user="user" 
          @back="view = 'orderList'"
          @view-models="view = 'modelList'"/>
        </transitionExpandHeight>

        <transitionExpandHeight>
          <modelListView 
          v-if="view == 'modelList'"
          :order="order" 
          :user="user"
          @back="view = 'order'"
          @select="model = $event; view = 'model'"/>
        </transitionExpandHeight>

        <transitionExpandHeight>
          <modelView 
          v-if="view == 'model'"
          :order="order" 
          :user="user"
          :model="model"
          @back="view = 'modelList'"/>
        </transitionExpandHeight>

      </v-card>
    </div>
  </div>
</template>

<script>
import transitionExpandHeight from "./components/TransitionExpandHeight"
import topBar from "./components/TopBar";
import loginView from "./components/LoginView";
import orderListView from "./components/OrderListView"
import orderView from './components/OrderView'
import modelListView from './components/ModelListView'
import modelView from './components/ModelView'


import backend from "./backend"

export default {
  name: "App",

  components: {
    transitionExpandHeight,
    topBar,
    loginView,
    orderListView,
    orderView,
    modelListView,
    modelView
  },

  data: () => ({
    view: "login",
    user: {
      name: "",
      type: ""
    },
    orders: [],
    order: {},
    models: [],
    model: {}
  }),
  methods: {
    login(user) {
      var vm = this
      vm.user = user
      backend.getOrders(user.id).then(orders => {
        vm.orders = orders
        vm.view = "orderList"
      })
    },
    getItems(obj){
      var vm = this
      backend.getItems(obj.id).then((items) => {
        vm.items = items
        vm.view = "items"
      })
    },
  },
  mounted() {
    backend.init()
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  background-color: grey;
  height: 100vh;
  font-family: "Roboto";
}

.view{
  width: 80vw;
}

p,
a,
h1 {
  color: grey;
}

h2 {
    font-weight: normal;
    color: grey;
    margin: 0;
    padding: 0;
    font-size: 30px;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: grey;
}

#center {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 20px;
  background-color: white;
}

.flexrow {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flexcol {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.v-data-footer {
    display: none !important;
}

th {
    text-align: start;
}
</style>