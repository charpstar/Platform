<template>
    <div id="item">
        <div class="row" id="topRow">
            <v-btn icon class="hidden-xs-only">
                <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
            </v-btn>
        </div>
        <v-tabs v-model="tab">
            <v-tabs-slider></v-tabs-slider>
            <v-tab v-if="account.usertype != 'Client'" :href="`#blendertab`">Blender Model</v-tab>
            <v-tab v-for="(p, id) in model.products" :key="id" :href="`#tab-${id}`">
                {{p.color}}
            </v-tab>
            <v-tab-item :value="'blendertab'">
                <blenderview :model="model" :account="account"/>
            </v-tab-item>
            <v-tab-item v-for="(p, id) in model.products" :key="id" :value="'tab-' + id">
                <productview :model="model" :product="p" :account="account"/>
            </v-tab-item>
        </v-tabs>
    </div>
</template>
<script>
import blenderview from './BlenderView'
import productview from './ProductView'

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
        };
    },
};
</script>

<style lang="scss" scoped>
#item {
    width: 80vw;
}

#topRow {
    justify-content: start;
}

</style>