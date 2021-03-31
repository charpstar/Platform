<template>
<!-- Show order list and details in a row for bigger screens, and in a column for smaller ones-->
    <div :class="$vuetify.breakpoint.mdAndUp ? 'flexrow' : ''">
        
        <!--'key' re-renders the child component when listUpdate changes
            i.e. when an order is updated-->
        <order-list-view
            v-if="loaded"
            :account="account"
            :key="listUpdate"
            :isAdminView="isAdminView"
            :orders="orders"
            :userOrders="userOrders"
            @clicked-order="getOrderId"
			@created-order="updateList"/>

        <!-- 'key' re-renders the child component when orderid changes-->
        <order-view
            v-if="loaded"
            :account="account"
            :orderid="orderid"
            :key="orderid"
            @updated-order="updateList" />
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
                listUpdate: 0, //Use as a key to re-render the order list
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
            updateList() { //when an order is updated or added
                this.getOrders(); //fetch the orders again to get the new data
                this.listUpdate += 1 //increase the key 'listUpdate' by 1 in order to re-render order list
            }
        },

        mounted() {
            this.getOrders();
            this.loaded = true;
        }
    }
</script>

<style scoped>

</style>