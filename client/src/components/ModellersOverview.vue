<template>
<!-- Component that provides an overview of the currents stats for each Modeller -->
    <v-container>
        <v-row>
            <v-col xs="12" sm="6" v-for="modeller in modellers" :key="modeller.userid">
                <v-card class="modeller-card" raised>
                    <v-card-title>{{modeller.name}}</v-card-title>
                    <!-- <v-card-subtitle>Products</v-card-subtitle> -->
                    <!-- <v-card-text>
                        <p>Assigned: {{modeller.models.length}}</p>
                        <p>Approved: {{modelsApproved(modeller.userid)}}</p>
                        <p>Under development: {{modelsInProgress(modeller.userid)}}</p>
                    </v-card-text> -->
                    <bar-chart-overview 
                        :productData="{Assigned: modeller.models.length, 'Under development': modelsInProgress(modeller.userid), Approved: modelsApproved(modeller.userid)}"
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
    async mounted() {
        await backend.getUsers().then((users)=>{
            Object.values(users).forEach(user => {
                //get the users that are modellers
                if(user.usertype == "Modeller"){
                    //assign one more property "models" to the user; populated in the last step in "mounted"
                    user.models= []
                    this.modellers.push(user)
                }
            })
        })

        //for each modeller, fetch the models they are assigned to
        await this.modellers.forEach(m => backend.getModellerModels(m.userid).then(models => {
        //property "models" includes the models the modeller is assigned to
        m.models = Object.values(models)
        }))
} 
}
</script>

<style>
    .modeller-card {
        margin-right: 1em;
        margin-bottom: 1em;
        color: #23968E !important;
    }

/* Box shadow custom colour */
    .v-card--raised {
        box-shadow: 0px 3px 3px -3px rgba(35, 150, 142, 0.2), 0px 8px 10px 1px rgba(35, 150, 142, 0.14), 0px 3px 14px 2px rgba(35, 150, 142, 0.12) !important;
    }
</style>