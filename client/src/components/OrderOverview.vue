<template>
    <div class="flexrow">
        <order-list-view
            v-if="loaded"
            :account="account"
            :isAdminView="isAdminView"
            @clicked-order="getOrderId"
            :orders="orders"
            :userOrders="userOrders"/>

        <!-- 'key' re-renders the child component when orderid changes-->
        <order-view
            v-if="loaded"
            :account="account"
            :orderid="orderid"
            :key="orderid" />
    </div>

</template>

<script>
    import backend from "../backend";
    import OrderListView from './OrderListView.vue'
    import OrderView from './OrderView.vue'

    export default {
        data() {
            return {
                loaded: false, //Once the component is mounted, set to true and display subcomponents
                orderid: "",
                orders: {},
                user: {},
                userOrders: false
            }
        },
        props: {
            account: { type: Object, required: true },
            isAdminView: { type: Boolean, default: false }
        },
        components: {
            OrderListView,
            OrderView
        },

        methods: {
            getOrderId(id) {
                this.orderid = id
            },
            getOrders() {
                var vm = this;
                if (vm.isAdminView) {
                    backend
                        .getAllOrders()
                        .then(orders => {
                            vm.orders = orders;
                            if (Object.values(vm.orders).length > 0) {
                                //dynamically get the first/ default order to show details for
                                vm.orderid = Object.values(orders)[0].orderid
                            }
                        })
                        .catch(error => {
                            vm.error = error;
                        });
                } else {
                    vm.userOrders = true;
                    vm.user.userid = vm.$route.params.id;
                    backend.getOrders(vm.user.userid).then(orders => {
                        vm.orders = orders;
                        if (Object.values(vm.orders).length > 0) {
                            //dynamically get the first/ default order to show details for
                            vm.orderid = Object.values(orders)[0].orderid
                        }
                    });
                }

            },
        },

        mounted() {
            this.getOrders();
            this.loaded = true;
        }
    }
</script>

<style scoped>

</style>