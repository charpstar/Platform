<template>
    <div>
        <v-dialog v-model="handler.modal" width="400px">
            <div class="card flexcol">
                <h2>{{title}}</h2>
                <p v-if="text != ''">{{text}}</p>
                <v-btn :loading="handler.loading" @click="handler.execute">Confirm</v-btn>
                <v-btn @click="handler.modal = false">Cancel</v-btn>
                <p class="error-text" v-if="handler.error">{{handler.error}}</p>
            </div>
        </v-dialog>
        <v-btn @click="handler.modal=true">{{buttonText}}</v-btn>
    </div>
</template>

<script>
export default {
    props: {
        handler: {type: Object, required: true},
        title: {type: String, required: true},
        buttonText: {type: String, required: true},
        text: {type: String, required: false, default: ''}
    }
}
</script>

<style lang="scss" scoped>
.v-btn {
    margin-top: 10px;
}
</style>