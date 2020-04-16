<template>
    <div>
        <v-dialog v-model="newModelHandler.modal" width="500">
            <div class="card">
                <v-text-field label="Name" v-model="name" />
                <v-btn :loading="newModelHandler.loading" @click="newModelHandler.execute">New Model</v-btn>
                <p class="error-text" v-if="newModelHandler.error">{{newModelHandler.error}}</p>
            </div>
        </v-dialog>
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only">
                    <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Models</h2>
            </div>
            <v-btn id="buttonNew" @click="newModelHandler.dialog = true" v-if="!emptyObj(order)">
                New Model
                <v-icon right>mdi-file-plus</v-icon>
            </v-btn>
        </div>
        <div id="itemsView">
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Filter"
                single-line
                hide-details
            ></v-text-field>
            <v-data-table
                id="table"
                :headers="headers"
                :items="Object.values(models)"
                :items-per-page="-1"
                :must-sort="true"
                :sort-by="'name'"
                :search="search"
                @click:row="handleClick"
            >
                <template v-slot:item.thumbnail="{value}">
                    <img :src="value" class="thumbnail" />
                </template>
                <template v-slot:item.status="{value}">
                    {{backend.messageFromStatus(value)}}
                    <v-icon>{{backend.iconFromStatus(value)}}</v-icon>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import backend from "../backend";
export default {
    props: {
        order: { type: Object },
        models: { required: true, typ: Object }
    },
    data() {
        return {
            headers: [
                {
                    text: "",
                    align: "left",
                    sortable: false,
                    value: "thumbnail"
                },
                { text: "Name", value: "name", align: "left" },
                { text: "Status", value: "status", align: "left" },
            ],
            newModelHandler: backend.promiseHandler(this.newModel),
            name: "",
            search: "",
            backend: backend
        };
    },
    methods: {
        handleClick(value) {
            this.$emit("select", value);
        },
        newModel() {
            var vm = this;
            return backend
                .newModel(vm.order.orderid, vm.order.clientid, vm.name)
                .then(model => {
                    vm.name = "";
                    vm.models[model.modelid] = model;
                });
        },
        emptyObj(obj) {
            return Object.keys(obj).length === 0;
        }
    }
};
</script>

<style lang="scss" scoped>
#topRow {
    justify-content: space-between;
    margin-bottom: 10px;
}
#table {
    max-height: 70vh;
    overflow: auto;
    width: 80vw;
}

.thumbnail {
    max-width: 50px;
}
th {
    text-align: start;
}
</style>