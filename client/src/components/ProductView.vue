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
                <v-file-input :label="'Select Blender Model'" @change="onFileChange"></v-file-input>
                <v-btn :loading="uploadLoading" @click="uploadModel">Upload</v-btn>
            </div>
        </v-dialog>
        <div class="row" id="itemsrow">
            <model-viewer :src="product.androidmodel" auto-rotate camera-controls id="modelView"></model-viewer>
            <div class="column">
                <table id="itemTable">
                    <tr>
                        <td>Color</td>
                        <td>{{product.color}}</td>
                    </tr>
                    <tr v-if="account.usertype != 'Client'">
                        <td>Assigned modeler</td>
                        <td>{{model.assignedmodeler ? model.assignedmodeler.name : 'none'}}</td>
                        <td v-if="account.usertype != 'Modeller'">
                            <v-btn @click="assignDialog = true">Assign Modeler</v-btn>
                        </td>
                    </tr>

                    <tr v-if="account.usertype != 'Client'">
                        <td>Blender model</td>
                        <td>
                            <v-btn
                                :href="product.blendermodel"
                                target="_blank"
                                v-if="product.blendermodel != ''"
                            >Download</v-btn>
                            <span v-else>none</span>
                        </td>
                        <td>
                            <v-btn @click="uploadDialog = true">Upload</v-btn>
                        </td>
                    </tr>
                    <tr>
                        <td>Android link</td>
                        <td v-if="product.androidmodel != ''">
                            <v-btn @click="snackbar = true">Copy</v-btn>
                        </td>
                    </tr>
                    <tr>
                        <td>iOS link</td>
                        <td v-if="product.iosmodel != ''">
                            <v-btn @click="snackbar = true">Copy</v-btn>
                        </td>
                    </tr>
                    <tr v-if="account.usertype != 'Client'">
                        <td>
                            <modelupload :model="model" :product="product" @upload="uploaded" />
                        </td>
                    </tr>
                </table>
                <h2 id="commentsLabel">Comments</h2>
                <comments
                    :account="account"
                    :comments="product.comments"
                    @comment="sendComment"
                    :review="true"
                />
            </div>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">Link copied to clipboard</v-snackbar>
    </div>
</template>
<script>
import modelupload from "./ModelUpload";
import backend from "./../backend";
import comments from "./CommentView";

export default {
    components: {
        modelupload,
        comments
    },
    props: {
        product: { type: Object, required: true },
        model: { type: Object, required: true },
        account: { type: Object, required: true }
    },
    data() {
        return {
            snackbar: false,
            assignDialog: false,
            assignLoading: false,
            uploadDialog: false,
            uploadLoading: false,
            modelers: [],
            modeler: false,
            file: ''
        };
    },
    methods: {
        uploaded(values) {
            this.product.androidmodel = values[0];
            this.model.thumbnail = values[2];
        },
        onFileChange(file) {
            var vm = this
            if (file) {
                var reader = new FileReader()
                reader.onload = e => {
                    vm.file = e.target.result
                };
                reader.readAsDataURL(file)
            } else {
                vm.file = false
            }
        },
        sendComment() {
            var vm = this;
            backend.updateProductComments(vm.model, vm.product);
        },
        assignModeler() {
            var vm = this
            vm.assignLoading = true;
            backend.assignModeler(vm.model.modelid, vm.modeler).then(data => {
                vm.assignLoading = false
                vm.assignDialog = false
                vm.model.assignedmodeler = data;
            });
        },
        uploadModel() {
            var vm = this
            vm.uploadLoading = true
            backend.uploadBlenderModel(vm.model, vm.file).then(url => {
                vm.model.blendermodel = url
                vm.uploadLoading = false
                vm.uploadDialog = false
                vm.file = false
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
    font-size: 26px;
    color: grey;
    td {
        padding-right: 20px;
        padding: 5px;
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
    > * {
        margin-bottom: 20px;
    }
}

#default-progress-bar {
    display: none !important;
}
</style>