<template>
    <div id="item">
        <v-dialog v-model="assignDialog" width="500">
            <div class="card">
                <v-select :items="modelers" label="Modeler" v-model="modeler">
                    <template v-slot:item="{item}">
                        <span>{{item.name}}</span>
                    </template>
                    <template v-slot:selection="{item}">
                        <span>{{item.name}}</span>
                    </template>
                </v-select>
                <v-btn :loading="assignLoading" @click="assignModeler">Assign</v-btn>
            </div>
        </v-dialog>
        <v-dialog v-model="uploadDialog" width="500">
            <div class="card">
                <v-file-input :label="'Select file'" @change="onFileChange"></v-file-input>
                <v-btn :loading="uploadLoading" @click="uploadModel">Upload</v-btn>
            </div>
        </v-dialog>
        <v-dialog v-model="deleteDialog" width="250px">
            <div class="card flexcol">
                <h2>Confirm Delete</h2>
                <v-btn @click="deleteFileConfirmed" class="buttons">Confirm</v-btn>
                <v-btn @click="deleteDialog = false" class="buttons">Cancel</v-btn>
            </div>
        </v-dialog>
        <div class="flexrow" id="itemsrow">
            <div class="column">
                <div class="flexrow">
                    <p>Files</p>
                    <v-btn icon @click="uploadDialog = true">
                        <v-icon class="iconColor">mdi-cloud-upload</v-icon>
                    </v-btn>
                </div>
                <table class="fileList">
                    <tr v-for="(file, id) in model.files" :key="id">
                        <td>
                            <div class="fileName">{{file.name}}</div>
                        </td>
                        <td>
                            <a :href="file.link" target="_blank">
                                <v-icon>mdi-cloud-download</v-icon>
                            </a>
                        </td>
                        <td>
                            <v-btn icon @click="() => {deleteFile(id)}">
                                <v-icon >mdi-close</v-icon>
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
                                @click="assignDialog = true"
                            >
                                <v-icon class="iconColor">mdi-account-plus</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </table>

                <h2 id="commentsLabel">Comments</h2>
                <comments
                    :account="account"
                    :comments="model.comments"
                    @comment="sendComment"
                    :review="true"
                />
            </div>
        </div>
    </div>
</template>
<script>
import backend from "./../backend";
import comments from "./CommentView";
import Vue from 'vue'

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
            assignDialog: false,
            assignLoading: false,
            uploadDialog: false,
            uploadLoading: false,
            deleteDialog: false,
            deleteLoading: false,
            selectedFile: false,
            modelers: [],
            modeler: false,
            file: ""
        };
    },
    methods: {
        onFileChange(file) {
            this.file = file
        },
        sendComment() {
            var vm = this;
            backend.updateModelComments(vm.model);
        },
        assignModeler() {
            var vm = this;
            vm.assignLoading = true;
            backend.assignModeler(vm.model.modelid, vm.modeler).then(data => {
                vm.assignLoading = false;
                vm.assignDialog = false;
                vm.model.assignedmodeler = data;
            });
        },
        uploadModel() {
            var vm = this;
            vm.uploadLoading = true;
            backend.uploadModelFile(vm.model, vm.file).then(newFile => {
                vm.model.files[newFile.id] = newFile
                vm.uploadLoading = false;
                vm.uploadDialog = false;
                vm.file = false;
            });
        },
        deleteFile(id) {
            this.deleteDialog = true
            this.selectedFile = id
        },
        deleteFileConfirmed() {
            var vm = this
            vm.deleteLoading = true
            backend.deleteModelFile(vm.model.modelid, vm.selectedFile).then(() => {
                vm.deleteLoading = false
                vm.deleteDialog = false
                Vue.delete(vm.model.files, vm.selectedFile)
                vm.selectedFile = false
            })
        }
    },
    mounted() {
        var vm = this;
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
.buttons {
    margin-top: 10px;
}
</style>