<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">Upload Model</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Upload Model</v-card-title>
        <div id="fileInput">
          <fileinputmodel v-model="android"/>
          <fileinputmodel v-model="ios"/>
          <v-btn @click="upload" :loading="loading">Upload</v-btn>
        </div>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import fileinputmodel from "./FileInputModel";
import backend from "../backend"


export default {
  components: {
    fileinputmodel
  },
  props: {model: {type: Object, required: true}},
  data() {
    return {
      dialog: false,
      loading: false,
      android: {
        model: "",
        image: "",
        label: "Select Android Model"
      },
      ios: {
        model: "",
        image: "",
        label: "Select IOS Model"
      }
    };
  },
  methods: {
    upload() {
      var vm = this
      vm.loading = true
      backend.uploadModels(vm.model, vm.android.model, vm.ios.model, vm.android.image).then(values => {
        vm.loading = false
        vm.dialog = false
        vm.android.model = ""
        vm.ios.model = ""
        vm.$emit('upload', values)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
#fileInput {
  margin: 20px;
}
</style>