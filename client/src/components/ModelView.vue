<template>
    <div id="item">
        <div class="row" id="topRow">
            <v-btn icon class="hidden-xs-only">
                <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
            </v-btn>
        </div>
        <v-tabs v-model="tab">
            <v-tabs-slider></v-tabs-slider>
            <v-tab v-if="account.usertype != 'Client'" :href="`#blendertab`">Model</v-tab>
            <v-tab v-for="(p, id) in products" :key="id" :href="`#tab-${id}`">
                {{p.color}}
            </v-tab>
            <v-tab-item :value="'blendertab'" class="tab">
                <blenderview :model="model" :account="account"/>
            </v-tab-item>
            <v-tab-item class="tab" v-for="(p, id) in products" :key="id" :value="'tab-' + id">
                <productview :model="model" :product="p" :account="account"/>
            </v-tab-item>
        </v-tabs>
    </div>
</template>
<script>
import blenderview from './BlenderView'
import productview from './ProductView'
import backend from '../backend';
import Vue from 'vue'
export default {
    components: {
        blenderview,
        productview
    },
    props: {
        model: { type: Object, required: true },
        account: { type: Object, required: true }
    },
    data() {
        return {
            tab: '',
            products: []
        };
    },
    mounted() {
        var vm = this
        backend.getProducts(vm.model.modelid).then(products => {
            Vue.set(vm, 'products', products)
        })
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