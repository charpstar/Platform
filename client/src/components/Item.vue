<template>
    <div id="item">
        <div class="row" id="topRow">
            <v-btn icon class="hidden-xs-only">
              <v-icon @click="$emit('close')">mdi-arrow-left</v-icon>
            </v-btn>
        </div>
        <div class="row" id="itemsrow">
            <model-viewer :src="item.modelLink" auto-rotate camera-controls id="modelView">
                
            </model-viewer>
            <div class="column">
                <h1>{{item.name}}</h1>
                <table id="itemTable">
                    <tr>
                        <td>Status</td><td>{{item.status}}</td><td><i class="material-icons">{{item.statusIcon}}</i></td>
                    </tr>
                    <tr v-if="item.status == 'Complete'">
                        <td>Android link</td><td><v-btn>Copy</v-btn></td>
                    </tr>
                    <tr v-if="item.status == 'Complete'">
                        <td>iOS link</td><td><v-btn>Copy</v-btn></td>
                    </tr>
                    <tr v-if="user.type != 'client'">
                        <td><itemupload /></td>
                    </tr>
                </table>
                <h2 id="commentsLabel">Comments</h2>
                <div class="row" id="addCommentRow">
                    <v-textarea id="addComment" v-model="addComment"
                        name="comment"
                        placeholder="Add comment"
                        :full-width='true'
                        :rounder='true'
                        :hide-details='true'
                        ></v-textarea>
                    <v-icon v-on:click="sendComment">send</v-icon>
                </div>
                <table>
                    <tr class="comment" v-for="comment in item.comments" :key="comment.message">
                        <td>
                            <i class="material-icons">account_circle</i>
                        </td>
                        <td>
                            <p :class="'accountType ' + comment.type">{{comment.name}}</p>
                        </td>
                        <td>
                            <p>{{comment.message}}</p>
                        </td>
                    </tr>
                </table>

            </div>
        </div>
    </div>
</template>
<script>
import itemupload from './ItemUpload'
import backend from './../backend'

export default {
    props: {
        item: {type: Object, required: true},
        user: {type: Object, required: true}
    },
    components: {
        itemupload
    },
    data() {return{
        addComment: ""
    }},
    methods: {
        sendComment(){
            var vm = this
            vm.item.comments.push({
                name: vm.user.name,
                type: vm.user.type,
                message: vm.addComment
            })
            vm.addComment = ""
            backend.sendComment(vm.item.id, vm.item.comments)
        }
    }
}
</script>

<style lang="scss">
#item {
    width: 80vw;
}
#itemTable {
    font-size: 26px;
    color:grey;
    td {
        padding-right: 20px;
        padding: 5px;
    }
}
#modelView {
    width: 400px;
    height: 400px;
    margin-top: 20px;
    margin-right: 20px;
}
#itemsrow {
    align-items: flex-start;
}
#topRow {
    justify-content: start;
}
.comment {
    justify-content: flex-start;
    font-size: 20px;
    td {
        padding-right: 6px;
    }
    .qa{
        background-color: blueviolet;
        color: white;
    }
    .accountType {
        padding: 5px;
        border-radius: 5px;
        display: inline;
    }
    .client{
        background-color: #ebd428;
        color:white;
    }
    .material-icons {
        padding-top: 5px;
    }
}
#maybeFix {
    float: left;
}
h2 {
    font-weight: normal;
    color: grey;
    margin: 0;
    padding: 0;
    font-size: 30px;
}
#commentsLabel{
    margin: 0;
}
.column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    > * {
        margin-bottom: 20px;
    }
}
#addComment{
    width: 40vw;
}

.v-input {
    margin: 0px !important;
    padding: 0px !important;
}

#addCommentRow{
    align-items: flex-end;
    .material-icons {
        color: grey;
        margin-left: 10px;
    }
    margin-left: 5px;

}
#default-progress-bar {
    display: none !important;
}
</style>