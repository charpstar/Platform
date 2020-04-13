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
        <div class="column">
            <table id="itemTable">

                <tr>
                    <td>Assigned modeler</td>
                    <td >
                        {{model.assignedmodeler ? model.assignedmodeler.name : 'none'}}
                    </td>
                    <td v-if="account.usertype != 'Modeller'">
                        <v-btn @click="assignDialog = true">Assign Modeler</v-btn>
                    </td>
                </tr>

                <tr>
                    <td>Blender model</td>
                    <td>
                        <v-btn :href="model.blendermodel" target="_blank" v-if="model.blendermodel != ''">Download</v-btn>
                        <span v-else>none</span>
                    </td>
                    <td>
                        <v-btn @click="uploadDialog = true">Upload</v-btn>
                    </td>
 
                </tr>
            </table>
            <h2 id="commentsLabel">Comments</h2>
            <comments
                :account="account"
                :comments="model.blendercomments"
                @comment="sendComment"
                :review="true"
            />
        </div>
    </div>

</template>
<script>
import backend from "./../backend";
import comments from "./CommentView";

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
            addComment: "",
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
            var vm = this
            backend.updateModelComments(vm.model);
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
    }
    margin-top: 20px;
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