<template>
    <div class="flexrow">
        <model-list-view />
        <model-view />
    </div>
</template>

<script>
import ModelListView from './ModelListView.vue'
import ModelView from './ModelView.vue'

export default {
    components: {
        ModelListView,
        ModelView
    }

}
</script>

<style>

</style>