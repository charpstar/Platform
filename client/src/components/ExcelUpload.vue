<template>
    <div>
        <v-dialog v-model="handler.modal" width="500">
            <div class="card">
                <v-file-input 
                    :label="'Select Excel Document'" 
                    @change="$emit('file',$event); file = $event"
                    color="#1FB1A9">
                </v-file-input>
                <p v-if="handler.error">{{handler.error}}</p>
                <p v-if="!fileIsExcel">Must be a .xlsx file</p>
                <v-btn
                    :disabled="!file || !fileIsExcel"
                    :loading="handler.loading"
                    @click="handler.execute"
                    class="uploadBtn"
                    rounded
                >Upload</v-btn>
            </div>
        </v-dialog>
        <v-btn rounded dark small id="handlerBtn" @click="handler.modal=true">
            <slot></slot>
        </v-btn>
    </div>
</template>

<script>
export default {
    props: {
        handler: {type: Object, required: true}
    },
    data() {
        return {
            file: false,
        };
    },
    computed: {
        fileIsExcel() {
            var vm = this;
            if (vm.file) {
                var arr = vm.file.name.split(".");
                var last = arr[arr.length - 1];
                return last == "xlsx";
            }
            return true;
        },
    }
}
</script>

<style lang="scss" scoped>
    #handlerBtn {
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .uploadBtn {
        /* Buttons with the "dark" prop disappear when disabled 
        so adjusted the text color in CSS instead*/
        color: white;
        margin-top: 10px
    }
</style>