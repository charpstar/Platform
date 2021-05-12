<template>
<!-- Component that provides an overview of the currents stats for each QA -->
    <v-container>
        <v-row >
            <v-col cols="6" v-for="qa in qas" :key="qa.userid">
                <v-card  class="qa-card" raised>
                    <v-card-title>{{qa.name}}</v-card-title>
                    <v-card-subtitle>Products</v-card-subtitle>
                    <v-card-text>
                        <p>Assigned: {{qa.models.length}}</p>
                        <p>Under review: {{modelsToReview(qa.userid)}}</p>
                        <p>Approved: {{modelsApproved(qa.userid)}}</p>
                    </v-card-text>
                    <bar-chart-overview 
                        :productData="{assigned: qa.models.length, review: modelsToReview(qa.userid), approved: modelsApproved(qa.userid)}"
                    />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import backend from '../backend'
import BarChartOverview from './BarChartOverview.vue'
export default {
  components: { BarChartOverview },
    data () {
        return {
            qas: [],
            orders: [],
            loaded: false
        }
    },
    methods: {
        modelsToReview(userid) {
            var qa = this.qas.find(q => q.userid == userid)
            var modelsToReview = Object.values(qa.models).filter(m => m.state == "ProductReview")
            return modelsToReview.length
        },
        modelsApproved(userid) {
            var qa = this.qas.find(q => q.userid == userid)
            var modelsApproved = Object.values(qa.models).filter(m => m.state == "ClientProductReceived")
            return modelsApproved.length
        },
    },
    async mounted() { //async-await to complete the setps in the correct order
        await backend.getAllOrders().then((orders)=>{
            //fetch all orders in order to match them to the QA they are assigned to
            this.orders = orders
        })
        
        await backend.getUsers().then((users)=>{
            Object.values(users).forEach(user => {
                //get the users that are QAs
                if(user.usertype == "QA"){   
                    user.models=[] //property models will be populated in the last step in "mounted"
                    this.qas.push(user)
                }
            })
    
        })

        await this.qas.forEach(qa => {
            //Find each QA's assigned orders
            qa.qaOrders = Object.values(this.orders).filter(o => o.qaowner == qa.userid)
        })

        await this.qas.forEach(qa => { //loop through all available QAs
            var qaModels=[]
            qa.qaOrders.forEach(order => { //for each order assigned to this QA
                backend.getModels(order.orderid).then((models)=> { //get the order's models
                    //"push" the model in the property "models" to populate the array
                    Object.values(models).forEach(m => qaModels.push(m)) 
                }).then(()=>{qa.models=qaModels})
            })
        })
    }
}
</script>

<style lang="scss" scoped>
    .qa-card {
        margin-right: 1em;
        margin-bottom: 1em;
        color: #23968E !important;
    }
    .v-card--raised {
        box-shadow: 0px 3px 3px -3px rgba(35, 150, 142, 0.2), 0px 8px 10px 1px rgba(35, 150, 142, 0.14), 0px 3px 14px 2px rgba(35, 150, 142, 0.12) !important;
    }

</style>