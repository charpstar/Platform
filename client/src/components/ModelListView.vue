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
        <v-btn id="buttonNew" @click="dialog = true">New Model<v-icon right>mdi-file-plus</v-icon></v-btn>
    </div>
    <div id="itemsView">
        <v-data-table id="table" :headers="headers" :items="order.models" :items-per-page="-1" @click:row="handleClick">
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
    order: {required: true, type: Object},
    user: { required: true, type: Object}
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
          backend.addNewModel(vm.order, vm.name).then(model => {
              vm.loading = false,
              vm.dialog = false,
              vm.name = ''
              vm.order.models.push(model)
          })
      }
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