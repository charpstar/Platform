<template>
    <div>
        <v-dialog v-model="open" width="400px">
            <div class="card flexcol">
                <h2>{{title}}</h2>
                <p v-if="text != ''">{{text}}</p>
                <div class="flexrow buttons">
                    <v-btn @click="click">Confirm</v-btn>
                    <v-btn @click="modal = false">Cancel</v-btn>
                </div>
            </div>
        </v-dialog>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        click: {required: true},
        title: {type: String},
        text: {type: String},
        open: {type: Boolean}
    },
}
</script>

<style lang="scss" scoped>
.buttons > * {
    margin-right: 10px;
}
</style>