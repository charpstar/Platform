<template>
    <div>
        <!-- If screen is md(960px) and up, apply styling for 'item', otherwise use styling for 'mobileView' -->
        <div :class="$vuetify.breakpoint.mdAndUp ? 'item' : 'mobileView'" v-if="modelid">
        <!-- <div class="item" v-if="modelid"> -->
            <h3> {{model.modelname}} </h3>
            <div class="row" id="topRow">
                <!-- <v-btn icon class="hidden-xs-only">
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn> -->
                <excelupload 
                id="buttonNew" 
                :handler="addProducts" 
                v-if="account.usertype == 'Client' && model.state != 'Done' && false" 
                @file="file = $event"
                title="Add products">
                    Add products
                    <v-icon right>mdi-file-plus</v-icon>
                </excelupload>
            </div>
            <v-progress-circular v-if="!model" indeterminate></v-progress-circular>
            <v-tabs v-model="tab" show-arrows v-if="account.usertype != 'Client' && model">
            <!-- <v-tabs v-model="tab" show-arrows v-else> -->
                <v-tabs-slider></v-tabs-slider>
                <v-tab :href="`#blendertab`">Product details</v-tab>
                <!-- <v-tab v-if="account.usertype != 'Client'" :href="`#blendertab`">Model</v-tab> -->
                <v-tab v-for="(p, id) in products" :key="id" :href="`#tab-${id}`">{{p.color}}</v-tab>
                <v-tab-item :value="'blendertab'" class="tab">
                    <!-- @updated-model-> communicate via custom event
                    to parent that data has changed in order to refresh the page -->
                    <blenderview 
                        :model="model" 
                        :account="account" 
                        @updated-model="$emit('model-updated')"
                        :products="products"/>
                        <!-- Pass down prop "products" in order to disable approve button
                        when either android or ios link is missing -->
                        <!-- Old code: @state="updateOnStateChange"  -->
                </v-tab-item>
                <v-tab-item class="tab" v-for="(p, id) in products" :key="id" :value="'tab-' + id">
                    <productview 
                        :model="model" 
                        :product="p" 
                        :account="account" 
                        @updated-model="$emit('model-updated')"
                        /> 
                        <!-- Old code: @state="updateOnStateChange" -->
                </v-tab-item>
            </v-tabs>
            <div v-if="account.usertype == 'Client' && model">
                <productview 
                v-for="(p, id) in products" :key="id" 
                :model="model" 
                :product="p" 
                :account="account" 
                @updated-model="$emit('model-updated')"
                />
                <!-- @state="updateOnStateChange" -->
            </div>
        </div>
        <!-- Message to display if there is no data, i.e. no modelid sent from parent component -->
        <div class="item" v-if="!modelid">
            <h3> Product details </h3>
            <p class="emptyState ">No product has been selected</p> 
        </div>
    </div>
</template>
<script>
import blenderview from "./BlenderView";
import productview from "./ProductView";
import backend from "../backend";
import Vue from "vue";
import excelupload from './ExcelUpload'

export default {
    components: {
        blenderview,
        productview,
        excelupload
    },
    props: {
        account: { type: Object, required: true },
        modelid: { type: Number, required: true }
    },
    data() {
        return {
            tab: "",
            products: [],
            model: false,
            file: false,
            addProducts: backend.promiseHandler(this.createProducts)
        };
    },
    methods: {
        /* The following method not used since when state is changed, the whole component 
        refreshes and data is fetched to reflect the new state */

        // updateOnStateChange() {
        //     var vm = this;
        //     backend.getModel(vm.model.modelid).then(model => {
        //         vm.model.state = model.state;
        //     });
        //     backend.getProducts(vm.model.modelid).then(products => {
        //         Vue.set(vm, "products", products);
        //     })
        // },
        createProducts() {
            var vm = this;
            if (vm.file) {
                return backend.createProducts(vm.model.modelid, vm.file).then(() => {
                    vm.file = false
                        backend.getProducts(vm.model.modelid).then(products => {
                            Vue.set(vm, "products", products);
                        })
                });
            }
        },
    },
    mounted() {
        var vm = this;
        // var modelid = vm.$route.params.id;
        if (vm.modelid > 0) { //So that we don't get error "model is undefined" until the component is fully loaded
            backend.getModel(vm.modelid).then(model => {
                model.files = [];
                vm.model = model;
            });
            backend.getProducts(vm.modelid).then(products => {
                Vue.set(vm, "products", products);
            }).then(()=>{ 
                Object.values(this.products).forEach(p => {
                    //for each product in the model, make sure that the newAndroidLink is updated 
                    //in order to get a preview of the model; if the link is null, we don't get a preview
                    if(p.newandroidlink && p.newandroidlink.includes('oldandroid')){
                            var newLink = p.newandroidlink.replace('oldandroid', 'newandroid')
                            p.newandroidlink = newLink
                        }
                });
            })
        }

    }
};
</script>

<style lang="scss" scoped>
h3 {
    text-align: center;
    background-color: rgba(134, 134, 134, 0.2);
    color: #515151;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
}

.item {
    // width: 80vw;
    width: 40vw;
    margin-left: 1em;
}

.mobileView {
    margin-top: 2em;
}

#topRow {
    // justify-content: space-between;
    justify-content: flex-end;
    margin-bottom: 10px;
    margin-top: 10px;
}

.tab {
    margin-top: 20px !important;
}

p.emptyState {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #515151;
}

</style>