<template>
    <div class="view">
        <v-dialog v-model="deleteHandler.modal" width="250px">
            <div class="card flexcol">
                <h2>Confirm Delete</h2>
                <v-btn :loading="resetHandler.loading" @click="deleteHandler.execute">Confirm</v-btn>
                <v-btn @click="deleteHandler.modal = false">Cancel</v-btn>
                <p class="error-text" v-if="deleteHandler.error">{{deleteHandler.error}}</p>
            </div>
        </v-dialog>
        <v-dialog v-model="resetHandler.modal" width="250px">
            <div class="card flexcol">
                <h2>Confirm Reset</h2>
                <v-btn :loading="resetHandler.loading" @click="resetHandler.execute">Confirm</v-btn>
                <v-btn @click="resetHandler.modal = false">Cancel</v-btn>
                <p class="error-text" v-if="resetHandler.error">{{resetHandler.error}}</p>
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
                    <td>Name</td>
                    <td>{{user.name}}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{user.email}}</td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>{{user.usertype}}</td>
                </tr>
                <tr>
                    <td>ID</td>
                    <td>{{user.userid}}</td>
                </tr>
                <tr>
                    <td>Active</td>
                    <td>
                        <i class="material-icons">{{user.active ? 'check' : 'close'}}</i>
                    </td>
                </tr>
            </table>
            <div class="flexcol" id="buttons">
                <div class="flexrow">
                    <v-btn @click="resetHandler.modal=true">Reset Password</v-btn>
                    <v-text-field
                        outlined
                        readonly
                        dense
                        v-if="newPassword != ''"
                        v-model="newPassword"
                        append-icon="mdi-clipboard-text-outline"
                        @click:append="toClipboard"
                    ></v-text-field>
                </div>
                <v-btn :loading="viewLoading" @click="viewOrders">View Orders</v-btn>
                <v-btn @click="deleteHandler.modal = true">Delete</v-btn>
            </div>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">Password copied to clipboard</v-snackbar>
    </div>
</template>

<script>
import backend from "../backend";

export default {
    props: {
        user: { type: Object, required: true }
    },
    data() {
        return {
            deleteHandler: backend.promiseHandler(this.deleteUser),
            resetHandler: backend.promiseHandler(this.resetUser),
            newPassword: "",
            viewLoading: false,
            snackbar: false
        };
    },
    methods: {
        viewOrders() {
            var vm = this;
            vm.viewLoading = true;
            backend.getOrders(vm.user.userid).then(orders => {
                (vm.viewLoading = false), vm.$emit("orders", orders);
            });
        },
        resetUser() {
            var vm = this;
            var password = backend.randomid(10);
            return backend.resetPassword(vm.user.userid, password).then(() => {
                vm.newPassword = password;
            });
        },
        deleteUser() {
            var vm = this;
            return backend.deleteUser(vm.user.userid).then(() => {
                vm.$emit("delete", vm.user.userid);
            });
        },
        toClipboard() {
            var vm = this;
            vm.$copyText(vm.newPassword).then(
                () => {
                    vm.snackbar = true;
                },
                () => {
                    alert("Could not copy");
                }
            );
        }
    }
};
</script>

<style lang="scss" scoped>
.v-btn {
    margin-top: 10px;
}
.v-input {
    margin-left: 10px;
    margin-top: 10px;
}
#user {
    justify-content: flex-start;
}
#data {
    font-size: 16px;
    color: grey;
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

<style lang="scss">
.v-text-field__details {
    display: none !important;
}
</style>