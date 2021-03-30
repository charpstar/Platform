<template>
    <div class="modelsList">
        <div class="flexrow" id="topRow">
            <div class="flexrow arrowBack">
                <v-btn icon class="hidden-xs-only" v-if="account.usertype != 'Modeller'">
                    <v-icon @click="$router.go(-1)">mdi-arrow-left</v-icon>
                </v-btn>
            </div>    
            <h2>Models</h2>
        </div>
        
        <div id="itemsView">
            <div class="flexrow" id="filtering">
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Filter"
                    single-line
                    hide-details
                    clearable
                    color="#1FB1A9"
                    class="filter"
                ></v-text-field>
                <v-menu offset-y v-model="menuOpen">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" class="filterbutton" small rounded dark>
                            Filter
                            <v-icon right>mdi-menu-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                            v-for="(text, filter) in filters"
                            :key="filter"  
                            @click="searchFor(filter)"
                        >
                        <!-- @click="search += ' ' + filter + ' '" -->
                            <v-list-item-title>{{ text }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <!-- Instead of using the Object.values as they are, use a computed property "items" -->
            <!-- :items="Object.values(models)" -->
            <v-data-table
                id="table"
                :headers="filteredHeaders"
                :items="items"
                :items-per-page="-1"
                :must-sort="true"
                :sort-by="'name'"
                :search="search"
            >
            <!-- Code inspired by solution on https://codepen.io/huntleth/pen/eYOrWog.
            Replaced the code using v-slots for the table with simple <tr> and <td> because:
                    First: it gave many eslint errors
                    Second: to be able to highlight a single row -->
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr 
                        :class="key === selectedRow ? 'highlightedRow' : ''" 
                        @click="rowSelect(key); handleClick(item.modelid)" 
                        v-for="(item, key) in items" 
                        :key="item.modelid">
                            <td>
                                <img
                                    :src="backend.getThumbURL(item.modelid)"
                                    class="thumbnail"
                                    onerror="this.style.display='none'"
                                />
                            </td>
                            <td>{{item.modelid}}</td>
                            <td>{{item.modelname}}</td>
                            <!-- Use v-if to render these cells for specific user types -->
                            <td v-if="account.usertype!=='Client'">{{item.client}}</td>
                            <td 
                            v-if="account.usertype!=='Client' 
                            && account.usertype!=='Modeller'">
                                <span v-if="item.modelowner">{{item.modelowner}}</span>
                                <span v-else ><i>Unassigned</i></span>    
                            </td>
                            <!-- State is already defined in items() -->
                            <!-- <td>{{backend.messageFromStatus(item.state, account.usertype)}}</td> -->
                            <td>{{item.state}}</td>
                            
                            <!-- Products already defined in items() -->
                            <!-- <td>{{sumProducts(item)}}</td> -->
                            <td>{{item.products}}</td>
                            
                        </tr>
                    </tbody>
                </template>
                <!-- <template v-slot:item.thumb="{item}">
                    <img
                        :src="backend.getThumbURL(item.modelid)"
                        class="thumbnail"
                        onerror="this.style.display='none'"
                    />
                </template> -->
                <!-- <template v-slot:item.state="{value}">
                    {{backend.messageFromStatus(value, account.usertype)}}
                    <v-icon>{{backend.iconFromStatus(value, account.usertype)}}</v-icon>
                </template> -->
                            <!-- This template for barchart is not used anymore: -->
                            <!-- <template v-slot:item.partitiondata="{value}">
                                <barchart :productdata="value" :account="account" />
                            </template> -->
                            <!-- ------ -->
                <!-- <template v-slot:item.products="{item}">{{sumProducts(item)}}</template>
                <template v-slot:item.modelowner="{value}">
                    <span v-if="value">{{value}}</span>
                    <span v-else ><i>Unassigned</i></span>
                </template> -->
            </v-data-table>
        </div>
        <!-- This div is displayed when there are no models, i.e. no data to display -->
        <div class="emptyState" 
            v-if="Object.values(models).length == 0">
            <!-- Different messages for different user types: -->
            <span v-if="account.usertype=='Modeller'">You have not been assigned any models</span>
            <span v-if="$route.path.includes('order')">There are no models for this order</span>
            <span v-if="account.usertype!='Modeller' && !$route.path.includes('order')">
                Modeller has not been assigned any models
            </span>  
        </div>
    </div>
</template>

<script>
import backend from "../backend";
// import barchart from "./BarChart";

export default {
    props: {
        account: { required: true, type: Object },
        models: { required: true, type: Object}
    },
    // components: {
    //     barchart
    // },

    data() {
        return {
            /* Added 'sortable: false' to ID and Products columns, as we probably do not
            need to sort these attributes and it frees up space in the table */
            headers: [
                { text: "", sortable: false, value: "thumb"},
                { text: "ID", sortable: false, value: "modelid" },
                { text: "Name", value: "modelname" },
                { text: "Client", value: "client", hideClient: true},
                { text: "Modeller", value: "modelowner", hideClient: true, hideModeller: true},
                { text: "Status", value: "state" },
                { text: "Products", sortable: false, value: "products" },
                // { text: "Product states", value: "partitiondata" }
            ],
            filters: {},
            name: "",
            search: "",
            backend: backend,
            menuOpen: false,
            selectedRow: 0
            // order: false,
            // models: {},
        };
    },
    methods: {
        sumProducts(item) {
            var sum = 0;
            var states = Object.values(item.partitiondata);
            states.forEach(state => {
                sum += parseInt(state.count);
            });
            return sum;
        },
        handleClick(modelid) {
            this.$emit('clicked-model', modelid)  
            /* instead of pushing a route, use the id as a prop to populate OrderView component */        
            // this.$router.push("/model/" + model.modelid);
        },
        rowSelect(index) {
            this.selectedRow = index;
        },
        searchFor(filter) {
            if (this.search!=='' && this.search!==null) {
                if(!this.search.includes(filter)) {
                    return this.search += ' ' + filter + ' '  
                }
                else { return this.search }
            }
            else { 
                this.search = '';
                return this.search += ' ' + filter + ' '
            }
            
        }
    },
    computed: {
        filteredHeaders() {
            if(this.account.usertype == 'Client') {
                return this.headers.filter(header => header.hideClient != true);
            }
            else if(this.account.usertype == 'Modeller') {
                return this.headers.filter(header => header.hideModeller != true);
            }
            return this.headers
        },
        items() {
            // Create an items array to use as data in the table 
            // so that "value" in the headers matches exactly the table data;
            // this makes "search" work properly
            var account = this.account.usertype
            return Object.values(this.models).map(model => (
                {
                    modelid: model.modelid,
                    modelname: model.modelname,
                    client: model.client,
                    modelowner: model.modelowner,
                    state: backend.messageFromStatus(model.state, account),
                    products: this.sumProducts(model)
                }
            ))
        }
        },
        //custom filtering function instead of :search="search" in v-data-table
        //to allow more freedom in filtering results:
        
        //    filteredItems() { 
        //     if (!this.search) {
        //         /* Initial code in v-data-table: :items="Object.values(models)" */
        //         return this.items
        //     }
        //     else {
        //         var items = []
        //         Object.entries(this.models).forEach(model => {
        //             Object.values(model).forEach(item => {
        //                 if (this.search.includes(this.filters[item.state])) {
        //                     items.push(item)
        //                 }
        //             })
                    
        //         });

        //         return items
        //     }
        // }
    mounted() {
        var vm = this;
        if (vm.account.usertype != "Client") {
            // Changed the filter key to match the filter text
            // Also changed the text to match exactly what is in the table
            vm.filters["Information missing"] = "Information missing";
            vm.filters["Client information missing"] = "Client information missing";
            vm.filters["QA review"] = "QA review";
            vm.filters["Unassigned"] = "Unassigned";

            // vm.filters["ProductMissing"] = "Missing information";
            // vm.filters["ProductQAMissing"] = "Missing client information";
            // vm.filters["ProductReview"] = "Awaiting review";
            
        } else {
            // Changed the filter key to match the filter text
            // Also changed the text to match exactly what is in the table
            vm.filters["Information missing"] = "Information missing";
            vm.filters["Under development"] = "Under development";
            vm.filters["Under review"] = "Under review";

            // vm.filters["ProductQAMissing"] = "Missing information";
            // vm.filters["ClientProductReceived"] = "Awaiting review";
        }

    /* Moved to parent component (ModelOverview) */
    //     if (vm.$route.path.includes("/modeller/")) {
    //         var id = vm.$route.params.id;
    //         backend.getModellerModels(id).then(models => {
    //             vm.models = models;
    //         });
    //     } else if (vm.$route.path == "/admin/models") {
    //         backend.getAllModels().then(models => {
    //             vm.models = models;
    //         });
    //     } else {
    //         vm.order = vm.$route.params.id;
    //         backend.getModels(vm.order).then(models => {
    //             vm.models = models;
    //         });
    //     }
    // }
    }
};
</script>

<style lang="scss" scoped>
#topRow {
    // justify-content: center;
    margin-bottom: 10px;
    // to display the arrow on the left of the component, and title in the center:
    .arrowBack {
        width: 40%;
        justify-content: start
    }
    h2 {
        width: 60%;
    }
}
#table {
    max-height: 100vh;
    // max-height: 70vh;
    overflow: auto;
    // width: 80vw;
    width: 50vw; // to fit both order list and order details
}

.thumbnail {
    max-width: 50px;
}
th {
    text-align: start;
}

.filter {
    margin-bottom: 15px;
}
.filterbutton {
    margin-left: 10px;
}

.flexrow#filtering {
    align-items: center;
}

.modelsList {
    margin-right: 1em;
    padding-right: 1em;
    border-right: 2px solid rgb(179, 179, 179);
}

.highlightedRow {
    background-color: rgba(31, 177, 169, 0.1);
}

div.emptyState {
    height: 170px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #515151;
}

</style>