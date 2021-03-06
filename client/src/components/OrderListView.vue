<template>
    <div>

        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only" v-if="account.usertype != 'Client' && !isAdminView">
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Orders</h2>
            </div>
            <excelupload id="buttonNew" :handler="newOrderHandler" v-if="userOrders && account.usertype != 'Modeller'" @file="file = $event">
                New Order
                <v-icon right>mdi-file-plus</v-icon>
            </excelupload>
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
                <v-menu offset-y v-model="menuOpen" v-if="!$emptyObj(filters)">
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
                :items="Object.values(orders)"
                :items-per-page="-1"
                :must-sort="true"
                :sort-by="'time'"
                :search="search"
                @click:row="handleClick"
            >
                <template v-slot:item.complete="{item}">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-progress-linear
                                :buffer-value="100"
                                :height="10"
                                :rounded="true"
                                :value="item.complete/item.models * 100"
                                color="#2196f3"
                                v-on="on"
                            ></v-progress-linear>
                        </template>
                        <span>{{item.complete}} / {{item.models}}</span>
                    </v-tooltip>
                </template>
                <template v-slot:item.qaownername="{value}">
                    <span v-if="value">{{value}}</span>
                    <span v-else ><i>Unassigned</i></span>
                </template>
                <template v-slot:item.state="{value}">
                    {{backend.messageFromStatus(value, account.usertype)}}
                    <v-icon>{{backend.iconFromStatus(value, account.usertype)}}</v-icon>
                </template>
                <template v-slot:item.partitiondata="{value}">
                    <barchart :productdata="value" :account="account"/>
                </template>
                <template v-slot:item.products="{item}">
                    {{sumProducts(item)}}
                </template>
                <template v-slot:item.time="{value}">{{$formatTime(value)}}</template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import backend from "../backend";
import barchart from './BarChart'
import excelupload from './ExcelUpload'

export default {
    props: {
        account: { required: true, type: Object },
        isAdminView : { type: Boolean, default: false}
    },
    components: {
        barchart,
        excelupload
    },
    data() {
        return {
            orders: {},
            userOrders: false,
            headers: [
                { text: "ID", value: "orderid" },
                { text: "Date", value: "time" },
                { text: "Client", value: "clientname", hideClient: true},
                { text: "Assigned QA", value: "qaownername" },
                { text: "Status", value: "state" },
                { text: "Models", value: "models"},
                { text: "Products", value: "products"},
                { text: "Product states", value: "partitiondata"},
            ],
            filters: {},
            newOrderHandler: backend.promiseHandler(this.newOrder),
            file: false,
            search: "",
            backend: backend,
            menuOpen: false,
            user: {}
        };
    },
    computed: {
        filteredHeaders() {
            if(this.account.usertype == 'Client') {
                return this.headers.filter(header => header.hideClient != true);
            }
            return this.headers
        }
    },
    methods: {
        sumProducts(item) {
            var sum = 0;
            var states =  Object.values(item.partitiondata)
            states.forEach(state => {
                sum += parseInt(state.count);
            })
            return sum;
        },
        handleClick(order) {
            this.$router.push("/order/" + order.orderid);
        },
        newOrder() {
            var vm = this;
            if (vm.file) {
                return backend.createOrder(vm.file, vm.$route.params.id).then(() => {
                    vm.getOrders();
                });
            }
        },
        getOrders() {
            var vm = this;
            if (vm.isAdminView) {
            backend
                .getAllOrders()
                .then(orders => {
                    vm.orders = orders;
                })
                .catch(error => {
                    vm.error = error;
                });
            } else {
                vm.userOrders = true;
                vm.user.userid = vm.$route.params.id;
                backend.getOrders(vm.user.userid).then(orders => {
                    vm.orders = orders;
                });
            }
        }
    },
    mounted() {
        var vm = this;
        if (vm.account.usertype == "QA" || vm.account.usertype == "Admin") {
            vm.filters[vm.account.name] = "Assigned to";
            vm.filters['OrderReceived'] = "Unassigned";
        }
        vm.getOrders();
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

.error {
    color: #d12300;
    margin-bottom: 5px;
}
.filterbutton {
    margin-left: 10px;
}
</style>