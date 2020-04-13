<template>
    <div>
        <div class="flexrow" id="addCommentRow">
            <v-textarea
                id="addComment"
                v-model="addComment"
                name="comment"
                placeholder="Comment Message"
                :full-width="true"
                :hide-details="true"
            ></v-textarea>
            <div class="flexcol" id="sendButtons">
                <v-btn v-if="review" block @click="() => sendComment(1)" class="approve">Approve<v-icon right>mdi-check</v-icon></v-btn>
                <v-btn v-if="review" block @click="() => sendComment(2)" class="reject">Reject<v-icon right class="rejectIcon">mdi-refresh</v-icon></v-btn>
                <v-btn block @click="() => sendComment(0)">Send<v-icon right>mdi-send</v-icon></v-btn>
            </div>
            
        </div>
        <div id="comments">
        <table>
            <tr class="comment" v-for="comment in comments" :key="comment.userid">
                <td>
                    <i :class="'material-icons accountType ' + comment.usertype.toLowerCase()">account_circle</i>
                </td>
                <td>
                    <v-icon v-if="comment.commenttype==1" class="approve">mdi-check</v-icon>
                    <v-icon v-if="comment.commenttype==2" class="reject rejectIcon">mdi-refresh</v-icon>
                </td>
                <td class="name">{{comment.name}}:</td>
                <td>{{comment.message}}</td>
            </tr>
        </table>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">
            No empty comment
        </v-snackbar>

    </div>
</template>

<script>
import backend from "../backend";
export default {
    props: {
        comments: { type: Array, required: true },
        account: { type: Object, required: true },
        review: {type: Boolean, default: false}
    },
    data() {
        return {
            addComment: "",
            snackbar : false
        };
    },
    methods: {
        sendComment(type) {
            
            var vm = this;
            if(vm.addComment === "") {
                vm.snackbar = true
            } else {
                var comment = {
                    name: vm.account.name,
                    usertype: vm.account.usertype,
                    message: vm.addComment,
                    id: backend.randomid(32),
                    commenttype: type
                };
                vm.comments.push(comment);
                vm.addComment = "";
                vm.$emit("comment", comment);
            }

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
    .name {
        color:grey;
        padding-right: 5px;
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

#comments {
    max-height: 200px;
    overflow-y: scroll;
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

#sendButtons {
    justify-content: flex-end;
    align-items: flex-start;
    .v-btn {
        margin-top: 10px;
        display: block;
        margin-left: 10px;
    }
}

.approve {
    &.v-btn {
        background-color: green !important;
    }
    &.v-icon {
        color: green !important;
    }
}

.reject {
    &.v-btn {
        background-color: #e08300 !important;
    }
    &.v-icon {
        color: #e08300 !important;
    }
}

.rejectIcon {
    transform: scale(-1, 1);
}
</style>