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
				<!-- added icon -->
				<div class="name">
					<div class="icon"><v-icon color="#1FB1A9" large left>mdi-account-circle</v-icon></div>
                <div>
				<tr>
					
                    <td class="textBold"> Name</td>
                    <td>{{user.name}}</td>
                </tr>
                <tr>
                    <td class="textBold">Email</td>
                    <td>{{user.email}}</td>
                </tr></div></div>
				<div class="role" >
                <tr>
					<!-- changed TYPE to ROLE-->
                    <td class="textBold">Role</td>
                    <td>{{user.usertype}}</td>
                </tr>
                <tr>
                    <td class="textBold">ID</td>
                    <td>{{user.userid}}</td>
                </tr>
				</div>
                <tr class="active">
                    <!-- <td>Active</td> -->
                    <td >
                        <!-- <i class="material-icons">{{user.active ? 'check' : 'close'}}</i> -->
						<v-chip color="#41BF4D" label dark>{{value ? 'Active' : 'Active'}} </v-chip>
                    </td>
                </tr>
            </table>
            <div class="flexcol" id="buttons">
                <div class="flexrow" v-if="account.usertype == 'Admin'">
                    <confirmmodal
                        :handler="resetHandler"
                        :title="'Confirm password reset'"
                        :buttonText="'Reset Password'"
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
                    v-if="user.usertype == 'Client'" color="#41BF4D" rounded dark small
                >View Orders</v-btn>
                <v-btn
                    @click="$router.push('/modeller/' + user.userid )"
                    v-if="user.usertype == 'Modeller'" color="#41BF4D" rounded dark small
                >Assigned Models</v-btn>

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
	display: flex;
    font-size: 16px;
    color: grey;
    td {
        padding: 5px;
    }
}

#buttons {
    align-items: flex-start;
	justify-content: flex-end;
	width: 700px;
	flex-direction: row;
    > * {
        margin-bottom: 10px;
        margin-left: 10px;
		margin-top: 5px;
    }
}

#topRow {
    justify-content: flex-start;
}

//added for name, email styling
.name{
	display: flex;
	justify-content: flex-start;
	margin-right: 20px;
	flex-direction: row;
}
//added for icon styling
.icon{
	margin-top: 5px;
}

//added for active button styling
.active{
	margin-left: 50px;
}

//added for text bold
.textBold{
	font-weight: bold;
}


</style>

<style lang="scss">
.v-text-field__details {
    display: none !important;
}
</style>