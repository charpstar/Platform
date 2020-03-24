<template>
    <div>
        <v-dialog v-model="dialog" width="500">
            <div class="card">
            <fileinput :label="'Select Excel Docuemnt'" @file="onFileChange"/>
            <v-btn :loading="loading" @click="newOrder">Upload</v-btn>
            </div>
        </v-dialog>
        <div class="flexrow" id="topRow" >
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only" v-if="account.type != 'client' "> 
                    <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Orders</h2>
            </div>
            <v-btn id="buttonNew" @click="dialog = true" v-if="!emptyObj(user)">New Order<v-icon right>mdi-file-plus</v-icon></v-btn>
        </div>
        <div id="itemsView">
            <v-data-table
                id="table"
                :headers="headers"
                :items="Object.values(orders)"
                :items-per-page="-1"
                @click:row="handleClick"
            >
            </v-data-table>
        </div>
    </div>
</template>

<script>
import fileinput from './FileInput'
import backend from '../backend'

export default {
    components: {
        fileinput
    },
    props: {
        orders: { required: true, type: Object },
        user: { required: true, type: Object },
        account: { required: true, type: Object },
    },
    data() {
        return {
            headers: [
                { text: "Date", value: "time", align: "left" },
                { text: "Models", value: "amount", align: "left"},
                { text: "Status", value: "status", align: "left" },
                { text: "Client", value: "clientname", align: "left" },
                { text: "Assigned QA", value: "assignedqa.name", align: "left" },
            ],
            dialog: false,
            loading: false,
            file: false,
        };
    },
    methods: {
        handleClick(value) {
            this.$emit("select", value);
        },
        onFileChange(file) {
            this.file = file
        },
        newOrder() {
            var vm = this
            if(vm.file) {
                vm.loading = true
                backend.newOrder(vm.user, vm.file).then(order => {
                    vm.loading = false
                    vm.dialog = false
                    vm.orders[order.orderid] = order
                })
            }
        },
            emptyObj(obj) {
        return Object.keys(obj).length === 0
    },
    },
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



</style>