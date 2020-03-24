<template>
    <div>
        <div class="row" id="addCommentRow">
            <v-textarea
                id="addComment"
                v-model="addComment"
                name="comment"
                placeholder="Comment Message"
                :full-width="true"
                :hide-details="true"
            ></v-textarea>
            <v-icon v-on:click="sendComment">send</v-icon>
        </div>
        <table>
            <tr class="comment" v-for="comment in comments" :key="comment.id">
                <td>
                    <i :class="'material-icons accountType ' + comment.type">account_circle</i>
                </td>
                <td>{{comment.name}}:</td>
                <td>{{comment.message}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import backend from "../backend";
export default {
    props: {
        comments: { type: Array, required: true },
        account: { type: Object, required: true }
    },
    data() {
        return {
            addComment: ""
        };
    },
    methods: {
        sendComment() {
            var vm = this;
            var comment = {
                name: vm.account.name,
                type: vm.account.type,
                message: vm.addComment,
                id: backend.randomid(32)
            };
            vm.comments.push(comment);
            vm.addComment = "";
            vm.$emit("comment", comment);
        }
    }
};
</script>

<style lang="scss" scoped>
.comment {
    font-size: 20px;
    td {
        padding-right: 0px;
    }
    .qa {
        color: blueviolet;
    }
    .client {
        color: #289deb;
    }
    .material-icons {
        padding-top: 5px;
    }
}

.column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    > * {
        margin-bottom: 20px;
    }
}

.v-input {
    margin: 0px !important;
    padding: 0px !important;
}

#addCommentRow {
    width: 40vw;
    align-items: flex-end;
    .material-icons {
        color: grey;
        margin-left: 10px;
    }
    margin-left: 5px;
}
</style>