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
                <v-btn icon class="hidden-xs-only" v-if="account.usertype != 'Modeller'">
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
            <div class="flexrow">
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Filter"
                    single-line
                    hide-details
                ></v-text-field>
                <v-menu offset-y v-model="menuOpen">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" class="filterbutton">
                            Filter
                            <v-icon right>mdi-menu-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                            v-for="(text, filter) in filters"
                            :key="filter"
                            @click="search += ' ' + filter + ' '"
                        >
                            <v-list-item-title>{{ text }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
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
        models: { required: true, type: Object },
        account: { required: true, type: Object }
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
                { text: "ID", value: "modelid", align: "left" },
                { text: "Name", value: "name", align: "left" },
                { text: "Status", value: "status", align: "left" }
            ],
            filters: {
                ModelMissing: 'Missing information',
                ClientModelReceived: 'Awaiting review'
            },
            newModelHandler: backend.promiseHandler(this.newModel),
            name: "",
            search: "",
            backend: backend,
            menuOpen: false,
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
    },
    mounted() {
        var vm = this;
        if (vm.account.usertype != "Client") {
            vm.headers.push({
                text: "Modeller",
                value: "modelowner",
                align: "left"
            });
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
.filterbutton {
    margin-left: 10px;
}
</style>