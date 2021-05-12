<template>
<!-- Component that provides an overview of the currents stats for each Modeller -->
    <v-container>
        <v-row>
            <v-col>
                <v-card v-for="modeller in modellers" :key="modeller.userid" class="modeller-card">
                    <v-card-title>{{modeller.name}}</v-card-title>
                    <v-card-subtitle>Products</v-card-subtitle>
                    <v-card-text>
                        <p>Assigned: {{Object.values(modeller.models).length}}</p>
                        <p>Approved: {{modelsApproved(modeller.userid)}}</p>
                        <p>Under development: {{modelsInProgress(modeller.userid)}}</p>
                    </v-card-text>
                </v-card>  
            </v-col>
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
                //get the users that are modellers
                if(user.usertype == "Modeller"){
                    //for each modeller, fetch the models they are assigned to
                    backend.getModellerModels(user.userid).then(models => {
                        //assign one more property "models" to the user, which includes the models
                        //they are assigned to
                        user.models = models
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