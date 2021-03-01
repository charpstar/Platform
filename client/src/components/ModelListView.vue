<template>
    <div>
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only" v-if="account.usertype != 'Modeller'">
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Models</h2>
            </div>
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
                :headers="filteredHeaders"
                :items="Object.values(models)"
                :items-per-page="-1"
                :must-sort="true"
                :sort-by="'name'"
                :search="search"
                @click:row="handleClick"
            >
                <template v-slot:item.thumb="{item}">
                    <img
                        :src="backend.getThumbURL(item.modelid)"
                        class="thumbnail"
                        onerror="this.style.display='none'"
                    />
                </template>
                <template v-slot:item.state="{value}">
                    {{backend.messageFromStatus(value, account.usertype)}}
                    <v-icon>{{backend.iconFromStatus(value, account.usertype)}}</v-icon>
                </template>
                <!-- <template v-slot:item.partitiondata="{value}">
                    <barchart :productdata="value" :account="account" />
                </template> -->
                <template v-slot:item.products="{item}">{{sumProducts(item)}}</template>
                <template v-slot:item.modelowner="{value}">
                    <span v-if="value">{{value}}</span>
                    <span v-else ><i>Unassigned</i></span>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import backend from "../backend";
// import barchart from "./BarChart";

export default {
    props: {
        account: { required: true, type: Object },
        models: { required: true, type: Object}
    },
    // components: {
    //     barchart
    // },
    data() {
        return {
            // models: {},
            headers: [
                { text: "", sortable: false, value: "thumb"},
                { text: "ID", value: "modelid" },
                { text: "Name", value: "modelname" },
                { text: "Client", value: "client", hideClient: true},
                { text: "Modeller", value: "modelowner", hideClient: true},
                { text: "Status", value: "state" },
                { text: "Products", value: "products" },
                // { text: "Product states", value: "partitiondata" }
            ],
            filters: {},
            name: "",
            search: "",
            backend: backend,
            menuOpen: false,
            // order: false
        };
    },
    methods: {
        sumProducts(item) {
            var sum = 0;
            var states = Object.values(item.partitiondata);
            states.forEach(state => {
                sum += parseInt(state.count);
            });
            return sum;
        },
        handleClick(model) {
            this.$emit('clicked-model', model.modelid)  
            /* instead of pushing a route, use the id as a prop to populate OrderView component */        
            // this.$router.push("/order/" + order.orderid);
            // this.$router.push("/model/" + model.modelid);
        }
    },
    computed: {
        filteredHeaders() {
            if(this.account.usertype == 'Client') {
                return this.headers.filter(header => header.hideClient != true);
            }
            return this.headers
        }
    },
    mounted() {
        var vm = this;
        if (vm.account.usertype != "Client") {
            vm.filters["ProductMissing"] = "Missing information";
            vm.filters["ProductQAMissing"] = "Missing client information";
            vm.filters["ProductReview"] = "Awaiting review";
            
        } else {
            vm.filters["ProductQAMissing"] = "Missing information";
            vm.filters["ClientProductReceived"] = "Awaiting review";
        }
    //     if (vm.$route.path.includes("/modeller/")) {
    //         var id = vm.$route.params.id;
    //         backend.getModellerModels(id).then(models => {
    //             vm.models = models;
    //         });
    //     } else if (vm.$route.path == "/admin/models") {
    //         backend.getAllModels().then(models => {
    //             vm.models = models;
    //         });
    //     } else {
    //         vm.order = vm.$route.params.id;
    //         backend.getModels(vm.order).then(models => {
    //             vm.models = models;
    //         });
    //     }
    // }
    }
};
</script>

<style lang="scss" scoped>
#topRow {
    justify-content: space-between;
    margin-bottom: 10px;
}
#table {
    max-height: 100vh;
    // max-height: 70vh;
    overflow: auto;
    // width: 80vw;
    width: 50vw // to fit both order list and order details

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