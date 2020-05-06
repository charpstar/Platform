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
                <v-btn
                    v-if="review"
                    block
                    @click="() => sendComment('Approve')"
                    :loading="loading['Approve']"
                    class="approve"
                >
                    Approve
                    <v-icon right>mdi-check</v-icon>
                </v-btn>
                <v-btn
                    v-if="markdone"
                    block
                    @click="() => sendComment('Done')"
                    :loading="loading['Done']"
                    class="approve"
                >
                    Done
                    <v-icon right>mdi-check</v-icon>
                </v-btn>
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
                    v-if="markdone"
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
                    <v-icon v-if="comment.commentclass=='Approve' || comment.commentclass=='Done'" class="approve">mdi-check</v-icon>
                    <v-icon
                        v-if="comment.commentclass=='Reject' || comment.commentclass=='Info'"
                        class="reject rejectIcon"
                    >mdi-refresh</v-icon>
                </div>
                <div>{{comment.comment}}</div>
            </div>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">Please add a comment</v-snackbar>
    </div>
</template>

<script>
import backend from "../backend";
export default {
    props: {
        type: { type: String, required: true },
        idobj: { type: Object, required: true },
        review: { type: Boolean, default: false },
        markdone: { type: Boolean, default: false },
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
                Info: false
            }
        };
    },
    methods: {
        sendComment(ctype) {
            var vm = this;
            if (
                vm.addComment === "" &&
                !(ctype == "Done" || ctype == "Approve")
            ) {
                vm.snackbar = true;
            } else {
                var comment = {
                    comment: vm.addComment,
                    commenttype: vm.type,
                    commentclass: ctype,
                    internal: vm.internal
                };
                //eslint-disable-next-line no-console
                console.log(comment)
                comment = Object.assign(comment, vm.idobj);
                vm.loading[ctype] = true;
                backend
                    .sendComment(comment)
                    .then(data => {
                        if(!vm.$emptyObj(data.comment)) {
                            vm.comments.push(data.comment);
                        }
                        vm.$emit('state', data.state.stateafter)
                        vm.addComment = "";
                        vm.loading = {
                            Reject: false,
                            Approve: false,
                            Comment: false,
                            Done: false,
                            Info: false
                        };
                    })
                    .catch(error => {
                        vm.error = error;
                        vm.loading = {
                            Reject: false,
                            Approve: false,
                            Comment: false,
                            Done: false,
                            Info: false
                        };
                    });
            }
        }
    },
    mounted() {
        var vm = this;
        backend.getComments(vm.idobj).then(comments => {
            vm.comments = comments;
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