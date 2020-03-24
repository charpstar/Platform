<template>
    <div id="item">
        <v-dialog v-model="assignDialog">
            <div class="card">
                <v-select :items="modelers" label="Modeler" v-model="modeler">
                    <template v-slot:item="{item}">
                    <span>{{item.name}}</span>
                    </template>
                    <template v-slot:selection="{item}">
                    <span>{{item.name}}</span>
                    </template>
                </v-select>
                <v-btn :loading="loading" @click="assignModeler">Assign</v-btn>
            </div>
        </v-dialog>
        <div class="row" id="topRow">
            <v-btn icon class="hidden-xs-only">
              <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
            </v-btn>
        </div>
        <div class="row" id="itemsrow">
            <model-viewer :src="model.androidmodel" auto-rotate camera-controls id="modelView">
                
            </model-viewer>
            <div class="column">
                <h2>{{model.name}}</h2>
                <table id="itemTable">
                    <tr>
                        <td>Status</td><td>{{model.status}}</td><td><i class="material-icons">{{model.statusicon}}</i></td>
                    </tr>
                    <tr v-if="model.status == 'Complete'">
                        <td>Android link</td><td><v-btn>Copy</v-btn></td>
                    </tr>
                    <tr v-if="model.status == 'Complete'">
                        <td>iOS link</td><td><v-btn>Copy</v-btn></td>
                    </tr>
                    <tr v-if="account.type != 'client'">
                        <td>Assigned modeler</td><td v-if="model.assignedmodeler">{{model.assignedmodeler.name}}</td>
                    </tr>
                    <tr v-if="account.type != 'client' && account.type != 'modeler'" >
                        <td><v-btn @click="assignDialog = true">Assign Modeler</v-btn></td>
                    </tr>
                    <tr v-if="account.type != 'client'">
                        <td><modelupload :model="model" @upload="uploaded"/></td>
                    </tr>
                </table>
                <h2 id="commentsLabel">Comments</h2>
                <comments :account="account" :comments="model.comments" @comment="sendComment" />

            </div>
        </div>
    </div>
</template>
<script>
import modelupload from './ModelUpload'
import backend from './../backend'
import comments from './CommentView'

export default {
    props: {
        order: {type: Object, required: true},
        model: {type: Object, required: true},
        account: {type: Object, required: true}
    },
    components: {
        modelupload,
        comments
    },
    data() {return{
        addComment: "",
        assignDialog : false,
        modelers : [],
        modeler: false,
        loading: false
    }},
    methods: {
        uploaded(values) {
            this.model.androidmodel = values[0]
            this.model.thumbnail = values[2]
        },
        sendComment() {
            var vm = this;
            backend.updateModelComments(vm.model);
        },
        assignModeler() {
            var vm = this
            vm.loading = true
            backend.assignModeler(vm.model.modelid, vm.modeler).then(data => {
                vm.loading = false
                vm.assignDialog = false
                vm.model.assignedmodeler = data
            })
        }
    },
    mounted() {
        var vm = this
        backend.getModelers().then(modelers => {
            vm.modelers = Object.values(modelers)
        })
    }
}
</script>

<style lang="scss" scoped>
#item {
    width: 80vw;
}
#itemTable {
    font-size: 26px;
    color:grey;
    td {
        padding-right: 20px;
        padding: 5px;
    }
}
#modelView {
    width: 400px;
    height: 400px;
    margin-top: 20px;
    margin-right: 20px;
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