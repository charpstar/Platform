<template>
    <div class="chart">
        <bar-chart-render 
            :chart-data="barData" 
            :options="barOptions"
            />
        <!-- Previous code for creating a progress bar -->

        <!-- <v-tooltip bottom v-for="bar in chartBars" :key="bar.state">
            <template v-slot:activator="{ on }">
                <div v-on="on" class="chartbar" :style="{width: bar.size + '%', 'background-color': bar.color}"></div>
            </template>
            <span>{{bar.message}} {{bar.count}} / {{total}}</span>
        </v-tooltip> -->
    </div>
</template>

<script>
import backend from '../backend'
import BarChartRender from './BarChartRender.vue';

export default {
  components: { BarChartRender },
    props: {
        productdata: {type: Object, required: true},
        account: {type: Object, required: true},
        status: {type: String, required: false}
    },
    data() {
        return {
            colors: {
                ProductInit: "grey",
                ProductReceived: "grey",
                ProductDev: "#0e6ab5",
                ProductMissing: "#c91463",
                ProductQAMissing: "#ad239b",
                ProductReview: "#1496c9",
                ProductRefine: "#0e6ab5",
                ClientProductReceived: "#37db4d",
                ClientFeedback: "#0e6ab5",
                Done: "green",
                Error: "red"
            },
            clientcolors: {
                ProductInit: "grey",
                ProductReceived: "grey",
                ProductDev: "#0e6ab5",
                ProductMissing: "#0e6ab5",
                ProductQAMissing: "#ad239b",
                ProductReview: "#0e6ab5",
                ProductRefine: "#0e6ab5",
                ClientProductReceived: "#37db4d",
                ClientFeedback: "#0e6ab5",
                Done: "green",
                Error: "red"
            }
        };
    },
    computed: {
        total() {
            var sum = 0;
            Object.values(this.productdata).forEach(state => {
                sum += parseInt(state.count);
            })
            
            return sum
        },

        //options configuration for bar graph
        barOptions() {
            var optionsObj = {
                    legend: {
                        display: false
                    },

                //"responsive" requires container graph component to be relatively positioned
                //and relative (width, height) values for the container size  
                responsive: true, 
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,
                        },
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            fontSize: 16, //default is 12, kind of small
                            labelString: 'Products'
                        },
                        ticks: { 
                            min: 0,
                            max: this.total,
                            stepSize: 1 //scale up by 1 on y-axis; shows only integers
                        },
                    }],  
                },
                title: {
                    display: true,
                    fontSize: 16, //default is 12, kind of small
                    text: `Order status: ${this.status}`
                },
                tooltips: {
                    //If we want the tooltip to show how many products out of total products
                    //are in this category
                    callbacks: {
                        label: (tooltipItems) =>{ 
                            let totalProducts = this.total;
                            return tooltipItems.yLabel + ' / ' + totalProducts;
                        }
                }
                }
            }
            return optionsObj
        },

        //get data for bar graph from backend
        barData() {
            var dataObj = {
                    labels: [],
                    datasets: [{
                        backgroundColor: [],
                        barThickness: 'flex',
                        maxBarThickness: 60,
                        data: []
                    }] 
            }

            var orderedStates = Object.values(this.productdata).sort(this.stateSort)   

            dataObj.labels = orderedStates.map(state => backend.messageFromStatus(state.stateafter, this.account.usertype))
            dataObj.datasets[0].data = orderedStates.map(state => state.count)
            
            //dynamically set colors for each bar
            dataObj.datasets[0].backgroundColor = orderedStates.map(state => this.colorFromAccount(state.stateafter))
            
            return dataObj     
        },

    /* The following code will not be used as long as we are using vue-chartjs library */

        // chartBars() {
        //     var ret = {}
        //     var sum = 0;
        //     var states =  Object.values(this.productdata)
        //     states.forEach(state => {
        //         sum += parseInt(state.count);
        //     })
        //     states.forEach(state => {
        //         var message = backend.messageFromStatus(state.stateafter, this.account.usertype);
        //         if(!ret[message]) {
        //             ret[message] = {
        //                 message: message,
        //                 color: this.colorFromAccount(state.stateafter),
        //                 count: 0,
        //                 state: state.stateafter,
        //             }
        //         }
        //         ret[message].count += parseInt(state.count);
        //     })

        //     ret = Object.values(ret);
        //     ret.forEach(state => {
        //         state.size = (100 / sum) * parseInt(state.count);
        //     })

        //     ret.sort((a,b) => {
        //         if ( a.color < b.color ){
        //             return -1;
        //         }
        //         if ( a.color > b.color ){
        //             return 1;
        //         }
        //         return 0;
        //     });
        //     return ret;
        // }
    },
    methods: {
        colorFromAccount(state) {
            if(this.account.usertype == 'Client') {
                return this.clientcolors[state]
            }
            return this.colors[state]
        },
        stateSort( a, b ) {
            if ( a.stateafter < b.stateafter ){
                return -1;
            }
            if ( a.stateafter > b.stateafter ){
                return 1;
            }
            return 0;
            }
    }
}
</script>

<style lang="scss" scoped>
    .chart {
        position: relative; 
        width: 40vw; //only "vw" works in order to have responsive graph, not "%" 
    }

/* This CSS code is not needed when having a charts library */

//     border-radius: 5px;
//     display: flex;
//     flex-direction: row;
//     overflow: hidden;
// }
// .chartbar {
//     display: block;
//     height: 10px;
// }
</style>