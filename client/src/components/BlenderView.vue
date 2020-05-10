<template>
    <div id="item">
        <v-dialog v-model="assign.modal" width="500">
            <div class="card">
                <v-select :items="modelers" label="Modeler" v-model="modeler">
                    <template v-slot:item="{item}">
                        <span>{{item.name}}</span>
                    </template>
                    <template v-slot:selection="{item}">
                        <span>{{item.name}}</span>
                    </template>
                </v-select>
                <v-btn :loading="assign.loading" @click="assign.execute" :disabled="!modeler">Assign</v-btn>
                <p class="error-text" v-if="assign.error">{{assign.error}}</p>
            </div>
        </v-dialog>
        <v-dialog v-model="upload.modal" width="500">
            <div class="card">
                <v-file-input :label="'Select file'" @change="onFileChange"></v-file-input>
                <v-btn :loading="upload.loading" @click="upload.execute" :disabled="!file">Upload</v-btn>
            </div>
        </v-dialog>
        <v-dialog v-model="deleteHandler.modal" width="250px">
            <div class="card flexcol">
                <h2>Confirm Delete</h2>
                <v-btn
                    @click="deleteHandler.execute"
                    class="buttons"
                    :loading="deleteHandler.loading"
                >Confirm</v-btn>
                <p class="error-text" v-if="deleteHandler.error">{{deleteHandler.error}}</p>
                <v-btn @click="deleteHandler.modal = false" class="buttons">Cancel</v-btn>
            </div>
        </v-dialog>
        <div class="flexrow" id="itemsrow">
            <div class="column">
                <div class="flexrow">
                    <p>Files</p>
                    <v-btn icon @click="upload.modal = true">
                        <v-icon class="iconColor">mdi-cloud-upload</v-icon>
                    </v-btn>
                </div>
                <table class="fileList">
                    <tr v-if="model.files.length == 0">
                        <td>
                            <p class="emptyFiles">No files uploaded</p>
                        </td>
                    </tr>
                    <tr v-for="(file, index) in model.files" :key="file">
                        <td>
                            <div class="fileName">{{file}}</div>
                        </td>
                        <td>
                            <v-btn icon @click="downloadModel(file)">
                                <v-icon>mdi-cloud-download</v-icon>
                            </v-btn>
                        </td>
                        <td>
                            <v-btn icon @click="() => {deleteFile(index)}">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="column">
                <table id="itemTable">
                    <tr>
                        <td>Status</td>
                        <td>
                            {{backend.messageFromStatus(model.state, account.usertype)}}
                            <v-icon>{{backend.iconFromStatus(model.state, account.usertype)}}</v-icon>
                        </td>
                    </tr>
                    <tr>
                        <td>Assigned modeler:</td>
                        <td>
                            {{model.modelowner ? model.modelowner : 'None'}}
                            <v-btn
                                v-if="account.usertype != 'Modeller'"
                                icon
                                @click="openAssign"
                            >
                                <v-icon class="iconColor">mdi-account-plus</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </table>

                <h2 id="commentsLabel">Comments</h2>
                <comments
                    v-if="model.modelid"
                    :idobj="{modelid: model.modelid}"
                    :type="'Model'"
                    :review="account.usertype != 'Modeller' && model.state == 'ProductReview' && model.modelowner != null"
                    :markdone="account.usertype == 'Modeller' && ['ProductDev', 'ProductRefine', 'ClientFeedback'].includes(model.state)"
                    :markdonedisabled="model.files.length == 0"
                    :markinfo="account.usertype == 'Modeller' && ['ProductDev', 'ProductRefine', 'ClientFeedback'].includes(model.state)"
                    :markresolve="account.usertype != 'Modeller' && model.state == 'ProductMissing'"
                    @state="$emit('state', $event)"
                />
            </div>
        </div>
        <v-snackbar v-model="assignSnackbar" :timeout="3000">Cannot assign modeller until order is claimed by a QA</v-snackbar>
    </div>
</template>
<script>
import backend from "./../backend";
import comments from "./CommentView";
import Vue from "vue";

export default {
    components: {
        comments
    },
    props: {
        model: { type: Object, required: true },
        account: { type: Object, required: true }
    },
    data() {
        return {
            assign: backend.promiseHandler(this.assignModeler),
            upload: backend.promiseHandler(this.uploadModel),
            deleteHandler: backend.promiseHandler(this.deleteFileConfirmed),
            selectedFile: false,
            modelers: [],
            modeler: false,
            file: "",
            backend: backend,
            assignSnackbar: false,
        };
    },
    methods: {
        openAssign() {
            var vm = this;
            if(vm.model.state == 'ProductReceived') {
                vm.assignSnackbar = true;
            } else {
                vm.assign.modal = true;
            }
        },
        onFileChange(file) {
            this.file = file;
        },
        assignModeler() {
            var vm = this;
            return backend
                .assignModeler(vm.model.modelid, vm.modeler.userid)
                .then(data => {
                    if(vm.model.state == 'ProductReceived' || vm.model.state == 'ProductReview' ) {
                        vm.model.state = 'ProductDev';
                    }
                    vm.model.modelowner = data.userdata.name;
                    vm.modeler = false;
                });
        },
        uploadModel() {
            var vm = this;
            return backend.uploadModelFile(vm.model.modelid, vm.file).then(newFile => {
                vm.model.files.push(newFile.filename);
                vm.file = false;
            });
        },
        downloadModel(filename) {
            var vm = this
            backend.downloadModelFile(vm.model.modelid, filename)
        },
        deleteFile(file) {
            this.deleteHandler.modal = true;
            this.selectedFile = file;
        },
        deleteFileConfirmed() {
            var vm = this;
            return backend
                .deleteModelFile(vm.model.modelid, vm.model.files[vm.selectedFile])
                .then(() => {
                    Vue.delete(vm.model.files, vm.selectedFile);
                    vm.selectedFile = false;
                });
        }
    },
    mounted() {
        var vm = this;
        backend.getModelFiles(vm.model.modelid).then(files => {
            vm.$set(vm.model, 'files', Object.values(files))
        });
        if(vm.account.usertype != 'Modeller') {
            backend.getModelers().then(modelers => {
                vm.modelers = Object.values(modelers);
            });
        }

    }
};
</script>

<style lang="scss" scoped>
#item {
    width: 80vw;
}
#itemTable {
    font-size: 20px;
    color: grey;
    td {
        padding-right: 20px;
    }
}
#modelView {
    width: 400px;
    height: 400px;
    margin: 20px;
}
#itemsrow {
    align-items: flex-start;
}
#topRow {
    justify-content: start;
}

.column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

#default-progress-bar {
    display: none !important;
}

.fileList {
    width: 400px;
    background-color: #cccccc;
    td {
        border: none;
    }
    max-height: 60px;
    overflow-y: scroll;
    margin-right: 20px;
}

.fileName {
    width: 300px;
    padding-left: 10px;
}

.emptyFiles {
    width: 300px;
    padding-left: 10px;
    font-style: italic;
}

.buttons {
    margin-top: 10px;
}
</style>