<template>
    <div>
        <div id="adminview" class="flexcol">
            <v-btn @click="users">View Users</v-btn>
            <v-btn @click="orders">View All Orders</v-btn>
            <v-btn @click="models">View All Models</v-btn>
        </div>
    </div>
</template>

<script>
import backend from "../backend";
export default {
    methods: {
        users() {
            var vm = this;
            backend.getUsers().then(users => {
                vm.$emit("users", users);
            });
        },
        orders() {
            var vm = this;
            backend.getAllOrders().then(orders => {
                vm.$emit("orders", orders);
            });
        },
        models() {
            var vm = this;
            backend.getAllModels().then(models => {
                vm.$emit("models", models);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.v-btn:not(:last-child) {
    margin-bottom: 10px;
}
</style>