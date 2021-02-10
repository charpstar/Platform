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
                <v-btn icon class="hidden-xs-only" >
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
                        <td>Date</td>
                        <td v-if="order">{{$formatTime(order.time)}}</td>
                    </tr>
                    <tr>
                        <td>Client</td>
                        <td>{{order.clientname}}</td>
                    </tr>
                    <tr>
                        <td>Assigned QA</td>
                        <td>
                            {{order.qaowner ? order.qaownername : 'None'}}
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
                    <tr>
                        <td>Status</td>
                        <td>
                            {{backend.messageFromStatus(order.state, account.usertype)}}
                            <v-icon>{{backend.iconFromStatus(order.state, account.usertype)}}</v-icon>
                        </td>
                    </tr>
                    <tr>
                        <td>Models</td>
                        <td>{{order.models}}</td>
                    </tr>
                    <tr>
                        <td>Products</td>
                        <td>{{products}}</td>
                    </tr>
                    <!-- <tr>
                        <td>Product states</td>
                        <td><barchart v-if="order" :account="account" :productdata="order.partitiondata"/></td>
                    </tr> -->
                </table>
                <div class="flexcol" id="buttons">
                    <v-btn @click="viewModels">View Models</v-btn>
                    <v-btn @click="downloadExcel">
                        Export Models
                        <v-icon right>mdi-microsoft-excel</v-icon>
                    </v-btn>
                    <confirmmodal 
                        v-if ="account.usertype == 'QA' || account.usertype == 'Admin'" 
                        :handler="del" 
                        :title="'Confirm order delete'"
                        :text="'This will also delete all related models and products'"
                        :buttonText="'Delete order'"
                        :icon="'mdi-delete'"
                        :color="'#d12300'"
                    />
                    <excelupload :handler="add" @file="file=$event" v-if="account.usertype == 'Client' && order.state != 'Done'">
                        Add models
                        <v-icon right>mdi-file-plus</v-icon>
                    </excelupload>
                </div>
            </div>
            <div class="d-flex">
                <div>
                <!-- Pass props to the bar chart component in order to render graph -->
                <barchart v-if="order" 
                    :account="account" 
                    :productdata="order.partitiondata" 
                    :orderstate="backend.messageFromStatus(order.state, account.usertype)"/>
                </div>
                <div>
                    <h2 id="commentsLabel">Comments</h2>
                    <comments
                        v-if="order"
                        :idobj="{orderid: order.orderid}"
                        :type="'Order'"
                        :markinfo="(account.usertype == 'QA' || account.usertype == 'Admin') && ['OrderReview', 'OrderDev'].includes(order.state)"
                        :markresolve="(account.usertype == 'QA' || account.usertype == 'Admin') && order.state == 'OrderMissing'"
                        @state="order.state = $event.orderstatus"
                    />
                </div>  
            </div>
        </div>
    </div>
</template>
<script>
import backend from "./../backend";
import comments from "./CommentView";
import confirmmodal from "./ConfirmModal";
import barchart from './BarChart';
import excelupload from './ExcelUpload';

export default {
    components: {
        comments,
        confirmmodal,
        barchart,
        excelupload
    },
    props: {
        account: { type: Object, required: true }
    },
    computed: {
        products() {
            var sum = 0;
            if (!this.order) {
                return 0
            }
            var states = Object.values(this.order.partitiondata)
            states.forEach(state => {
                sum += parseInt(state.count);
            })
            return sum;
        }
    },
    data() {
        return {
            order: false,
            addComment: "",
            assignLoading: false,
            backend: backend,
            qas: [],
            qa: false,
            assign: backend.promiseHandler(this.assignQAAdmin),
            del: backend.promiseHandler(this.deleteOrder),
            add: backend.promiseHandler(this.addNewModels),
            file: false,
        };
    },
    methods: {
        addNewModels() {
            var vm = this;
            if (vm.file) {
                return backend.createModels(vm.order.orderid, vm.file).then(() => {
                    vm.file = false
                    backend.getOrder(vm.order.orderid).then(order => {
                        vm.order = order;
                    });
                });
            }
        },
        deleteOrder() {
            var vm = this;
            return backend.deleteOrder(vm.order.orderid).then(() => {
                vm.$router.go(-1);
            });
        },
        viewModels() {
            this.$router.push("/order/" + this.order.orderid + "/models");
        },
        downloadExcel() {
            var vm = this;
            backend.downloadExcel(vm.order.orderid, `${vm.order.clientname}_order_${vm.order.orderid}.xlsx`);
        },
        assignQA() {
            var vm = this;
            vm.assignLoading = true;
            backend.assignQA(vm.order.orderid).then(data => {
                vm.assignLoading = false;
                vm.order.qaowner = data.userdata.userid;
                vm.order.qaownername = data.userdata.name;
                if (vm.order.state == 'OrderReceived') {
                    vm.order.state = 'OrderReview'
                }
            });
        },
        assignQAAdmin() {
            var vm = this;
            return backend
                .adminAssignQA(vm.order.orderid, vm.qa.userid)
                .then(() => {
                    if (vm.order.state == 'OrderReceived') {
                        vm.order.state = 'OrderReview'
                    }
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
        if(vm.account.usertype == 'Admin') {
            backend.getUsers().then(modelers => {
                Object.values(modelers).forEach(user => {
                    if (user.usertype == "QA" || user.usertype == "Admin") {
                        vm.qas.push(user);
                    }
                });
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