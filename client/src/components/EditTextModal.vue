<template>
    <div>
        <v-dialog v-model="handler.modal" width="400px">
            <div class="card flexcol">
                <h3><slot /></h3>
                <v-text-field
                    color="#1FB1A9"
                    class="inputText"
                    :label="label"
                    v-model="localCopy"
                ></v-text-field>
                
                <div class="flexrow editbuttons">
                <v-btn 
                    class="saveBtn" 
                    rounded 
                    :loading="handler.loading" 
                    @click="handler.execute(localCopy)">
                        Save
                </v-btn>
                <v-btn 
                    class="cancelBtn"
                    outlined
                    rounded
                    @click="handler.modal = false">
                        Cancel
                </v-btn>
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

.saveBtn {
    color: white;
	margin-top: 15px;
}

.cancelBtn {
    background-color: white !important;
    color: #1FB1A9;
    margin-top: 15px;
}

h3 {
    color: #515151;
    font-weight: normal;
    margin-bottom: 10px;
    text-align: center;
}

.inputText {
    margin-bottom: 10px;
}

</style>