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
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Models</h2>
            </div>
            <v-btn id="buttonNew" @click="newModelHandler.dialog = true" v-if="order">
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
                <template v-slot:item.thumbnail="{item}">
                    <img :src="backend.getThumbURL(item.modelid)" class="thumbnail" onerror="this.style.display='none'"/>
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
        account: { required: true, type: Object }
    },
    data() {
        return {
            models: {},
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
                ModelMissing: "Missing information",
                ClientModelReceived: "Awaiting review"
            },
            newModelHandler: backend.promiseHandler(this.newModel),
            name: "",
            search: "",
            backend: backend,
            menuOpen: false,
            order: false
        };
    },
    methods: {
        handleClick(model) {
            this.$router.push("/model/" + model.modelid);
        },
        newModel() {
            var vm = this;
            return backend.newModel(vm.order, vm.name).then(model => {
                vm.name = "";
                vm.models[model.modelid] = model;
            });
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
        if (vm.$route.path == "/modeller/models") {
            backend.getModellerModels().then(models => {
                vm.models = models;
            });
        } else if (vm.$route.path == "/admin/models") {
            backend.getAllModels().then(models => {
                vm.models = models;
            });
        } else {
            vm.order = vm.$route.params.id;
            backend.getModels(vm.order).then(models => {
                vm.models = models;
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