<template>
    <div id="item">
        <div class="flexrow" id="itemsrow">
            <model-viewer :src="product.androidmodel" auto-rotate camera-controls id="modelView"></model-viewer>
            <div class="column">
                <table id="itemTable">
                    <tr>
                        <td>Color</td>
                        <td class="colorCell">{{product.color}}</td>
                    </tr>
                    <tr>
                        <td>Android link</td>
                        <td v-if="product.androidmodel != ''">
                            <v-btn @click="snackbar = true" icon><v-icon class="iconColor">mdi-clipboard-text-outline</v-icon></v-btn>
                            <modelupload v-if="account.usertype != 'Client'" :model="model" :product="product" :uploadfun="androidUploadFun" @upload="uploadedAndroid" />
                        </td>
                    </tr>
                    <tr>
                        <td>iOS link</td>
                        <td v-if="product.iosmodel != ''">
                            <v-btn @click="snackbar = true" icon><v-icon class="iconColor">mdi-clipboard-text-outline</v-icon></v-btn>
                            <modelupload v-if="account.usertype != 'Client'" :model="model" :product="product" :uploadfun="iosUploadFun" @upload="uploadedIos" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <modelversions :product="product"></modelversions>
                        </td>
                    </tr>
                </table>
                <h2 id="commentsLabel">Comments</h2>
                <comments
                    :account="account"
                    :comments="product.comments"
                    @comment="sendComment"
                    :review="true"
                />
            </div>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">Link copied to clipboard</v-snackbar>
    </div>
</template>
<script>
import modelupload from "./ModelUpload"
import backend from "./../backend"
import comments from "./CommentView"
import iconbutton from './IconButton'
import modelversions from './VersionModal'

export default {
    components: {
        modelupload,
        comments,
        iconbutton,
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
        };
    },
    methods: {
        uploadedAndroid(values) {
            this.product.androidmodel = values[0];
            if(values[1] != null) {
                this.model.thumbnail = values[1];
            }
        },
        uploadedIos(values) {
            this.product.iosmodel = values[0];
            if(values[1] != null) {
                this.model.thumbnail = values[1];
            }
        },
        sendComment() {
            var vm = this;
            backend.updateProductComments(vm.model, vm.product);
        },
    },
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
    td {
        padding-right: 20px;
    }
}
#modelView {
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
    > * {
        margin-bottom: 20px;
    }
}

#default-progress-bar {
    display: none !important;
}
</style>