<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">Upload Model</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Upload Model</v-card-title>
        <div id="fileInput">
          <v-file-input multiple chips label="Select Models"></v-file-input>
          <v-btn>Upload</v-btn>
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
export default {
  data() {
    return {
      dialog: false
    };
  },
  name: "itemupload"
};
</script>

<style lang="scss" scoped>
#fileInput {
  margin: 20px;
}
</style>