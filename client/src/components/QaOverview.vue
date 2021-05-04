<template>
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
    async mounted() {
        await backend.getAllOrders().then((orders)=>{
            this.orders = orders
        })
        
        await backend.getUsers().then((users)=>{
            Object.values(users).forEach(user => {
                if(user.usertype == "QA"){   
                    user.models=[]
                    this.qas.push(user)
                }
            })
    
        })

        await this.qas.forEach(qa => {
            qa.qaOrders = Object.values(this.orders).filter(o => o.qaowner == qa.userid)
        })

        await this.qas.forEach(qa => {
            var qaModels=[]
            qa.qaOrders.forEach(order => {
                backend.getModels(order.orderid).then((models)=> {
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