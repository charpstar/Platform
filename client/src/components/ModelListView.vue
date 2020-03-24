<template>
<div>
    <v-dialog v-model="dialog" width="500">
        <div class="card">
        <v-text-field label="Name" v-model="name" />
        <v-btn :loading="loading" @click="newModel">New Model</v-btn>
        </div>
    </v-dialog>
    <div class="flexrow" id="topRow">
        <div class="flexrow ">
            <v-btn icon class="hidden-xs-only" >
                <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
            </v-btn>
            <h2>Models</h2>
        </div>
        <v-btn id="buttonNew" @click="dialog = true" v-if="!emptyObj(order)">New Model<v-icon right>mdi-file-plus</v-icon></v-btn>
    </div>
    <div id="itemsView">
        <v-data-table id="table" :headers="headers" :items="Object.values(models)" :items-per-page="-1" @click:row="handleClick">
            <template v-slot:item.thumbnail="{value}">
            <img :src="value" class="thumbnail" />
            </template>
            <template v-slot:item.statusicon="{value}">
            <i class="material-icons">{{value}}</i>
            </template>
        </v-data-table>
    </div>
</div>
</template>

<script>
import backend from '../backend'
export default {
  props: {
    order: {type: Object},
    models: {required: true, typ: Object}
  },
  data() {
    return {
      headers: [
        { text: "", align: "left", sortable: false, value: "thumbnail" },
        { text: "Name", value: "name", align: "left" },
        { text: "Status", value: "status", align: "left" },
        { text: "", value: "statusicon", align: "left", sortable: false },
      ],
      dialog: false,
      loading: false,
      name: ''
    };
  },
  methods: {
      handleClick(value) {
          this.$emit("select", value)
      },
      newModel() {
          var vm = this
          vm.loading = true;
          backend.newModel(vm.order.orderid, vm.order.clientid, vm.name).then(model => {
              vm.loading = false,
              vm.dialog = false,
              vm.name = ''
              vm.models[model.modelid] = model
          })
      },
      emptyObj(obj) {
          return Object.keys(obj).length === 0
      },
  }
};
</script>

<style lang="scss" scoped>
#topRow {
    justify-content: space-between;
    margin-bottom: 10px;
}
#table {
  max-height: 70vh;
  overflow: auto;
  width: 80vw;
}

.thumbnail {
  max-width: 50px;
}
th {
  text-align: start;
}
</style>