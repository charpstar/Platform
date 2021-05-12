<template>
    <div>
        <usernewmodal @newuser="newUser" :handler="newUserHandler" />
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <h2>Users</h2>
            </div>
            <v-btn id="buttonNew" @click="newUserHandler.modal = true" v-if="account.usertype == 'Admin'" color="#1FB1A9" rounded  dark small>
                New User
                <v-icon right>mdi-account-plus</v-icon>
            </v-btn>
        </div>
        <div id="itemsView">
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Filter"
                single-line
                hide-details
				color="#1FB1A9"
            ></v-text-field>
            <v-data-table
                id="table"
                :headers="headers"
                :items="Object.values(users)"
                :items-per-page="-1"
                :must-sort="true"
                :sort-by="'userid'"
                :search="search"
                @click:row="handleClick"
            >
                <template v-slot:item.active="{value}">
					<!--removed check mark from active state-->
                    <!-- <i class="material-icons">{{value ? 'check' : ''}}</i> --> 
					<!--replaced check mark by text-Active and i-tag by v-chip tag-->
                    <v-chip :color="value ? '#41BF4D' : '#868686'" label dark>
                        {{value ? 'Active' : 'Inactive'}} 
                    </v-chip>
					<!-- <v-chip color="#41BF4D" label dark>{{value ? 'Active' : ''}} </v-chip> -->
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import usernewmodal from "./UserNewModal";
import backend from "../backend";
import Vue from "vue";

export default {
    props: {
        account: {required: true, type: Object}
    },
    components: {
        usernewmodal
    },
    data() {
        return {
            users: {},
            headers: [
                { text: "Name", value: "name", align: "left" },
                { text: "Email", value: "email", align: "left" },
                { text: "Type", value: "usertype", align: "left" },
                { text: "ID", value: "userid", align: "left" },
                { text: "Active", value: "active", align: "left" }
            ],
            search: "",
            newUserHandler: backend.promiseHandler(this.newUser)
        };
    },
    methods: {
        handleClick(user) {
            this.$router.push("/user/" + user.userid);
        },
        newUser(user) {
            Vue.set(this.users, user.userid, user);
        }
    },
    mounted() {
        var vm = this;
        backend.getUsers().then(users => {
            vm.users = users;
        });
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
    // width: 80vw;
}
</style>