<template>
    <div>
        <v-btn rounded class="actionBtn" @click="open = true">
            <span>Compare versions</span> 
            <v-icon right>mdi-file-compare</v-icon>
        </v-btn>
        <v-dialog v-model="open" width="600">
            <div class="flexrow card">
                <div class="flexcol">
                    <h2>Current Version</h2>
                    <model-viewer :src="'http://' + product.newandroidlink + '?c=1'" camera-controls class="mv"></model-viewer>
                </div>
                <div class="flexcol">
                    <h2>Previous Version</h2>
                    <!-- this model will be replaced by previous version-->
                    <model-viewer :src="'http://' + product.oldandroidlink + '?c=1'" camera-controls class="mv"></model-viewer>
                </div>
            </div>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        product: { type: Object, required: true }
    },
    data() {
        return {
            open: false
        };
    },
    watch: {
        open(val) {
            this.$emit("opened", val);
        }
    }
};
</script>

<style lang="scss" scoped>
.mv {
    width: 250px;
    height: 250px;
    margin: 20px;
}

.actionBtn {
    color: white;
    span {
        margin-right: 0.5em;
    }
}
</style>