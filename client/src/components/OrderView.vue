<template>
    <div class="view">
        <v-dialog v-model="assign.modal" width="500">
            <div class="card">
                <v-select :items="qas" label="QA" v-model="qa">
                    <template v-slot:item="{item}">
                        <span>{{item.name}}</span>
                    </template>
                    <template v-slot:selection="{item}">
                        <span>{{item.name}}</span>
                    </template>
                </v-select>
                <v-btn :loading="assign.loading" @click="assign.execute" :disabled="!qa">Assign</v-btn>
                <p class="error-text" v-if="assign.error">{{assign.error}}</p>
            </div>
        </v-dialog>
        <div class="flexrow" id="topRow">
            <div class="flexrow">
                <v-btn icon class="hidden-xs-only">
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn>
                <h2>Order</h2>
            </div>
        </div>
        <div class="flexrow" id="order">
            <div class="flexcolumn">
                <table>
                    <tr>
                        <td>ID</td>
                        <td>{{order.orderid}}</td>
                    </tr>
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
                        <td>{{order.models}}</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td>
                            {{backend.messageFromStatus(order.state)}}
                            <v-icon>{{backend.iconFromStatus(order.state)}}</v-icon>
                        </td>
                    </tr>
                    <tr>
                        <td>Assigned QA</td>
                        <td>
                            {{order.qaowner ? order.qaownername : 'none'}}
                            <v-tooltip bottom v-if="account.usertype == 'QA'">
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        
                                        icon
                                        @click="assignQA"
                                        v-on="on"
                                    >
                                        <v-icon class="iconColor">mdi-account-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Assign self</span>
                            </v-tooltip>
                            <v-tooltip bottom v-if="account.usertype == 'Admin'">
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        icon
                                        v-on="on"
                                        @click="assign.modal = true"
                                    >
                                        <v-icon class="iconColor">mdi-account-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Assign QA</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </table>
                <div class="flexcol" id="buttons">
                    <v-btn @click="viewModels">View Models</v-btn>
                    <v-btn @click="downloadExcel">
                        Export Models
                        <v-icon right>mdi-microsoft-excel</v-icon>
                    </v-btn>
                </div>
            </div>
            <div>
                <h2 id="commentsLabel">Comments</h2>
                <comments
                    v-if="order"
                    :idobj="{orderid: order.orderid}"
                    :type="'Order'"
                    :markdone="account.usertype == 'QA' || account.usertype == 'Admin'"
                    :review="account.usertype == 'Client'"
                    @state="order.state = $event"
                />
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
        account: { type: Object, required: true }
    },
    data() {
        return {
            order: false,
            addComment: "",
            assignLoading: false,
            backend: backend,
            qas: [],
            qa: false,
            assign: backend.promiseHandler(this.assignQAAdmin)
        };
    },
    methods: {
        viewModels() {
            this.$router.push("/order/" + this.order.orderid + "/models");
        },
        downloadExcel() {
            backend.downloadExcel(this.order.orderid);
        },
        assignQA() {
            var vm = this;
            vm.assignLoading = true;
            backend.assignQA(vm.order.orderid).then(data => {
                vm.assignLoading = false;
                vm.order.qaowner = data.userid;
                vm.order.qaownername = data.name;
            });
        },
        assignQAAdmin() {
            var vm = this;
            return backend
                .adminAssignQA(vm.order.orderid, vm.qa.userid)
                .then(() => {
                    vm.order.qaowner = vm.qa.userid;
                    vm.order.qaownername = vm.qa.name;
                    vm.qa = false;
                });
        }
    },
    mounted() {
        var vm = this;
        var orderid = vm.$route.params.id;
        backend.getOrder(orderid).then(order => {
            vm.order = order;
        });
        backend.getUsers().then(modelers => {
            Object.values(modelers).forEach(user => {
                if (user.usertype == "QA" || user.usertype == "Admin") {
                    vm.qas.push(user);
                }
            });
        });
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