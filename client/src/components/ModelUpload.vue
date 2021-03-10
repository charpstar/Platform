<template>
    <div class="modelUpload">
        <v-dialog v-model="handler.modal" width="500">
            <template v-slot:activator="{ on }">
                <v-btn class="secondaryBtn" outlined rounded v-on="on">
                    <span>Upload</span>
                    <v-icon>mdi-cloud-upload</v-icon>
                    <!-- <v-icon class="iconColor">mdi-cloud-upload</v-icon> -->
                </v-btn>
            </template>

            <v-card>
                <v-card-title>Upload Model</v-card-title>
                <!-- <v-card-title class="headline grey lighten-2" primary-title>Upload Model</v-card-title> -->
                <div id="fileInput">
                    <fileinputmodel v-model="modelFile" />
                    <div class="flexrow"></div>
                </div>
                <v-divider></v-divider>
                <p class="error-text" v-if="handler.error">{{handler.error}}</p>
                <p class="error-text" v-if="error">{{error}}</p>
                <v-card-actions>
                    <v-checkbox v-model="thumbnail" :label="' Update Thumbnail'" color="#2196f3"></v-checkbox>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="uploadBtn"
                        rounded
                        @click="handler.execute"
                        :loading="handler.loading"
                        :disabled="!modelFile.file || !(!thumbnail || modelFile.image) ||!!error"
                    >
                        <!-- Upload -->
                        Upload
                    </v-btn>
                    <v-btn 
                        class="secondaryBtn"
                        rounded 
                        outlined
                        @click="handler.modal = false"
                    >
                        Cancel
                    </v-btn>
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
        uploadfun: { type: Function, required: true },
        filetype: {type: String, required: true}
    },
    data() {
        return {
            handler: backend.promiseHandler(this.upload),
            thumbnail: false,
            modelFile: {
                file: false,
                model: "",
                image: "",
                label: "Select Model File"
            }
        };
    },
    computed: {
        open() {
            return this.handler.modal;
        },
        error() {
            if(this.modelFile.file && this.modelFile.file.name.split('.').pop() != this.filetype) {
                return "Unsupported extension, please use ." + this.filetype;
            }
            return false;
        }
    },
    methods: {
        upload() {
            var vm = this;
            var promises = [];
            promises.push(
                vm.uploadfun(vm.product, vm.modelFile.file)
            );
            if (vm.thumbnail) {
                promises.push(
                    backend.uploadThumbnail(vm.model.modelid, vm.modelFile.image)
                );
            }
            return Promise.all(promises).then(values => {
                vm.modelFile.model = "";
                vm.$emit("upload", values);
            });
        }
    },
    watch: {
        open(val) {
            this.$emit("opened", val);
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
.error-text {
    padding-left: 20px;
}

// .buttons {
//     margin-right: 10px;
//     margin-left: 10px;
// }

.v-card__title{
    justify-content: center;
    color: #515151;
    font-weight: normal;
}
.uploadBtn {
    color: white;
    margin-right: 10px;
    margin-left: 10px;  
}

.secondaryBtn {
    background-color: white !important;
    color: #1FB1A9;
    margin-right: 20px;
    margin-left: 5px;
    span {
        margin-right: 0.5em;
    }
}


</style>