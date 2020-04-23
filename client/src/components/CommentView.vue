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
                <v-btn v-if="review" block @click="() => sendComment('approve')" :loading="loading['approve']" class="approve">
                    Approve
                    <v-icon right>mdi-check</v-icon>
                </v-btn>
                <v-btn v-if="markdone" block @click="() => sendComment('done')" :loading="loading['done']" class="approve">
                    Done
                    <v-icon right>mdi-check</v-icon>
                </v-btn>
                <v-btn v-if="review" block @click="() => sendComment('reject')" :loading="loading['reject']" class="reject">
                    Reject
                    <v-icon right class="rejectIcon">mdi-refresh</v-icon>
                </v-btn>
                <v-btn v-if="markdone" block @click="() => sendComment('info')" :loading="loading['info']" class="reject">
                    Info
                    <v-icon right class="rejectIcon">mdi-information</v-icon>
                </v-btn>
                <v-btn block @click="() => sendComment('comment')" :loading="loading['comment']">
                    Send
                    <v-icon right>mdi-send</v-icon>
                </v-btn>
            </div>
        </div>
        <div id="comments">
            <div v-if="error != ''" class="error-text">{{error}}</div>
            <div class="comment" v-for="(comment, index) in comments" :key="index">
                <div>
                    <span :class="'name ' + (comment.usertype ? comment.usertype.toLowerCase() : 'client')">{{comment.name}}</span>
                    <span class="timestamp">{{formatTime(comment.time)}}</span>
                    <v-icon v-if="comment.commenttype==1" class="approve">mdi-check</v-icon>
                    <v-icon v-if="comment.commenttype==2" class="reject rejectIcon">mdi-refresh</v-icon>
                </div>
                <div>
                    {{comment.comment}}
                </div>
            </div>
        </div>
        <v-snackbar v-model="snackbar" :timeout="3000">Please add a comment</v-snackbar>
    </div>
</template>

<script>
import backend from '../backend'
export default {
    props: {
        type: {type: String, required: true},
        idobj: {type: Object, required: true},
        review: { type: Boolean, default: false },
        markdone: {type: Boolean, default: false},
    },
    data() {
        return {
            comments: [],
            addComment: "",
            snackbar: false,
            error: '',
            loading: {
                reject: false,
                approve: false,
                comment: false,
                done: false,
                info: false,
            }
        };
    },
    methods: {
        formatTime(timestamp) {
            var now = new Date(Date.parse(timestamp));
            var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate()];
            var time = [ now.getHours(), now.getMinutes()];
            for ( var i = 1; i < 3; i++ ) {
                if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
                }
            }
            return date.join("/") + " " + time.join(":")
        },
        sendComment(ctype) {
            var vm = this;
            if (vm.addComment === "" && !(ctype == 'done' || ctype == 'approve')) {
                vm.snackbar = true;
            } else {
                var comment = {
                    comment: vm.addComment,
                    commenttype: vm.type
                };
                comment = Object.assign(comment, vm.idobj)
                vm.loading[ctype] = true
                backend.sendComment(comment).then((newComment) => {
                    vm.comments.push(newComment);
                    vm.addComment = "";
                    vm.loading = [false,false,false]
                }).catch(error => {
                    vm.error = error
                    vm.loading = [false,false,false]
                })
            }
        }
    },
    mounted() {
        var vm = this
        backend.getComments(vm.idobj).then(comments => {
            vm.comments = comments
        })
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