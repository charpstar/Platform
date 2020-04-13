<template>
    <div>
        <usernewmodal :open="newUserDialog" @newuser="newUser" @close="newUserDialog = false" />
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only">
                    <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Users</h2>
            </div>
            <v-btn id="buttonNew" @click="newUserDialog = true">
                New User
                <v-icon right>mdi-account-plus</v-icon>
            </v-btn>
        </div>
        <div id="itemsView">
            <v-data-table
                id="table"
                :headers="headers"
                :items="Object.values(users)"
                :items-per-page="-1"
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

export default {
    components: {
        usernewmodal
    },
    props: {
        users: { required: true, type: Object }
    },
    data() {
        return {
            headers: [
                { text: "Name", value: "name", align: "left" },
                { text: "Email", value: "email", align: "left" },
                { text: "Type", value: "usertype", align: "left" },
                { text: "ID", value: "userid", align: "left" },
                { text: "Active", value: "active", align: "left" }
            ],
            newUserDialog: false
        };
    },
    methods: {
        handleClick(value) {
            this.$emit("select", value);
        },
        newUser(user) {
            var vm = this;
            vm.newUserDialog = false;
            vm.users[user.userid] = user;
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
</style>