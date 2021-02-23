<template>
    <div id="app" data-app>
        <topBar :account="account" @home="homeButton" :notifications="notifications" />
        <div id="center">
            <v-card class="card">
                <transitionExpandHeight>
                    <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
                    <router-view v-else v-on:login="login" :account="account"></router-view>
                </transitionExpandHeight>
            </v-card>
        </div>
    </div>
</template>

<script>
import transitionExpandHeight from "./components/TransitionExpandHeight";
import topBar from "./components/TopBar";

import backend from "./backend";

export default {
    name: "App",

    components: {
        transitionExpandHeight,
        topBar
    },

    data: () => ({
        view: "login",
        account: {},
        notifications: {},
        loading: true
    }),
    methods: {
        homeButton() {
            var vm = this;
            if (vm.$route.path != "/") {
                vm.home();
            }
        },
        home() {
            var vm = this;
            if (vm.account.usertype == "Client") {
                vm.$router.push("/user/" + vm.account.userid + "/orders");
            } else if (vm.account.usertype == "Modeller") {
                vm.$router.push("/modeller/" + vm.account.userid);
            } else {
                vm.$router.push("/home");
            }
        },
        login(user) {
            var vm = this;
            vm.account = user;
            vm.home();
        }
    },
    mounted() {
        var vm = this;
        backend
            .relogin()
            .then(userData => {
                if (vm.$route.path == "/") {
                    vm.login(userData);
                } else {
                    vm.account = userData;
                }
                vm.loading = false;
            })
            .catch(() => {
                vm.$router.push("/");
                vm.loading = false;
            });
    }
};
</script>

<style lang="scss">
body {
    margin: 0;
    padding: 0;
    background-color: #e8e8e8;
    height: 100vh;
    font-family: "Roboto";
}

.view {
    width: 80vw;
}

p,
a,
h1 {
    color: grey;
}

h2 {
    font-weight: normal;
    color: grey;
    margin: 0;
    padding: 0;
    font-size: 30px;
}

#app {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #e8e8e8;
}

#center {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.card {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    padding: 20px;
    background-color: white;
}

.flexrow {
    display: flex;
    flex-direction: row;
    justify-content: center;
    // align-items: center;
}

.flexcol {
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
}

.v-data-footer {
    display: none !important;
}

th {
    text-align: start;
}

.iconColor {
    color: #2196f3 !important;
}
.v-btn:not(.v-btn--icon) {
    background-color: #2196f3 !important;
}
.v-btn--icon {
    background-color: none !important;
}
a {
    text-decoration: none;
}
.v-data-table tr {
    cursor: pointer;
}
.error-text {
    color: #d12300;
    margin-bottom: 5px;
}
</style>