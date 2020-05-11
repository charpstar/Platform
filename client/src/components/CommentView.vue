<template>
    <div>
        <div class="flexrow" id="addCommentRow">
            <v-textarea
                id="addComment"
                v-model="addComment"
                name="comment"
                placeholder="Message"
                :full-width="true"
                :hide-details="true"
            ></v-textarea>
            <div class="flexcol" id="sendButtons">
                <commentmodal
                    :title="'Confirm approve'"
                    :text="'You will not be able to rever this action'"
                    :open="modalapprove"
                    :click="() => sendComment('Approve')"
                >
                    <v-btn
                        v-if="review"
                        block
                        @click="modalapprove = true"
                        :loading="loading['Approve']"
                        class="approve"
                    >
                        Approve
                        <v-icon right>mdi-check</v-icon>
                    </v-btn>
                </commentmodal>
                <commentmodal
                    :title="'Confirm mark as done'"
                    :open="modaldone"
                    :click="() => sendComment('Done')"
                >
                    <v-btn
                        v-if="markdone"
                        block
                        @click="modaldone = true"
                        :loading="loading['Done']"
                        class="approve"
                        :disabled="markdonedisabled"
                    >
                        Done
                        <v-icon right>mdi-check</v-icon>
                    </v-btn>
                </commentmodal>
                <commentmodal
                    :title="'Confirm resolve'"
                    :open="modalresolve"
                    :click="() => sendComment('Resolve')"
                >
                    <v-btn
                        v-if="markresolve"
                        block
                        @click="modalresolve = true"
                        :loading="loading['Resolve']"
                        class="approve"
                    >
                        Resolve
                        <v-icon right>mdi-check</v-icon>
                    </v-btn>
                </commentmodal>
                <v-btn
                    v-if="review"
                    block
                    @click="() => sendComment('Reject')"
                    :loading="loading['Reject']"
                    class="reject"
                >
                    Reject
                    <v-icon right class="rejectIcon">mdi-refresh</v-icon>
                </v-btn>
                <v-btn
                    v-if="markinfo"
                    block
                    @click="() => sendComment('Info')"
                    :loading="loading['Info']"
                    class="reject"
                >
                    Info
                    <v-icon right class="rejectIcon">mdi-information</v-icon>
                </v-btn>
                <v-btn block @click="() => sendComment('Comment')" :loading="loading['Comment']">
                    Send
                    <v-icon right>mdi-send</v-icon>
                </v-btn>
            </div>
        </div>
        <div id="comments">
            <div v-if="error != ''" class="error-text">{{error}}</div>
            <div class="comment" v-for="(comment, index) in comments" :key="index">
                <div>
                    <span
                        :class="'name ' + (comment.usertype ? comment.usertype.toLowerCase() : 'client')"
                    >{{comment.name}}</span>
                    <span class="timestamp">{{$formatTime(comment.time)}}</span>
                    <v-icon
                        :class="{
                            reject: comment.commentclass=='Reject' || comment.commentclass=='Info',
                            approve: comment.commentclass=='Approve' || comment.commentclass=='Done' || comment.commentclass=='Resolve',
                            rejectIcon: comment.commentclass=='Reject'
                        }"
                    >{{icons[comment.commentclass]}}</v-icon>
                </div>
                <div>{{comment.comment}}</div>
            </div>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">Please add a comment</v-snackbar>
    </div>
</template>

<script>
import backend from "../backend";
import commentmodal from "./CommentModal";
export default {
    components: {
        commentmodal
    },
    props: {
        type: { type: String, required: true },
        idobj: { type: Object, required: true },
        review: { type: Boolean, default: false },
        markdone: { type: Boolean, default: false },
        markdonedisabled: { type: Boolean, default: false },
        markinfo: { type: Boolean, default: false },
        markresolve: { type: Boolean, default: false },
        internal: { type: Boolean, default: false }
    },
    data() {
        return {
            comments: [],
            addComment: "",
            snackbar: false,
            error: "",
            loading: {
                Reject: false,
                Approve: false,
                Comment: false,
                Done: false,
                Info: false,
                Resolve: false
            },
            modalresolve: false,
            modalapprove: false,
            modaldone: false,
            icons: {
                Reject: "mdi-refresh",
                Approve: "mdi-check",
                Comment: "",
                Done: "mdi-check",
                Info: "mdi-information",
                Resolve: "mdi-check"
            }
        };
    },
    methods: {
        sendComment(ctype) {
            var vm = this;
            if (vm.addComment === "") {
                switch (ctype) {
                    case "Done": {
                        vm.addComment = "Marked as done";
                        break;
                    }
                    case "Approve": {
                        vm.addComment = "Approved";
                        break;
                    }
                    case "Resolve": {
                        vm.addComment = "Resolved";
                        break;
                    }
                    default: {
                        vm.snackbar = true;
                        return;
                    }
                }
            }
            var comment = {
                comment: vm.addComment,
                commenttype: vm.type,
                commentclass: ctype,
                internal: vm.internal
            };
            comment = Object.assign(comment, vm.idobj);
            vm.loading[ctype] = true;
            backend
                .sendComment(comment)
                .then(data => {
                    if (data.comments != null && !vm.$emptyObj(data.comments)) {
                        Object.values(data.comments).forEach(comment => {
                            vm.comments.unshift(comment);
                        });
                    }
                    if (data.state != null && !vm.$emptyObj(data.state)) {
                        vm.$emit("state", data.state);
                    }
                    vm.addComment = "";
                    vm.loading = {
                        Reject: false,
                        Approve: false,
                        Comment: false,
                        Done: false,
                        Info: false,
                        Resolve: false
                    };
                    vm.modalresolve = false;
                    vm.modalapprove = false;
                    vm.modaldone = false;
                })
                .catch(error => {
                    vm.error = error;
                    vm.loading = {
                        Reject: false,
                        Approve: false,
                        Comment: false,
                        Done: false,
                        Info: false,
                        Resolve: false
                    };
                    vm.modalresolve = false;
                    vm.modalapprove = false;
                    vm.modaldone = false;
                });
        }
    },
    mounted() {
        var vm = this;
        backend.getComments(vm.idobj).then(comments => {
            vm.comments = Object.values(comments)
                .slice()
                .reverse();
        });
    }
};
</script>

<style lang="scss" scoped>
.timestamp {
    font-size: 14px;
    color: #878787;
}
.comment {
    font-size: 20px;
    .qa {
        color: blueviolet;
    }
    .admin {
        color: blueviolet;
    }
    .client {
        color: #289deb;
    }
    .modeller {
        color: green;
    }
    .name {
        font-size: 16px;
        padding-right: 5px;
    }
    margin-top: 10px;
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