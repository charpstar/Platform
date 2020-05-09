<template>
    <div>
        <v-dialog v-model="handler.modal" width="400px">
            <div class="card flexcol">
                <h2>{{title}}</h2>
                <p v-if="text != ''">{{text}}</p>
                <div class="flexrow buttons">
                    <v-btn :loading="handler.loading" @click="handler.execute">Confirm</v-btn>
                    <v-btn @click="handler.modal = false">Cancel</v-btn>
                </div>
                <p class="error-text" v-if="handler.error">{{handler.error}}</p>
            </div>
        </v-dialog>
        <v-btn @click="handler.modal=true" :style="{'background-color': color + ' !important'}">{{buttonText}}<v-icon right v-if="icon">{{icon}}</v-icon></v-btn>
    </div>
</template>

<script>
export default {
    props: {
        handler: {type: Object, required: true},
        title: {type: String, required: true},
        buttonText: {type: String, required: true},
        text: {type: String, required: false, default: ''},
        icon: {default: false},
        color: {default: ''},
    }
}
</script>

<style lang="scss" scoped>
.buttons > * {
    margin-right: 10px;
}
</style>