<template>
    <div id="item">
        <div class="flexrow" id="itemsrow">
            <model-viewer :src="product.androidmodel" auto-rotate camera-controls id="modelViewer" v-if="!hideMv"></model-viewer>
            <div id="modelViewer" v-else></div>
            <div class="column">
                <table id="itemTable">
                    <tr>
                        <td>Android link</td>
                        <td v-if="product.androidmodel != ''">
                            <v-btn @click="snackbar = true" icon>
                                <v-icon class="iconColor">mdi-clipboard-text-outline</v-icon>
                            </v-btn>
                            <modelupload
                                v-if="account.usertype != 'Client'"
                                :model="model"
                                :product="product"
                                :uploadfun="androidUploadFun"
                                @upload="uploadedAndroid"
                                @opened="hideMv = $event"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>iOS link</td>
                        <td v-if="product.iosmodel != ''">
                            <v-btn @click="snackbar = true" icon>
                                <v-icon class="iconColor">mdi-clipboard-text-outline</v-icon>
                            </v-btn>
                            <modelupload
                                v-if="account.usertype != 'Client'"
                                :model="model"
                                :product="product"
                                :uploadfun="iosUploadFun"
                                @upload="uploadedIos"
                                @opened="hideMv = $event"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <modelversions :product="product"
                            @opened="hideMv = $event"></modelversions>
                        </td>
                    </tr>
                </table>
                <v-tabs v-model="commentsTab">
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab v-if="account.usertype != 'Client'" :href="`#qa`">QA Comments</v-tab>
                    <v-tab v-if="account.usertype != 'Modeller'" :href="`#client`">Comments</v-tab>
                    <v-tab-item :value="'qa'" class="tab">
                        <comments
                            :account="account"
                            :comments="product.qacomments"
                            :commentendpoint="sendQAComment"
                            :review="true"
                        />
                    </v-tab-item>
                    <v-tab-item :value="'client'" class="tab">
                        <comments
                            :account="account"
                            :comments="product.comments"
                            :commentendpoint="sendComment"
                            :review="true"
                        />
                    </v-tab-item>
                </v-tabs>
            </div>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">Link copied to clipboard</v-snackbar>
    </div>
</template>
<script>
import modelupload from "./ModelUpload";
import backend from "./../backend";
import comments from "./CommentView";
import modelversions from "./VersionModal";

export default {
    components: {
        modelupload,
        comments,
        modelversions
    },
    props: {
        product: { type: Object, required: true },
        model: { type: Object, required: true },
        account: { type: Object, required: true }
    },
    data() {
        return {
            snackbar: false,
            androidUploadFun: backend.uploadAndroidModel,
            iosUploadFun: backend.uploadIosModel,
            commentsTab: "",
            hideMv: false
        };
    },
    methods: {
        uploadedAndroid(values) {
            this.product.androidmodel = values[0];
            if (values[1] != null) {
                this.model.thumbnail = values[1];
            }
        },
        uploadedIos(values) {
            this.product.iosmodel = values[0];
            if (values[1] != null) {
                this.model.thumbnail = values[1];
            }
        },
        sendComment() {
            var vm = this;
            return backend.updateProductComments(vm.model, vm.product);
        },
        sendQAComment() {
            var vm = this;
            return backend.updateProductQAComments(vm.model, vm.product);
        }
    }
};
</script>

<style lang="scss" scoped>
.colorCell {
    padding-left: 8px;
}
#item {
    width: 80vw;
}
#itemTable {
    font-size: 20px;
    color: grey;
}
#modelViewer {
    width: 400px;
    height: 400px;
    margin-right: 20px;
}
#itemsrow {
    align-items: flex-start;
}
#topRow {
    justify-content: start;
}

.column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

#default-progress-bar {
    display: none !important;
}
</style>