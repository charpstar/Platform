<template>
    <div class="flexrow">
        <model-list-view 
            v-if="modelid"
            :account="account" 
            :models="models"
            @clicked-model="getModelId"
        />

        <!-- 'key' re-renders the child component when modelid changes-->
        <model-view 
            v-if="modelid"
            :account="account" 
            :modelid="modelid" 
            :key="modelid"
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
            }
        },
            mounted() {
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
        }
        
</script>

<style>

</style>