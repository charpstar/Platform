<template>
<!-- If screen is md(960px) and up, apply styling for 'view', otherwise use styling for 'mobileView' -->
    <div :class="$vuetify.breakpoint.mdAndUp ? 'view' : 'mobileView'">

		<!-- commenting off as it has moved to expansion panel (can be deleted later)-->
        <!-- <v-dialog v-model="assign.modal" width="500">
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
        </v-dialog> -->

        
        <div class="flexrow" id="topRow">
            <div>
                <!-- It is probably best to leave the following button out, as user
                won't need to go back to the order list -->

                <!-- <v-btn icon class="hidden-xs-only" >
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn> -->

                <!-- Temporary solution to display which order is displayed -->
                <h3>Order details <span v-if="orderid">- {{orderid}}</span>  </h3>
            </div>
        </div>
      
        <div class="flexrow" id="order">
            <!-- Most of the following code is not necessary when orders' list is displayed 
            next to the order details; modals and other necessary code will be in expansion
            panels instead, like for "Product states" -->
              <!-- This div is not used: -->
            <!-- <div class="flexcolumn">
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
                    </tr> -->
                    <!-- <tr>
                        <td>Product states</td>
                        <td><barchart v-if="order" :account="account" :productdata="order.partitiondata"/></td>
                    </tr> -->
                <!-- </table> -->
                <!-- <div class="flexcol" id="buttons"> -->
                    <!-- <v-btn @click="viewModels">View Models</v-btn>  -->
                    <!--<v-btn @click="downloadExcel">
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
                </div>  -->
            <!-- </div> -->
            <div class='d-flex' v-if="orderid">
                <div>
                <!-- Pass props to the bar chart component in order to render graph -->
                    <barchart 
                        v-if="order" 
                        :account="account" 
                        :productdata="order.partitiondata" 
                        :orderedstates="orderedStates"
                        :baricons="baricons"
                        :clientbaricons="clientbaricons"
                        :total="products"
                        :status="backend.messageFromStatus(order.state, account.usertype)"/>
                </div>
                <!-- If screen is less than 460px in width, display the buttons in a column
                    so that all fit in the screen and they don't become too small -->
				<div :class="$vuetify.breakpoint.width > 460 ? 'flexrow' : 'flexcol'" id="buttons">
                    <v-btn @click="viewModels" color="#1FB1A9" rounded dark small>View Products <v-icon right>mdi-file-image-outline</v-icon></v-btn>
                    <v-btn @click="downloadExcel" color="#1FB1A9" rounded dark small>
                        Export Products
                        <v-icon right>mdi-file-export-outline</v-icon>
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
                    <excelupload 
                    :handler="add" 
                    @file="file=$event" 
                    v-if="account.usertype == 'Client' && order.state != 'Done'"
                    title="Add products">
                        Add products
                        <v-icon right>mdi-file-plus</v-icon>
                    </excelupload>
                </div> 

                <v-expansion-panels focusable>
                    <v-expansion-panel>
                        <v-expansion-panel-header disable-icon-rotate style="background:rgb(134,134,134,0.1);">
                            Product states
                            <template v-slot:actions>
                                <v-icon class="expansionIcon">
                                    mdi-chart-box
                                </v-icon>
                            </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <product-states 
                            v-if="order"
                            :total="products"
                            :account="account" 
                            :orderedstates="orderedStates"
                            :baricons="baricons"
                            :clientbaricons="clientbaricons"
                            />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
					<!--added expansion panel for comments-->
					<v-expansion-panel>
                        <v-expansion-panel-header disable-icon-rotate style="background:rgb(134,134,134,0.1);">
                            Comments
                            <template v-slot:actions>
                                <v-icon class="expansionIcon">
                                    mdi-wechat
                                </v-icon>
                            </template>			
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <comments
                                v-if="order"
                                :idobj="{orderid: order.orderid}"
                                :type="'Order'"
                                :markinfo="(account.usertype == 'QA' || account.usertype == 'Admin') && ['OrderReview', 'OrderDev'].includes(order.state)"
                                :markresolve="(account.usertype == 'QA' || account.usertype == 'Admin') && order.state == 'OrderMissing'"
                                @state="$emit('updated-order')"
                            />
                            <!-- @state="order.state = $event.orderstatus" -->
                        </v-expansion-panel-content>
                        <!--added expansion panel for AssignQA-->
                    </v-expansion-panel>
                    <v-expansion-panel v-if="account.usertype == 'Admin'">
                        <v-expansion-panel-header disable-icon-rotate style="background:rgb(134,134,134,0.1);">
                            Assign QA
                            <template v-slot:actions>
                                <v-icon class="expansionIcon">
                                    mdi-account-plus
                                </v-icon>
                            </template>	
                        </v-expansion-panel-header>
                        <v-expansion-panel-content  >
                        <div class="card">
                            <v-select :items="qas" label="QA" v-model="qa">
                                <template v-slot:item="{item}">
                                    <span>{{item.name}}</span>
                                </template>
                                <template v-slot:selection="{item}">
                                    <span>{{item.name}}</span>
                                </template>
                            </v-select>
                            <v-btn :loading="assign.loading" @click="assign.execute" :disabled="!qa"   rounded color="#1FB1A9" small class="assignBtn">Assign</v-btn>
                            <p class="error-text" v-if="assign.error">{{assign.error}}</p>
                        </div>
                    </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
            <!-- Message to display if there is no data, i.e. no orderid sent from parent component -->
            <div class="emptyState" v-if="!orderid">
                No order has been selected
            </div>
        </div>
    </div>
</template>
<script>
import backend from "./../backend";
import comments from "./CommentView";
import barchart from './BarChart';
import ProductStates from './ProductStates.vue';

/* Import when we use the modals */
import confirmmodal from "./ConfirmModal";
import excelupload from './ExcelUpload';

export default {
    components: {
        comments,
        barchart,
        ProductStates,
        confirmmodal,
        excelupload
    },
    props: {
        account: { type: Object, required: true },
        orderid: { type: Number, required: false }
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
        },

        orderedStates() {
            //sort the states to always get them in the same order and with correct data
            function stateSort( a, b ) {
            if ( a.stateafter < b.stateafter ){
                return -1;
            }
            if ( a.stateafter > b.stateafter ){
                return 1;
            }
            return 0;
            }

            return Object.values(this.order.partitiondata).sort(stateSort)
        },
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

            //icons sources first for admin, then for client
            baricons: {
                ProductInit: '',
                ProductReceived: require('@/assets/bar-icons/unassigned.png'),
                ProductDev: require('@/assets/bar-icons/under-development.png'),
                ProductMissing: require('@/assets/bar-icons/information-missing.png'),
                ProductQAMissing: require('@/assets/bar-icons/client-info-miss.png'),
                ProductReview: require('@/assets/bar-icons/qa-review.png'),
                ProductRefine: require('@/assets/bar-icons/review-revision.png'),
                ClientProductReceived: require('@/assets/bar-icons/client-review.png'),
                ClientFeedback: require('@/assets/bar-icons/client-feedback.png'),
                Done: require('@/assets/bar-icons/complete.png'),
                Error: require('@/assets/bar-icons/error.png')

            },
            clientbaricons:{
                ProductInit: "",
                ProductReceived: require('@/assets/bar-icons/review-revision.png'),
                ProductDev: require('@/assets/bar-icons/under-development.png'),
                ProductMissing: require('@/assets/bar-icons/under-development.png'),
                ProductQAMissing: require('@/assets/bar-icons/information-missing.png'),
                ProductReview: require('@/assets/bar-icons/under-development.png'),
                ProductRefine: require('@/assets/bar-icons/under-development.png'),
                ClientProductReceived: require('@/assets/bar-icons/client-review.png'),
                ClientFeedback: require('@/assets/bar-icons/client-feedback.png'),
                Done: require('@/assets/bar-icons/complete.png'),
                Error: require('@/assets/bar-icons/error.png')
            }
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
                })
                // if data changes in the orders' page when client adds models
                // communicate to parent that data has changed in order to refresh the page
                .then(() => { this.$emit('updated-order')}); 
            }
        },
        deleteOrder() {
            var vm = this;
                return backend.deleteOrder(vm.order.orderid).then(() => { 
                    //communicate to parent that data has changed in order to refresh the page
                    this.$emit('updated-order')
                    });
            // return backend.deleteOrder(vm.order.orderid).then(() => {
            //     vm.$router.go(-1);
            // });
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
            })
            //communicate to parent that data has changed in order to refresh the page
            .then(() => { this.$emit('updated-order')});
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
                })
                //communicate to parent that data has changed in order to refresh the page
                .then(() => { this.$emit('updated-order')});
        }
    },
    mounted() {
        var vm = this;
        // var orderid = vm.$route.params.id; //replaced with prop 
        backend.getOrder(this.orderid).then(order => {
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
	// flex-direction:row;
	justify-content: space-between;
    align-items: flex-start;
    > * {
        margin-bottom: 20px;
		margin-top: 15px;
    }
     .v-btn {
        padding-top: 16px;
        padding-bottom: 16px;
    } 
}

#buttons.flexcol { //when screen is less than 435px in width apply slightly different styling:
    align-items: center;
    > * {
        margin-top: 1px;
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
    // justify-content: flex-start;
    justify-content: center;
    background-color: rgba(134, 134, 134, 0.2);
    h3 {
        color: #515151;
        padding-top: 0.3em;
        padding-bottom: 0.3em;
    }
}

.view {
    width: 40vw;
    margin-left: 1em;
}

.mobileView { // for smaller screens, apply a litle margin to separate orders' table and details
    margin-top: 2em;
}

.expansionIcon {
    margin-left: 10px;
    color: #515151!important;
}

//added to style "Assign" button as per design
.assignBtn {
	color: white;
	margin-top: 15px;
}

div.emptyState {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #515151;
}
</style>