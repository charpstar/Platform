<template>
    <div id="app" data-app>
        <topBar
            :account="account"
            :loggedIn="view != 'login'"
            @logout="view = 'login'"
            @home="home"
            :notifications="notifications"
        />
        <div id="center">
            <v-card class="card">
                <transitionExpandHeight>
                    <loginView v-if="view == 'login'" v-on:login="login" />
                </transitionExpandHeight>

                <transitionExpandHeight>
                    <adminView
                        v-if="view == 'adminView'"
                        @users="users = $event; view = 'userList'"
                        @orders="user = {}; orders = $event; view='orderList'"
                        @models="order = {}; models = $event; view='modelList'"
                    />
                </transitionExpandHeight>

                <transitionExpandHeight>
                    <userListView
                        v-if="view == 'userList'"
                        :users="users"
                        @back="view = 'adminView'"
                        @select="user = $event; view = 'user'"
                    />
                </transitionExpandHeight>

                <transitionExpandHeight>
                    <userView
                        v-if="view == 'user'"
                        :user="user"
                        @back="view = 'userList'"
                        @delete="deletedUser"
                        @orders="orders = $event; view = 'orderList'"
                    />
                </transitionExpandHeight>

                <transitionExpandHeight>
                    <orderListView
                        v-if="view == 'orderList'"
                        :orders="orders"
                        :account="account"
                        :user="user"
                        @back="orderListBack"
                        @select="order = $event; view = 'order'"
                    />
                </transitionExpandHeight>

                <transitionExpandHeight>
                    <orderView
                        v-if="view == 'order'"
                        :order="order"
                        :account="account"
                        @back="view = 'orderList'"
                        @view-models="getModels"
                    />
                </transitionExpandHeight>

                <transitionExpandHeight>
                    <modelListView
                        v-if="view == 'modelList'"
                        :order="order"
                        :models="models"
                        @back="modelListBack"
                        @select="model = $event; view = 'model'"
                    />
                </transitionExpandHeight>

                <transitionExpandHeight>
                    <modelView
                        v-if="view == 'model'"
                        :order="order"
                        :account="account"
                        :model="model"
                        @back="view = 'modelList'"
                    />
                </transitionExpandHeight>
            </v-card>
        </div>
    </div>
</template>

<script>
import transitionExpandHeight from "./components/TransitionExpandHeight";
import topBar from "./components/TopBar";
import loginView from "./components/LoginView";
import adminView from "./components/AdminView";
import orderListView from "./components/OrderListView";
import orderView from "./components/OrderView";
import modelListView from "./components/ModelListView";
import modelView from "./components/ModelView";
import userListView from "./components/UserListView";
import userView from "./components/UserView";

import backend from "./backend";

export default {
    name: "App",

    components: {
        transitionExpandHeight,
        topBar,
        loginView,
        adminView,
        orderListView,
        orderView,
        modelListView,
        modelView,
        userListView,
        userView
    },

    data: () => ({
        view: "login",
        users: {},
        user: {},
        orders: {},
        order: {},
        models: {},
        model: {},
        account: {},
        notifications: {}
    }),
    methods: {
        home() {
            var vm = this
            if(vm.view != 'login') {
                if (vm.account.usertype == "Client") {
                    vm.view = "orderList";
                } else {
                    vm.view = "adminView";
                }
            }
        },
        login(user) {
            var vm = this;
            vm.account = user;
            if (user.usertype == "Client") {
                backend.getOrders(user.userid).then(orders => {
                    vm.user = user;
                    vm.orders = orders;
                    vm.view = "orderList";
                });
            } else {
                vm.view = "adminView";
            }
        },
        deletedUser(userid) {
            var vm = this;
            vm.$delete(vm.users, userid);
            vm.view = "userList";
        },
        getModels() {
            var vm = this;
            backend.getModels(vm.order.orderid).then(models => {
                vm.models = models;
                vm.view = "modelList";
            });
        },
        orderListBack() {
            var vm = this;
            if (!backend.emptyObj(vm.user)) {
                vm.view = "user";
            } else {
                vm.view = "adminView";
            }
        },
        modelListBack() {
            var vm = this;
            if (!backend.emptyObj(vm.order)) {
                vm.view = "order";
            } else {
                vm.view = "adminView";
            }
        },
        viewAllOrders() {
            var vm = this;
            backend.getAllOrders().then(orders => {
                vm.orders = orders;
                vm.view = "orderList";
            });
        }
    },
    mounted() {
        backend.init();
        this.notifications[1] = { message: "There are 2 new orders", click: this.viewAllOrders }
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
    align-items: center;
}

.flexcol {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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