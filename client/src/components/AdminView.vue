<template>
    <div>
        <v-tabs v-model="tab" >
            <v-tabs-slider></v-tabs-slider>
            <v-tab :href="'#orders'">Orders</v-tab>
            <v-tab :href="'#models'">Models</v-tab>
            <v-tab-item :value="'orders'">
                <orderlistview :account="account" :isAdminView="true"/>
            </v-tab-item>
            <v-tab-item :value="'models'">
                <userlistview />
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
import orderlistview from './OrderListView'
import userlistview from './UserListView'

export default {
    props: {
        account: { type: Object, required: true }
    },
    components: {
        orderlistview,
        userlistview
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