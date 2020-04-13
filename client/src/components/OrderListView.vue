<template>
    <div>
        <v-dialog v-model="dialog" width="500">
            <div class="card">
                <v-file-input :label="'Select Excel Docuemnt'" @change="onFileChange"></v-file-input>
                <p v-if="error != ''">{{error}}</p>
                <v-btn :loading="loading" @click="newOrder">Upload</v-btn>
            </div>
        </v-dialog>
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only" v-if="account.usertype != 'Client' ">
                    <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Orders</h2>
            </div>
            <v-btn id="buttonNew" @click="dialog = true" v-if="!emptyObj(user)">
                New Order
                <v-icon right>mdi-file-plus</v-icon>
            </v-btn>
        </div>
        <div id="itemsView">
            <v-data-table
                id="table"
                :headers="headers"
                :items="Object.values(orders)"
                :items-per-page="-1"
                @click:row="handleClick"
            ></v-data-table>
        </div>
    </div>
</template>

<script>
import backend from "../backend";

export default {
    props: {
        orders: { required: true, type: Object },
        user: { required: true, type: Object },
        account: { required: true, type: Object }
    },
    data() {
        return {
            headers: [
                { text: "Date", value: "time", align: "left" },
                { text: "Models", value: "amount", align: "left" },
                { text: "Status", value: "status", align: "left" },
                { text: "Client", value: "clientname", align: "left" },
                { text: "Assigned QA", value: "assignedqa.name", align: "left" }
            ],
            dialog: false,
            loading: false,
            file: false,
            error: ""
        };
    },
    methods: {
        handleClick(value) {
            this.$emit("select", value);
        },
        onFileChange(file) {
            this.file = file;
        },
        newOrder() {
            var vm = this;
            if (vm.file) {
                vm.loading = true;
                backend
                    .createOrder(vm.file)
                    .then(order => {
                        vm.loading = false;
                        vm.dialog = false;
                        vm.orders[order.orderid] = order;
                    })
                    .catch(error => {
                        vm.error = error;
                        vm.loading = false;
                    });
                backend.newOrder(vm.user, vm.file).then(order => {
                    vm.loading = false;
                    vm.dialog = false;
                    vm.orders[order.orderid] = order;
                });
            }
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

.error {
    color: #d12300;
    margin-bottom: 5px;
}
</style>