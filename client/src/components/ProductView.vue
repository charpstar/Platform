<template>
    <div id="item">
        <div class="flexrow" id="itemsrow">
            <div style="position:relative;">
                <v-btn icon @click="reload" class="reloadIcon">
                    <v-icon>mdi-reload</v-icon>
                </v-btn>

                <model-viewer
                    :src="'http://' + product.newandroidlink"
                    auto-rotate
                    camera-controls
                    id="modelViewer"
                    v-if="!hideMv"
                ></model-viewer>
                <div id="modelViewer" v-else></div>
            </div>

            <div class="column">
                <table id="itemTable">
                    <tr>
                        <td>Product page</td>
                        <td>
                            <a :href="product.link" target="_blank">
                                <v-icon class="iconColor">mdi-share</v-icon>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>Android link</td>
                        <td>
                            <v-btn
                                @click="() => {toClipboard(product.newandroidlink)}"
                                icon
                                v-if="product.newandroidlink"
                            >
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
                        <td>
                            <v-btn
                                @click="() => {toClipboard(product.newioslink)}"
                                icon
                                v-if="product.newioslink"
                            >
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
                            <modelversions :product="product" @opened="hideMv = $event" v-if="product.oldandroidlink"></modelversions>
                        </td>
                    </tr>
                </table>
                <v-tabs v-model="commentsTab">
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab v-if="account.usertype != 'Client'" :href="`#qa`">QA Comments</v-tab>
                    <v-tab v-if="account.usertype != 'Modeller'" :href="`#client`">Comments</v-tab>
                    <v-tab-item :value="'qa'" class="tab">
                        <comments
                            :idobj="{productid: product.productid}"
                            :type="'ProductQA'"
                            :review="account.usertype != 'Modeller'"
                            :markdone="account.usertype == 'Modeller'"
                        />
                    </v-tab-item>
                    <v-tab-item :value="'client'" class="tab">
                        <comments
                            :idobj="{productid: product.productid}"
                            :type="'Product'"
                            :review="account.usertype == 'Client'"
                            :markdone="account.usertype != 'Client'"
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
            hideMv: true
        };
    },
    methods: {
        uploadedAndroid(values) {
            this.product.newandroidlink = values[0].new.androidlink;
            if (values[1] != null) {
                this.model.thumbnail = values[1];
            }
        },
        uploadedIos(values) {
            this.product.newioslink = values[0].new.ioslink;
            if (values[1] != null) {
                this.model.thumbnail = values[1];
            }
        },
        toClipboard(text) {
            var vm = this;
            vm.$copyText(text).then(
                () => {
                    vm.snackbar = true;
                },
                () => {
                    alert("Could not copy");
                }
            );
        },
        reload() {
            var vm = this;
            vm.hideMv = true;
            vm.$nextTick(() => {
                vm.hideMv = false;
            });
        }
    },
    mounted() {
        var vm = this;
        setTimeout(() => { vm.hideMv = false; }, 500);
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

.reloadIcon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    .v-icon {
        color: lightgray;
    }
}
</style>