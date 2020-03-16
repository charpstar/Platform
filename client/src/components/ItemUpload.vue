<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">Upload Model</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Upload Model</v-card-title>
        <div id="fileInput">
          <fileupload v-model="android"/>
          <fileupload v-model="ios"/>
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
import fileupload from "./FileUpload";
import backend from "../backend"


export default {
  components: {
    fileupload
  },
  props: {id: {type: Number, required: true}},
  data() {
    return {
      dialog: false,
      loading: false,
      android: {
        model: "",
        metadata: "",
        image: "",
        label: "Select Android Model"
      },
      ios: {
        model: "",
        metadata: "",
        image: "",
        label: "Select IOS Model"
      }
    };
  },
  methods: {
    upload() {
      var vm = this
      vm.loading = true
      backend.uploadModels(vm.id, vm.android.model, vm.ios.model, vm.android.image).then(values => {
        vm.loading = false
        vm.dialog = false
        vm.android.model = ""
        vm.ios.model = ""
        vm.$emit('upload', values)
      })
    }
  },
  name: "itemupload"
};
</script>

<style lang="scss" scoped>
#fileInput {
  margin: 20px;
}
</style>