<template>
  <div id="app" data-app>
    <header2 :user="user" :loggedIn="view != 'login'" v-on:logout="view = 'login'"/>
    <div id="center">
      <v-card id="card">
        <transitionExpandHeight>
          <login v-if="view == 'login'" v-on:login="login"/>
        </transitionExpandHeight>

        <transitionExpandHeight>
          <itemsView v-if="view == 'items'" :items="items" v-on:viewI="viewItem" :selectClient="user.type != 'client'" v-on:backToClients="view = 'clients'"/>
        </transitionExpandHeight>

        <transitionExpandHeight>
          <clientView v-if="view == 'clients'" :clients="clients" v-on:clientSelect="getItems" />
        </transitionExpandHeight>

        <transitionExpandHeight>
          <itemView v-if="view == 'item'" :item="item" v-on:close="view = 'items'" :user="user"/>
        </transitionExpandHeight>
      </v-card>
    </div>
  </div>
</template>

<script>
import header2 from "./components/Header";
import login from "./components/Login";
import itemsView from "./components/Items";
import itemView from './components/Item'
import clientView from "./components/ClientView"

import transitionExpandHeight from "./components/TransitionExpandHeight"

import backend from "./backend"

export default {
  name: "App",

  components: {
    header2,
    login,
    itemsView,
    itemView,
    transitionExpandHeight,
    clientView
  },

  data: () => ({
    view: "login",
    user: {
      name: "",
      type: ""
    },
    item: false,
    items: [],
    clients: []
  }),
  methods: {
    login(data) {
      var vm = this
      vm.item = false
      vm.user.name = data.name
      vm.user.type = data.type
      if(data.type == "client") {
        vm.getItems({id: 1})
      } else {
        backend.getClients().then((clients) => {
          vm.clients = clients
          vm.view = "clients"
        })
      }
    },
    getItems(obj){
      var vm = this
      backend.getItems(obj.id).then((items) => {
        vm.items = items
        vm.view = "items"
      })
    },
    viewItem(i) {
      var vm = this
      vm.item = i
      vm.view = "item"
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

p,
a,
h1 {
  color: grey;
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

#card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 40px;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
}
</style>