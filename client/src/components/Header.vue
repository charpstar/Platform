<template>
  <div id="header">
    <div class="row">
      <img src="charpstar.png" id="logo" />
      <p>Charpstar 3D model platform thing™</p>
    </div>
    <div v-if="user.isLoggedIn">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text id="menuButton" v-on="on"><p>{{user.name}}</p><i class="material-icons" id="acountIcon">account_circle</i></v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" @click="item.click">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "header2",
  props: {
    user: { type: Object, required: true }
  },
  data: () => ({
    items: []
  }),
  methods: {
    logout() {
      this.$emit('logout')
    }
  },
  mounted() {
    var vm = this
    vm.items = [
      { title: "Settings", click: () => {} },
      { title: "Log out",  click: vm.logout },
      { title: "Support",  click: () => {} }
    ]
  }
};
</script>


<style lang="scss">
#header {
  display: flex;
  flex-direction: row;
  padding: 10px;
  background-color: white;
  justify-content: space-between;
  .row {
    flex-grow: 0;
  }
  p {
    font-size: 32px;
    padding: 0;
    margin: 0;
    margin-top: auto;
    margin-bottom: auto;
    color: grey;
  }
}

#logo {
  max-width: 70px;
}

#acountIcon {
  color: grey;
  font-size: 60px;
}
#menuButton {
  height: 70px;
}
</style>