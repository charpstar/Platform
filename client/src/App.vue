<template>
  <div id="app" data-app>
    <header2 :user="user" v-on:logout="user.isLoggedIn = false"/>
    <div id="center">
      <v-card id="card">
        <v-expand-transition>
          <login v-if="!user.isLoggedIn" v-on:login="login"/>
        </v-expand-transition>
        <v-expand-transition>
          <itemsView v-if="user.isLoggedIn && !viewItem" :items="items" v-on:view="viewItem = $event" />
        </v-expand-transition>
        <v-expand-transition>
          <itemView v-if="user.isLoggedIn && viewItem" :item="viewItem" v-on:close="viewItem = false"/>
        </v-expand-transition>
      </v-card>
    </div>
  </div>
</template>

<script>
import header2 from "./components/Header";
import login from "./components/Login";
import itemsView from "./components/Items";
import itemView from './components/Item'

export default {
  name: "App",

  components: {
    header2,
    login,
    itemsView,
    itemView
  },

  data: () => ({
    user: {
      name: "DemoClientAccount",
      isLoggedIn: false
    },
    viewItem: false,
    items: []
  }),
  methods: {
    login() {
      var vm = this
      vm.user.isLoggedIn = true
      vm.viewItem = false
    },
  },
  mounted() {
    var vm = this;
    vm.items.push({
      icon: "a_chair.jpg",
      name: "A Chair",
      status: "Complete",
      statusIcon: "check",
      modelLink: "./Astronaut.glb",
      comments: [
        {
          name: "DemoClientAccount",
          type: "client",
          message: "link to item: http://DemoClient.com/a_chair"
        },
        {
          name: "QA",
          type: "qa",
          message: "all done here!"
        }
      ]
    });
    vm.items.push({
      icon: "a_table.jpg",
      name: "A Table",
      status: "More info required",
      statusIcon: "warning",
      comments: [
        {
          name: "QA",
          type: "qa",
          message: "We need more info on the materials"
        }
      ]
    });
    for (let i = 0; i < 20; i++) {
      vm.items.push({
        icon: "a_sofa.jpg",
        name: "A Sofa",
        status: "In Development",
        statusIcon: "",
        comments: []
      })
    }
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