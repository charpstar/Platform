<template>
<!-- Component that provides an overview of the currents stats for each QA -->
    <v-container>
        <v-row >
            <v-card v-for="qa in qas" :key="qa.userid" class="qa-card">
                <v-card-title>{{qa.name}}</v-card-title>
                <v-card-subtitle>Products</v-card-subtitle>
                <v-card-text>
                    <p>Assigned: {{qa.models.length}}</p>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
import backend from '../backend'
export default {
    data () {
        return {
            qas: [],
            orders: [],
            loaded: false
        }
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

<style>
    .qa-card {
        margin-right: 1em;
        margin-bottom: 1em;
    }
</style>