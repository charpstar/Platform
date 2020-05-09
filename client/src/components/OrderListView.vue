<template>
    <div>
        <v-dialog v-model="newOrderHandler.modal" width="500">
            <div class="card">
                <v-file-input :label="'Select Excel Document'" @change="onFileChange"></v-file-input>
                <p v-if="newOrderHandler.error">{{newOrderHandler.error}}</p>
                <p v-if="!fileIsExcel">Must be a .xlsx file</p>
                <v-btn
                    :disabled="!file || !fileIsExcel"
                    :loading="newOrderHandler.loading"
                    @click="newOrderHandler.execute"
                >Upload</v-btn>
            </div>
        </v-dialog>
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only" v-if="account.usertype != 'Client' && !isAdminView">
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Orders</h2>
            </div>
            <v-btn id="buttonNew" @click="newOrderHandler.modal=true" v-if="userOrders && account.usertype == 'Client'">
                New Order
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
                :headers="headers"
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
                <template v-slot:item.state="{value}">
                    {{backend.messageFromStatus(value, account.usertype)}}
                    <v-icon>{{backend.iconFromStatus(value, account.usertype)}}</v-icon>
                </template>
                <template v-slot:item.time="{value}">{{$formatTime(value)}}</template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import backend from "../backend";

export default {
    props: {
        account: { required: true, type: Object },
        isAdminView : { type: Boolean, default: false}
    },
    data() {
        return {
            orders: {},
            userOrders: false,
            headers: [
                { text: "ID", value: "orderid", align: "left" },
                { text: "Date", value: "time", align: "left" },
                { text: "Models", value: "models", align: "left" },
                { text: "Progress", value: "complete", align: "left" },
                { text: "Status", value: "state", align: "left" },
                { text: "Client", value: "clientname", align: "left" },
                { text: "Assigned QA", value: "qaownername", align: "left" }
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
        fileIsExcel() {
            var vm = this;
            if (vm.file) {
                var arr = vm.file.name.split(".");
                var last = arr[arr.length - 1];
                return last == "xlsx";
            }
            return true;
        }
    },
    methods: {
        handleClick(order) {
            this.$router.push("/order/" + order.orderid);
        },
        onFileChange(file) {
            this.file = file;
        },
        newOrder() {
            var vm = this;
            if (vm.file) {
                return backend.createOrder(vm.file).then(order => {
                    vm.$set(vm.orders, order.orderid, order);
                    vm.file = false;
                });
            }
        }
    },
    mounted() {
        var vm = this;
        if (vm.account.usertype == "QA" || vm.account.usertype == "Admin") {
            vm.filters[vm.account.name] = "Assigned to";
        }

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