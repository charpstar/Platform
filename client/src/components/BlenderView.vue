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
                    <tr v-if="$emptyObj(files)">
                        <td>
                            <p class="emptyFiles">No files uploaded</p>
                        </td>
                    </tr>
                    <tr v-for="(file, time) in files" :key="time">
                        <td>
                            <div class="fileName">{{file}}</div>
                        </td>
                        <td>
                            <v-btn icon @click="downloadModel(file)">
                                <v-icon>mdi-cloud-download</v-icon>
                            </v-btn>
                        </td>
                        <td>
                            <v-btn icon @click="() => {deleteFile(id)}">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="column">
                <table id="itemTable">
                    <tr>
                        <td>Assigned modeler:</td>
                        <td>
                            {{model.assignedmodeler ? model.assignedmodeler.name : 'none'}}
                            <v-btn
                                v-if="account.usertype != 'Modeller'"
                                icon
                                @click="assign.modal = true"
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
                    :review="account.usertype != 'Modeller'"
                    :markdone="account.usertype == 'Modeller'"
                />
            </div>
        </div>
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
            files: {}
        };
    },
    methods: {
        onFileChange(file) {
            this.file = file;
        },
        assignModeler() {
            var vm = this;
            return backend
                .assignModeler(vm.model.modelid, vm.modeler)
                .then(data => {
                    vm.model.assignedmodeler = data;
                });
        },
        uploadModel() {
            var vm = this;
            return backend.uploadModelFile(vm.model, vm.file).then(newFile => {
                Vue.set(vm.files, newFile.time, newFile.filename);
                vm.file = false;
            });
        },
        downloadModel(filename) {
            var vm = this
            backend.downloadModelFile(vm.model, filename)
        },
        deleteFile(id) {
            this.deleteHandler.modal = true;
            this.selectedFile = id;
        },
        deleteFileConfirmed() {
            var vm = this;
            return backend
                .deleteModelFile(vm.model.modelid, vm.selectedFile)
                .then(() => {
                    Vue.delete(vm.files, vm.selectedFile);
                    vm.selectedFile = false;
                });
        }
    },
    mounted() {
        var vm = this;
        backend.getModelFiles(vm.model.modelid).then(files => {
            vm.files = files
        });
        backend.getModelers().then(modelers => {
            vm.modelers = Object.values(modelers);
        });
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