<template>
    <div>
        <v-dialog v-model="handler.modal" width="400px">
            <div class="card flexcol">
                <h2><slot /></h2>
                <v-text-field
                    :label="label"
                    v-model="localCopy"
                ></v-text-field>
                
                <div class="flexrow editbuttons">
                <v-btn :loading="handler.loading" @click="handler.execute(localCopy)">Save</v-btn>
                <v-btn @click="handler.modal = false">Cancel</v-btn>
                </div>
                <p class="error-text" v-if="handler.error">{{handler.error}}</p>
            </div>
        </v-dialog>
    </div>
</template>

<script>

export default {
    props: {
        text: {required: true},
        handler: {type: Object, required: true},
        label: {type: String, required: true}
    },
    data() {
        return {
            localCopy: this.text,
        };
    },
    watch: {
        text(newVal) {
          this.localCopy = newVal;
        }
    }
}
</script>

<style lang="scss" scoped>
.editbuttons > * {
    margin-right: 10px;
}
</style>