<template>
  <div id="header">
    <div class="row">
      <p>3D asset management system</p>
    </div>
    <div v-if="loggedIn">
      <v-menu offset-y v-model="menuOpen" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-btn text id="menuButton" v-on="on"><p class="notification-badge" v-if="Object.values(notifications).length > 0">{{Object.values(notifications).length}}<p>{{account.name}}</p><i class="material-icons" id="acountIcon">account_circle</i></v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" @click="item.click">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item v-for="(item, id) in notifications" :key='"notification" + id' @click="1">
            <p class="notification-small"></p><v-list-item-title>{{ item.message }}</v-list-item-title>
            <v-btn icon @click="closeNotification(id)"><v-icon>mdi-close</v-icon></v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {

  name: "header2",
  props: {
    loggedIn: { type: Boolean, required: true},
    account: { type: Object, required: true},
    notifications: {type: Object, required: true}
  },
  data: () => ({
    items: [],
    menuOpen: false
  }),
  methods: {
    logout() {
      this.$emit('logout')
    },
    closeNotification(id) {
      Vue.delete(this.notifications, id)
    }
  },
  mounted() {
    var vm = this
    vm.items = [
      { title: "Log out",  click: () => {vm.logout(); vm.menuOpen = false} },
      { title: "Support",  click: () => {window.location.href = "https://www.charpstar.se/"; vm.menuOpen = false} }
    ]
  }
};
</script>


<style lang="scss" scoped>
#menuButton {
  background-color: white !important;
}
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

.notification-badge {
  border-radius: 12px;
  background-color: #2196F3;
  width: 24px;
  height: 24px;
  font-size: 20px !important;
  color: black !important;
  font-weight: normal !important;
}
.notification-small {
  display: block;
  border-radius: 8px;
  background-color: #2196F3;
  width: 20px !important;
  height: 16px;
  margin-right: 5px;
  font-size: 16px !important;
  color: black !important;
  font-weight: normal !important;
}

#acountIcon {
  color: grey;
  font-size: 24px;
}

</style>
