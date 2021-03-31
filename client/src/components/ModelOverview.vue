<template>
    <div :class="$vuetify.breakpoint.mdAndUp ? 'flexrow' : ''">
        <!--'key' re-renders the child component when listUpdate changes
            i.e. when a model is updated-->
        <model-list-view 
            v-if="loaded"
            :account="account"
            :key="listUpdate" 
            :models="models"
            @clicked-model="getModelId"
        />

        <!-- 'key' re-renders the child component when modelid changes-->
        <model-view 
            v-if="loaded"
            :account="account" 
            :modelid="modelid" 
            :key="modelid"
            @model-updated="updateList"
        />
    </div>  
 
</template>

<script>
    import backend from "../backend";
    import ModelListView from './ModelListView.vue'
    import ModelView from './ModelView.vue'

    export default {
        data() {
            return {
                loaded: false, //Once the component is mounted, set to true and display subcomponents
                listUpdate: 0, //Use as a key to re-render the model list
                models: {},
                modelid: "",
                order: false
            }
        },
        props: {
            account: { type: Object, required: true},
        },
        components: {
            ModelListView,
            ModelView
        },
        methods: {
            getModelId(id) {
                this.modelid = id
            },
            updateList() { //when a model is updated
                this.fetchModels(); //fetch the models again to get the new data
                this.listUpdate += 1 //increase the key 'listUpdate' by 1 in order to re-render model list
            },
            fetchModels() {
                var vm = this;
                if (vm.$route.path.includes("/modeller/")) {
                    var id = vm.$route.params.id;
                    backend.getModellerModels(id).then(models => {
                        vm.models = models;
                        if (Object.values(vm.models).length > 0) { //execute the following code only if the models' object is not empty to avoid errors
                            //dynamically get the first/ default model to show details for
                            vm.modelid = Object.values(models)[0].modelid   
                        }
                    });
                } else if (vm.$route.path == "/admin/models") {
                    backend.getAllModels().then(models => {
                        vm.models = models;
                        if (Object.values(vm.models).length > 0) {
                            //dynamically get the first/ default model to show details for
                            vm.modelid = Object.values(models)[0].modelid   
                        }
                    });
                } else {
                    vm.order = vm.$route.params.id;
                    backend.getModels(vm.order).then(models => {
                        vm.models = models;
                        if (Object.values(vm.models).length > 0) {
                            //dynamically get the first/ default model to show details for
                            vm.modelid = Object.values(models)[0].modelid   
                        }
                    });
                }

            }
        },
            mounted() {
                this.fetchModels();
                this.loaded = true
            }
        }
        
</script>

<style>

</style>