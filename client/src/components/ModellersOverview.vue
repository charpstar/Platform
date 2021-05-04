<template>
        <v-container>
            <v-row>
                <v-card v-for="modeller in modellers" :key="modeller.userid" class="modeller-card">
                    <v-card-title>{{modeller.name}}</v-card-title>
                    <v-card-subtitle>Products</v-card-subtitle>
                    <v-card-text>
                        <p>Assigned: {{Object.values(modeller.models).length}}</p>
                        <p>Approved: {{modelsApproved(modeller.userid)}}</p>
                        <p>Under development: {{modelsInProgress(modeller.userid)}}</p>
                    </v-card-text>
                </v-card>  
            </v-row>
          
        </v-container>
</template>

<script>
import backend from '../backend'
export default {
    data() {
        return {
            modellers: []   
        }
        
    },
    methods: {
        modelsApproved(userid) {
            var modeller = this.modellers.find(m => m.userid == userid)
            var modelsApproved = Object.values(modeller.models).filter(m => m.state == "ClientProductReceived")
            return modelsApproved.length
        },
        modelsInProgress(userid){
            var modeller = this.modellers.find(m => m.userid == userid)
            var modelsInProgress = Object.values(modeller.models).filter(m => m.state == "ProductDev")
            return modelsInProgress.length
        }
    },
    mounted() {
        backend.getUsers().then((users)=>{
            Object.values(users).forEach(user => {
                if(user.usertype == "Modeller"){
                     
                    backend.getModellerModels(user.userid).then(models => {
                        user.models = models
                    }).then(()=>{
                        // eslint-disable-next-line no-console
                        console.log(user)  
                    }).then(()=>{this.modellers.push(user)})
                    
                    
                }
            })
        })
    }
}
</script>

<style>
    .modeller-card {
        margin-right: 1em;
        margin-bottom: 1em;
    }
</style>