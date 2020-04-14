<template>
    <div class="modelUpload">
        <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                    <v-icon class="iconColor">mdi-cloud-upload</v-icon>
                </v-btn>
            </template>

            <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Upload Model</v-card-title>
                <div id="fileInput">
                    <fileinputmodel v-model="modelFile" />
                    <div class="flexrow">
                        
                    </div>
                </div>
                <v-divider></v-divider>

                <v-card-actions>
                    <v-checkbox v-model="thumbnail" :label="' Update Thumbnail'" color="#2196f3"></v-checkbox>
                    <v-spacer></v-spacer>
                    <v-btn class="buttons" @click="upload" :loading="loading">Upload</v-btn>
                    <v-btn class="buttons" @click="dialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import fileinputmodel from "./FileInputModel";
import backend from "../backend";

export default {
    components: {
        fileinputmodel
    },
    props: {
        product: { type: Object, required: true },
        model: { type: Object, required: true },
        uploadfun: {type: Function, required: true}
    },
    data() {
        return {
            dialog: false,
            loading: false,
            thumbnail: true,
            modelFile: {
                model: "",
                image: "",
                label: "Select Model File"
            },
        };
    },
    methods: {
        upload() {
            var vm = this
            vm.loading = true
            var promises = []
            promises.push(vm.uploadfun(vm.model, vm.product, vm.modelFile.model))
            if(vm.thumbnail) {
                promises.push(backend.uploadThumbnail(vm.model, vm.modelFile.image))
            }
            Promise.all(promises).then(values => {
                vm.loading = false
                vm.modelFile.model = ""
                vm.$emit("upload", values)
                vm.dialog = false
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.modelUpload {
    display: inline-block;
}
#fileInput {
    margin: 20px;
}
.v-label {
    margin-left: 5px;
}

.buttons {
    margin-right: 10px;
    margin-left: 10px;
}
</style>