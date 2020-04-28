<template>
    <div>
        <usernewmodal @newuser="newUser" :handler="newUserHandler" />
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only">
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Users</h2>
            </div>
            <v-btn id="buttonNew" @click="newUserHandler.modal = true">
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
                    <i class="material-icons">{{value ? 'check' : ''}}</i>
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
    width: 80vw;
}
</style>