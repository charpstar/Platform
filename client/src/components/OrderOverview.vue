<template>
    <div class="flexrow"> 
        <order-list-view 
            :account="account" 
            :isAdminView="isAdminView" 
            @clicked-order="getOrderId"
        />
        <!-- 'key' re-renders the child component when orderid changes-->
        <order-view 
            :account="account" 
            :orderid="orderid" 
            :key="orderid"
        />   
    </div>
</template>

<script>
import OrderListView from './OrderListView.vue'
import OrderView from './OrderView.vue'

export default {
    data () {
        return {
            orderid: ''
        }
    },
    props: {
        account: { type: Object, required: true },
        isAdminView : { type: Boolean, default: false}
    },
    components: { 
        OrderListView, 
        OrderView 
    },

    methods: {
        getOrderId(id) {
            this.orderid = id
        }
    },

    //If I use mounted, the id is rendered as empty string first and we get console error
    created() {
        this.orderid = 37
    }
}
</script>

<style scoped>

</style>