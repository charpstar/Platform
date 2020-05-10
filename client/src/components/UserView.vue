<template>
    <div class="view">
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only">
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
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
                <div class="flexrow" v-if="account.usertype == 'Admin'">
                    <confirmmodal
                        :handler="resetHandler"
                        :title="'Confirm password reset'"
                        :buttonText="'Reset password'"
                    />
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
                <v-btn
                    @click="$router.push('/user/' + user.userid + '/orders')"
                    v-if="user.usertype == 'Client'"
                >View Orders</v-btn>
                <v-btn
                    @click="$router.push('/modeller/' + user.userid )"
                    v-if="user.usertype == 'Modeller'"
                >View Assigned Models</v-btn>

                <confirmmodal
                    :handler="deleteHandler"
                    :title="'Confirm user delete'"
                    :buttonText="'Delete User'"
                    :icon="'mdi-delete'"
                    :color="'#d12300'"
                    v-if="account.usertype == 'Admin'"
                />
            </div>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">Password copied to clipboard</v-snackbar>
    </div>
</template>

<script>
import backend from "../backend";
import confirmmodal from "./ConfirmModal";

export default {
    props: {
        account: {type: Object, required: true}
    },
    components: {
        confirmmodal
    },
    data() {
        return {
            user: {},
            deleteHandler: backend.promiseHandler(this.deleteUser),
            resetHandler: backend.promiseHandler(this.resetUser),
            newPassword: "",
            snackbar: false
        };
    },
    methods: {
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
                vm.$router.go(-1);
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
    },
    mounted() {
        var vm = this;
        var userid = vm.$route.params.id;
        backend.getUser(userid).then(user => {
            vm.user = user;
        });
    }
};
</script>

<style lang="scss" scoped>

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
    > * {
        margin-bottom: 10px;
        margin-left: 10px;
    }
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