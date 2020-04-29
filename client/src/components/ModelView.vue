<template>
    <div id="item">
        <div class="row" id="topRow">
            <v-btn icon class="hidden-xs-only">
                <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
            </v-btn>
        </div>
        <v-progress-circular v-if="!model" indeterminate></v-progress-circular>
        <v-tabs v-model="tab" v-else>
            <v-tabs-slider></v-tabs-slider>
            <v-tab v-if="account.usertype != 'Client'" :href="`#blendertab`">Model</v-tab>
            <v-tab v-for="(p, id) in products" :key="id" :href="`#tab-${id}`">{{p.color}}</v-tab>
            <v-tab-item :value="'blendertab'" class="tab">
                <blenderview :model="model" :account="account" />
            </v-tab-item>
            <v-tab-item class="tab" v-for="(p, id) in products" :key="id" :value="'tab-' + id">
                <productview :model="model" :product="p" :account="account" />
            </v-tab-item>
        </v-tabs>
    </div>
</template>
<script>
import blenderview from "./BlenderView";
import productview from "./ProductView";
import backend from "../backend";
import Vue from "vue";
export default {
    components: {
        blenderview,
        productview
    },
    props: {
        account: { type: Object, required: true }
    },
    data() {
        return {
            tab: "",
            products: [],
            model: false
        };
    },
    mounted() {
        var vm = this;
        backend.getModel(vm.$route.params.id).then(model => {
            vm.model = model;
            backend.getProducts(vm.model.modelid).then(products => {
                Vue.set(vm, "products", products);
            })
        });
    }
};
</script>

<style lang="scss" scoped>
#item {
    width: 80vw;
}

#topRow {
    justify-content: start;
}

.tab {
    margin-top: 20px !important;
}
</style>