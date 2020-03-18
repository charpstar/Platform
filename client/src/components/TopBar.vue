<template>
  <div id="header">
    <div class="row">
      <p>3D asset management system</p>
    </div>
    <div v-if="loggedIn">
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
    user: { type: Object, required: true },
    loggedIn: { type: Boolean, required: true}
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


<style lang="scss" scoped>
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
    font-size: 24px;
    padding: 0;
    margin-left: 10px;
    color: grey;
  }
  > * {
    margin-top: auto;
    margin-bottom: auto;
  }
}

#acountIcon {
  color: grey;
  font-size: 24px;
}

</style>
