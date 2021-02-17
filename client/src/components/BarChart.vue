<template>
   <div class="chart">
        <bar-chart-render
            :chart-data="barData"
            :options="barOptions"
            :plugins="plugins"
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
            //instead of array with static data, we can have functions to get right icon from backend
            //similar to how we get message and colors for bars
            // images : ['https://i.stack.imgur.com/2RAv2.png', 'https://i.stack.imgur.com/Tq5DA.png', 'https://i.stack.imgur.com/3KRtW.png', 'https://i.stack.imgur.com/iLyVi.png'],

            /* Commented code in colors means the colors previously used for the bar chart */
            colors: {
                ProductInit: "grey", //maybe different color?
                ProductReceived: "#868686",
                ProductDev: "#7FCB7F",
                ProductMissing: "#EC4E4E",
                ProductQAMissing: "#A33636",
                ProductReview: "#4A754A",
                ProductRefine: "#FFA500",
                ClientProductReceived: "#744885",
                ClientFeedback: "#1DA19A",
                Done: "#188038",
                Error: "red"
                // ProductReceived: "grey",
                // ProductDev: "#0e6ab5",
                // ProductMissing: "#c91463",
                // ProductQAMissing: "#ad239b",
                // ProductReview: "#1496c9",
                // ProductRefine: "#0e6ab5",
                // ClientProductReceived: "#37db4d",
                // ClientFeedback: "#0e6ab5",
                // Done: "green"

            },
            clientcolors: {
                ProductInit: "grey",
                ProductReceived: "#FFA500",
                ProductDev: "#7FCB7F",
                ProductMissing: "#7FCB7F",
                ProductQAMissing: "#EC4E4E",
                ProductReview: "#7FCB7F",
                ProductRefine: "#7FCB7F",
                ClientProductReceived: "#60106E",
                ClientFeedback: "#1DA19A",
                Done: "#188038",
                Error: "red"
                // ProductReceived: "grey",
                // ProductDev: "#0e6ab5",
                // ProductMissing: "#0e6ab5",
                // ProductQAMissing: "#ad239b",
                // ProductReview: "#0e6ab5",
                // ProductRefine: "#0e6ab5",
                // ClientProductReceived: "#37db4d",
                // ClientFeedback: "#0e6ab5",
                // Done: "green"
            },

            //icons sources first for admin, then for client
            baricons: {
                ProductInit: '',
                ProductReceived: require('@/assets/bar-icons/unassigned.png'),
                ProductDev: require('@/assets/bar-icons/under-development.png'),
                ProductMissing: require('@/assets/bar-icons/information-missing.png'),
                ProductQAMissing: "",
                ProductReview: "",
                ProductRefine: require('@/assets/bar-icons/review-revision.png'),
                ClientProductReceived: "",
                ClientFeedback: "",
                Done: require('@/assets/bar-icons/complete.png'),
                Error: ""

            },
            clientbaricons:{
                ProductInit: "",
                ProductReceived: require('@/assets/bar-icons/review-revision.png'),
                ProductDev: require('@/assets/bar-icons/under-development.png'),
                ProductMissing: require('@/assets/bar-icons/under-development.png'),
                ProductQAMissing: require('@/assets/bar-icons/information-missing.png'),
                ProductReview: require('@/assets/bar-icons/under-development.png'),
                ProductRefine: require('@/assets/bar-icons/under-development.png'),
                ClientProductReceived: "",
                ClientFeedback: "",
                Done: require('@/assets/bar-icons/complete.png'),
                Error: ""
            },
        };
    },
    
    computed: {

        //options configuration for bar graph
        barOptions() {
            var optionsObj = {
                legend: {
                    display: false
                },
                layout: {
                    //give some padding to bottom in order to get the whole icons
                    padding: {
                        bottom: 10
                    }
                },

                //"responsive" requires container graph component to be relatively positioned
                //and relative (width, height) values for the container size
                responsive: true,
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,
                        }
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
                    //custom tooltip
                    callbacks: {

                        //title is the appropriate message from backend
                        title: (tooltipItems) =>{
                            var tooltipItem = tooltipItems[0];
                            return this.statusMessage[tooltipItem.index]
                        },

                        label: (tooltipItem) =>{
                            let totalProducts = this.total;
                            return tooltipItem.yLabel + ' / ' + totalProducts;
                        }
                    }
                },
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
            
            //create an array with the same number of items as the product states
            //this way we don't get text as labels, only icons
            for (let i=0; i<this.orderedStates.length ; i++) {dataObj.labels[i] = ''}

            dataObj.datasets[0].data = this.orderedStates.map(state => state.count)

            //dynamically set colors for each bar
            dataObj.datasets[0].backgroundColor = this.orderedStates.map(state => this.colorFromAccount(state.stateafter))

            return dataObj
        },

        orderedStates() {
            //sort the states to always get them in the same order and with correct data
            return Object.values(this.productdata).sort(this.stateSort)
        },
        
        plugins() {
            /* This plugin code lets us insert an image in place of label on xAxis */

            //plugin code from
            //https://stackoverflow.com/questions/30247579/how-to-add-an-images-as-labels-to-canvas-charts-using-chart-js
            var pluginsArray= [{
                afterDraw: chart => {
                    var ctx = chart.chart.ctx;
                    var xAxis = chart.scales['x-axis-0'];
                    var yAxis = chart.scales['y-axis-0'];
                    xAxis.ticks.forEach((value, index) => {
                        var x = xAxis.getPixelForTick(index);
                        var image = new Image();

                        //images will need to be saved in a folder in our project;
                        //can't be vuetify icons using mdi-...
                        var images = this.orderedStates.map(state => this.iconFromAccount(state.stateafter));
                        image.src = images[index];
                        ctx.drawImage(image, x - 12, yAxis.bottom + 10);
                    });
                }
            }]

            return pluginsArray
        },

        statusMessage() {
            //display as tooltip title in bar graph
            return this.orderedStates.map(state => 
                backend.messageFromStatus(state.stateafter, this.account.usertype)
            )
        },

        total() {
            var sum = 0;
            Object.values(this.productdata).forEach(state => {
                sum += parseInt(state.count);
            })

            return sum
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

        iconFromAccount(state) {
            if(this.account.usertype == 'Client') {
                return this.clientbaricons[state]
            }
            return this.baricons[state]
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