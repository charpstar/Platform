<template>
    <div id="item">
        <div class="row" id="itemsrow">
            <model-viewer :src="product.androidmodel" auto-rotate camera-controls id="modelView"></model-viewer>
            <div class="column">
                <table id="itemTable">
                     <tr>
                        <td>Color</td>
                        <td>{{product.color}}</td>

                    </tr>
                    <tr >
                        <td>Android link</td>
                        <td v-if="product.androidmodel != ''">
                            <v-btn @click="snackbar = true">Copy</v-btn>
                        </td>
                    </tr>
                    <tr >
                        <td>iOS link</td>
                        <td v-if="product.iosmodel != ''">
                            <v-btn @click="snackbar = true">Copy</v-btn>
                        </td>
                    </tr>
                    <tr v-if="account.usertype != 'Client'">
                        <td>
                            <modelupload :model="model" :product="product" @upload="uploaded" />
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
import modelupload from "./ModelUpload";
import backend from "./../backend";
import comments from "./CommentView";

export default {
    components: {
        modelupload,
        comments
    },
    props: {
        product: { type: Object, required: true },
        model: { type: Object, required: true },
        account: { type: Object, required: true }
    },
    data() {
        return {
            snackbar: false
        };
    },
    methods: {
        uploaded(values) {
            this.product.androidmodel = values[0];
            this.model.thumbnail = values[2];
        },
        sendComment() {
            var vm = this;
            backend.updateProductComments(vm.model, vm.product);
        },
    }
};
</script>

<style lang="scss" scoped>
#item {
    width: 80vw;
}
#itemTable {
    font-size: 26px;
    color: grey;
    td {
        padding-right: 20px;
        padding: 5px;
    }
}
#modelView {
    width: 400px;
    height: 400px;
    margin: 20px;
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