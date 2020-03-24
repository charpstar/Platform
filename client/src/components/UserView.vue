<template>
    <div class="view">
        <v-dialog v-model="deleteConfirm" width="250px">
            <div class="card flexcol" id="deleteConfirm">
            <h2>Confirm Delete</h2>
            <v-btn @click="deleteUser">Confirm</v-btn>
            <v-btn @click="deleteConfirm = false">Cancel</v-btn>
            </div>
        </v-dialog>
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only">
                    <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>User</h2>
            </div>
        </div>
        <div class="flexrow" id="user">
                        <table id="data">
                <tr>
                    <td>Name</td><td>{{user.name}}</td>
                </tr>
                <tr>
                    <td>Email</td><td>{{user.email}}</td>
                </tr>
                <tr>
                    <td>Type</td><td>{{user.type}}</td>
                </tr>
                <tr>
                    <td>ID</td><td>{{user.id}}</td>
                </tr>
                        </table>
                <div class="flexcol" id="buttons">
                <v-btn :loading="resetLoading">Reset Password</v-btn>
                <v-btn :loading="viewLoading" @click="viewOrders">View Orders</v-btn>
                <v-btn :loading="deleteLoading" @click="deleteConfirm = true">Delete</v-btn>
                </div>
        </div>
    </div>
</template>

<script>
import backend from '../backend'

export default {
    props: {
        user: {type: Object, required: true}
    },
    data() {
        return {
            resetLoading: false,
            newPassword: "",
            viewLoading: false,
            deleteLoading: false,
            deleteConfirm: false
        };
    },
    methods: {
        viewOrders() {
            var vm = this
            vm.viewLoading = true
            backend.getOrders(vm.user.id).then(orders => {
                vm.viewLoading = false,
                vm.$emit('orders', orders)
            })
        },
        deleteUser() {
            var vm = this
            vm.deleteLoading = true
            vm.deleteConfirm = false
            backend.deleteUser(vm.user.id).then(() => {
                vm.deleteLoading = false
                vm.$emit('delete', vm.user.id)
            })
        }
    }
};
</script>

<style lang="scss" scoped>

.v-btn {
    margin-top: 10px;
}
#user {
    justify-content: flex-start;
}
#data {
    font-size: 16px;
    color:grey;
    td {
        padding: 5px;
    }
}

#buttons {
    align-items: flex-start;
}

#topRow {
    justify-content: flex-start;
}
</style>