<template>
    <div>
        <v-tabs v-model="section" >
            <v-tabs-slider class="tabColor"></v-tabs-slider>
            <v-tab :href="'#orders'">Orders</v-tab>
            <v-tab :href="'#users'">Users</v-tab>
            <v-tab :href="'#qa'" v-if="account.usertype=='Admin'">QA overview</v-tab>
            <v-tab :href="'#modellers'" 
                v-if="account.usertype=='Admin' || account.usertype=='QA'">
                Modellers overview
            </v-tab>
            <v-tab-item :value="'orders'">
                <!-- replace OrderListView with new component that shows both the order 
                list and the details-->
                <order-overview :account="account" :isAdminView="true"/>
                <!-- <orderlistview :account="account" :isAdminView="true"/> -->
            </v-tab-item>
            <v-tab-item :value="'users'">
                <userlistview :account="account"/>
            </v-tab-item>
            <v-tab-item :value="'qa'">
                <qa-overview></qa-overview>
            </v-tab-item>
            <v-tab-item :value="'modellers'">
                <modellers-overview></modellers-overview>
            </v-tab-item>
        </v-tabs>
        
    </div>
</template>

<script>
import OrderOverview from './OrderOverview.vue';
import userlistview from './UserListView';
import QaOverview from './QaOverview';
import ModellersOverview from './ModellersOverview.vue';
// import orderlistview from './OrderListView'

export default {
    props: {
        account: { type: Object, required: true }
    },
    components: {
        userlistview,
        OrderOverview,
        QaOverview,
        ModellersOverview
        // orderlistview,
    },
    computed: {
        //Store the current tab as query parameter using a computed property with a setter:

        section: { //changed the name to 'section' instead of 'tab' because it will probably
                // make more sense to the user
            set (section) { 
                /* The first tab is selected automatically and displayed in the URL  
                when first logged in as admin*/    
                this.$router.replace({ query: { ...this.$route.query, section } })
            },
            get () {
                return this.$route.query.section
            }
        }
    }

    // data() {
    //     return {
    //         tab: "",
    //     };
    // },
};
</script>

<style lang="scss">
.v-tabs-bar {
    margin-bottom: 20px !important;
}
//changed tab underline color from default to green
.tabColor{
	color:#1FB1A9;
}
</style>