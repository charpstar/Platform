<template>
<div>
    <div id="adminview" class="flexcol">
        <v-btn @click="users" :color="'#e3e030'">View Users</v-btn>
        <v-btn @click="orders" :color="'#e3e030'">View All Orders</v-btn>
        <v-btn @click="models" :color="'#e3e030'">View All Models</v-btn>
    </div>
    </div>
</template>

<script>
import backend from '../backend'
export default {
    name: "adminview",
    methods: {
        users() {
            var vm = this
            backend.getUsers().then(users => {
                vm.$emit('users', users)
            })
        },
        orders() {
            var vm = this
            backend.getAllOrders().then(orders => {
                vm.$emit('orders', orders)
            })
        },
        models() {
            var vm = this
            backend.getAllModels().then(models => {
                vm.$emit('models', models)
            })
        }
    }
};
</script>

<style lang="scss" scoped>
    .v-btn {
        margin-bottom: 10px;
    }
</style>