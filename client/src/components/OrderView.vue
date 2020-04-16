<template>
    <div class="view">
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only">
                    <v-icon @click="$emit('back')">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Order</h2>
            </div>
        </div>
        <div class="flexrow" id="order">
            <div class="flexcolumn">
                <table>
                    <tr>
                        <td>Client</td>
                        <td>{{order.clientname}}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>{{order.time}}</td>
                    </tr>
                    <tr>
                        <td>Models</td>
                        <td>{{order.amount}}</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td>
                            {{backend.messageFromStatus(order.status)}}
                            <v-icon>{{backend.iconFromStatus(order.status)}}</v-icon>
                        </td>
                    </tr>
                    <tr>
                        <td>Assigned QA</td>
                        <td>
                            {{order.assignedqa ? order.assignedqa : 'none'}}
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        v-if="account.usertype == 'QA' || account.usertype == 'Admin'"
                                        icon
                                        @click="assignQA"
                                        v-on="on"
                                    >
                                        <v-icon class="iconColor">mdi-account-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Assign self</span>
                            </v-tooltip>
                            
                        </td>
                        
                    </tr>
                </table>
                <div class="flexcol" id="buttons">
                    <v-btn @click="viewModels">View Models</v-btn>
                    <v-btn>
                        Export Models
                        <v-icon right>mdi-microsoft-excel</v-icon>
                    </v-btn>
                </div>
            </div>
            <div>
                <h2 id="commentsLabel">Comments</h2>
                <comments :commentendpoint="sendComment" :account="account" :comments="order.comments" />
            </div>
        </div>
    </div>
</template>
<script>
import backend from "./../backend";
import comments from "./CommentView";
export default {
    components: {
        comments
    },
    props: {
        order: { type: Object, required: true },
        account: { type: Object, required: true }
    },
    data() {
        return {
            addComment: "",
            assignLoading: false,
            backend: backend
        };
    },
    methods: {
        viewModels() {
            this.$emit("view-models");
        },
        sendComment() {
            var vm = this;
            return backend.updateOrderComments(vm.order);
        },
        assignQA() {
            var vm = this;
            vm.assignLoading = true;
            backend.assignQA(vm.order.orderid, vm.account).then(data => {
                vm.assignLoading = false;
                vm.order.assignedqa = data;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
#buttons {
    align-items: flex-start;
    > * {
        margin-bottom: 10px;
    }
}
#order {
    align-items: flex-start;
    margin: 10px;
}
table {
    td {
        color: grey;
        padding: 3px;
        padding-right: 20px;
        margin: 0;
        font-size: 20px;
    }
    margin-bottom: 10px;
}

#topRow {
    justify-content: flex-start;
}
</style>