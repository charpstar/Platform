<template>
    <div id="item">
        <edittextmodal :label="'model name'" :handler="editname" :text="model.modelname">Edit product parent model</edittextmodal>
        <!-- <v-dialog v-model="assign.modal" width="500">
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
        </v-dialog> -->
        <v-dialog v-model="upload.modal" width="500">
            <div class="card">
                <h3>Upload File</h3>
                <v-file-input :label="'Select file'" @change="onFileChange" color="#1FB1A9"></v-file-input>
                <p class="uploadButtons">
                    <v-btn 
                        class="uploadBtn"
                        rounded
                        :loading="upload.loading" 
                        @click="upload.execute" 
                        :disabled="!file">
                        Upload
                    </v-btn>
                    <v-btn 
                        class="secondaryBtn"
                        rounded 
                        outlined
                        @click="upload.modal = false"
                    >
                        Cancel
                    </v-btn>
                </p>

            </div>
        </v-dialog>
        <v-dialog v-model="deleteHandler.modal" width="250px">
            <!-- <div class="card flexcol"> -->
                <div class="card">
                <h3>Confirm Delete</h3>
                <div class="buttons">
                    <div class="confirm">
                        <v-btn
                            @click="deleteHandler.execute"
                            class="buttons"
                            :loading="deleteHandler.loading"
                            rounded
                            small
                            outlined
                            id="confirmBtn">
                            Confirm
                        </v-btn>
                    <p class="error-text" v-if="deleteHandler.error">{{deleteHandler.error}}</p>
                    </div>

                    <v-btn 
                        @click="deleteHandler.modal = false" 
                        class="buttons"
                        rounded 
                        small
                        dark>
                        Cancel
                    </v-btn>
                </div>

            </div>
        </v-dialog>
        <!-- <div class="flexrow" id="itemsrow"> -->
        <div id="itemsrow">
            <div class="column">
                <p id="modeller">
                    Assigned modeller: {{model.modelowner ? model.modelowner : 'None'}}
                </p>
                <!-- If we want to display model status -->
                <p id="status">
                    Status: {{backend.messageFromStatus(model.state, account.usertype)}}
                    <!-- <v-icon>{{backend.iconFromStatus(model.state, account.usertype)}}</v-icon> --> 
                </p>
                <!-- <div class="flexrow">
                    <p>Files</p>
                    <v-btn icon @click="upload.modal = true">
                        <v-icon class="iconColor">mdi-cloud-upload</v-icon>
                    </v-btn>
                </div> -->
                <!-- <table class="fileList">
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
                </table> -->
                <!-- Replaced with: -->
                <div class="fileList">
                    <p class="emptyFiles" v-if="model.files.length == 0">
                        No files uploaded
                    </p>
                    <div class="flexrow" v-for="(file, index) in model.files" :key="file">
                        <p class="fileName">{{file}}</p>
                        <div class="fileButtons">
                            <p>
                            <v-btn class="actionBtn" rounded @click="downloadModel(file)">
                                <span>Download</span> 
                                <v-icon>mdi-cloud-download</v-icon>
                            </v-btn>
                        </p>
                        <p>
                            <v-btn 
                            id="deleteBtn" 
                            outlined 
                            rounded 
                            @click="() => {deleteFile(index)}">
                                <span>Delete</span> 
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </p>
                        </div>
                        
                    </div>
                </div> 
                <v-btn class="actionBtn" rounded @click="upload.modal = true">
                    <span>Upload</span>
                    <v-icon>mdi-cloud-upload</v-icon>
                    <!-- <v-icon class="iconColor">mdi-cloud-upload</v-icon> -->
                </v-btn>
            </div>
            <div class="expansionPanels">
                <v-expansion-panels focusable>
                    <v-expansion-panel>
                        <v-expansion-panel-header disable-icon-rotate>
                            Comments
                            <template v-slot:actions>
                                <v-icon class="expansionIcon">
                                    mdi-wechat
                                </v-icon>
                            </template>		
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
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
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel v-if="account.usertype != 'Modeller'">
                        <v-expansion-panel-header disable-icon-rotate>
                            Assign Modeller
                            <template v-slot:actions>
                                <v-icon class="expansionIcon">
                                    mdi-account-plus
                                </v-icon>
                            </template>	
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div class="card">
                                <v-select :items="modelers" label="Modeller" v-model="modeler">
                                    <template v-slot:item="{item}">
                                        <span>{{item.name}}</span>
                                    </template>
                                    <template v-slot:selection="{item}">
                                        <span>{{item.name}}</span>
                                    </template>
                                </v-select>
                                <v-btn :loading="assign.loading" @click="assign.execute" :disabled="!modeler" rounded small width="80px" color="#1FB1A9" class="assignBtn" >Assign</v-btn>
                                <p class="error-text" v-if="assign.error">{{assign.error}}</p>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <!-- <table id="itemTable"> -->
                    <!-- <tr>
                        <td>Status</td>
                        <td>
                            {{backend.messageFromStatus(model.state, account.usertype)}}
                            <v-icon>{{backend.iconFromStatus(model.state, account.usertype)}}</v-icon>
                        </td>
                    </tr> 
                    <tr>-->
                        <!-- Assign modeller via expansion panel instead of modal -->

                        <!--<td>Assigned modeler:</td>
                        <td>
                            {{model.modelowner ? model.modelowner : 'None'}}
                             <v-btn
                                v-if="account.usertype != 'Modeller'"
                                icon
                                @click="assign.modal = true"
                            >
                                <v-icon class="iconColor">mdi-account-plus</v-icon>
                            </v-btn> -->

                        <!-- </td>
                    </tr> -->
                <!-- </table> -->

                <!-- Moved code for comments in an expansion panel: -->
                <!-- <h2 id="commentsLabel">Comments</h2>
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
                /> -->
            </div>
        </div>
        <v-snackbar v-model="assignSnackbar" :timeout="3000">Cannot assign modeller until order is claimed by a QA</v-snackbar>
    </div>
</template>
<script>
import backend from "./../backend";
import comments from "./CommentView";
import Vue from "vue";
import edittextmodal from './EditTextModal'

export default {
    components: {
        comments,
        edittextmodal
    },
    props: {
        model: { type: Object, required: true },
        account: { type: Object, required: true }
    },
    data() {
        return {
            assign: backend.promiseHandler(this.assignModeler),
            upload: backend.promiseHandler(this.uploadModel),
            editname: backend.promiseHandler(this.changeName),
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
        changeName(newname) {
            var vm = this;
            return backend.editModelName(vm.model.modelid, newname).then(() => {
                vm.model.modelname = newname;
            })
        },
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
// #item {
//     width: 80vw;
// }
// #itemTable {
//     font-size: 20px;
//     color: grey;
//     td {
//         padding-right: 20px;
//     }
// }
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

.card {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    p {
        margin-bottom: 20px;
    }
    p#modeller{
        font-size: 1.3em;
    }
    p#status{
        font-size: 1.1em;
    }
}

#default-progress-bar {
    display: none !important;
}

.fileList {
    width: 100%;
    margin: 40px 0;
    // background-color: #cccccc;
    // td {
    //     border: none;
    // }
    // max-height: 60px;
    // overflow-y: scroll;
    // margin-right: 20px;
  
}

.fileName {
    padding-left: 10px;
    // width: 300px;
}

.flexrow {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.fileButtons {
    display: flex;
}

.emptyFiles {
    width: 300px;
    padding-left: 10px;
    font-style: italic;
}

.buttons {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
}

.actionBtn {
    /* Buttons with a class do not seem to accept the "dark" prop */
    color: white;
    span {
        margin-right: 0.5em;
    }
    margin-right: 10px;
}

#deleteBtn, #confirmBtn {
    background-color: white !important;
    color: #1FB1A9;
}

.uploadBtn {
    /* Buttons with the "dark" prop disappear when disabled 
    so adjusted the text color in CSS instead*/
    color: white;
    margin: 10px 10px 0 10px;
}

.secondaryBtn {
    background-color: white !important;
    color: #1FB1A9;
    span {
        margin-right: 0.5em;
    }
}

h3 {
    color: #515151;
    font-weight: normal;
    margin-bottom: 10px;
    text-align: center;
}

.expansionPanels{
    margin-top: 20px;
    margin-right: 20px;
}

.expansionIcon {
    margin-left: 10px;
    color: #515151!important;
	
}

.uploadButtons {
    display: flex;
    justify-content: center;
    align-items: baseline;
}
//added to style "Assign" button as per design
.assignBtn {
	color: white;
	margin-top: 15px;
	width: 10px;
}
</style>