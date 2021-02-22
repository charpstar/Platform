<template>
    <div>
        <v-tabs v-model="tab" >
            <v-tabs-slider></v-tabs-slider>
            <v-tab :href="'#orders'">Orders</v-tab>
            <v-tab :href="'#users'">Users</v-tab>
            <v-tab-item :value="'orders'">
                <!-- replace order list view with new component that shows both the order 
                list and the details-->
                <order-overview />
                <orderlistview :account="account" :isAdminView="true"/>
            </v-tab-item>
            <v-tab-item :value="'users'">
                <userlistview :account="account"/>
            </v-tab-item>
        </v-tabs>
        
    </div>
</template>

<script>
import orderlistview from './OrderListView'
import OrderOverview from './OrderOverview.vue';
import userlistview from './UserListView'

export default {
    props: {
        account: { type: Object, required: true }
    },
    components: {
        orderlistview,
        userlistview,
        OrderOverview
    },
    data() {
        return {
            tab: "",
        };
    },
};
</script>

<style lang="scss">
.v-tabs-bar {
    margin-bottom: 20px !important;
}
</style>