<template>
   <div class="chart">
        <bar-chart-render
            :chart-data="barData"
            :options="barOptions"
            :plugins="plugins"
            height="300px"
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
        account: {type: Object, required: true},
        status: {type: String, required: false},
        orderedstates: {type: Array, required: true},
        baricons: {type: Object, required: true},
        clientbaricons: {type: Object, required: true},
        total: {type: Number, required: true}
        // productdata: {type: Object, required: true}
    },
    data() {
        return {

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
                Error: "E20000"
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
                ClientProductReceived: "#744885",
                ClientFeedback: "#1DA19A",
                Done: "#188038",
                Error: "E20000"
                // ProductReceived: "grey",
                // ProductDev: "#0e6ab5",
                // ProductMissing: "#0e6ab5",
                // ProductQAMissing: "#ad239b",
                // ProductReview: "#0e6ab5",
                // ProductRefine: "#0e6ab5",
                // ClientProductReceived: "#37db4d",
                // ClientFeedback: "#0e6ab5",
                // Done: "green"
            }
        };
    },
    
    computed: {

        //options configuration for bar graph
        barOptions() {
            var optionsObj = {
                defaultFontFamily: "Montserrat",
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
                        },
                        ticks: {
                            padding: 30
                        }
                    }],
                    yAxes: [{
                        
                        scaleLabel: {
                            display: true,
                            fontSize: 16, //default is 12, kind of small
                            labelString: 'Products',
                            fontFamily: "Montserrat"
                        },
                        ticks: {
                            min: 0,
                            max: this.total,
                            stepSize: 1, //scale up by 1 on y-axis; shows only integers
                            fontFamily: "Montserrat"
                        },
                    }],
                },
                title: {
                    display: true,
                    fontSize: 16, //default is 12, kind of small,
                    fontFamily: "Montserrat",
                    text: `Order status: ${this.status}`
                },
                tooltips: {
                    titleFontFamily: "Montserrat",
                    bodyFontFamily: "Montserrat",
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
            for (let i=0; i<this.orderedstates.length ; i++) {dataObj.labels[i] = ''}

            dataObj.datasets[0].data = this.orderedstates.map(state => state.count)

            //dynamically set colors for each bar
            dataObj.datasets[0].backgroundColor = this.orderedstates.map(state => this.colorFromAccount(state.stateafter))

            return dataObj
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
                        var images = this.orderedstates.map(state => this.iconFromAccount(state.stateafter));
                        image.src = images[index];
                        image.style= 'height: 50px';
                        ctx.drawImage(image, x - 12, yAxis.bottom + 10);
                    });
                }
            }]

            return pluginsArray
        },

        statusMessage() {
            //display as tooltip title in bar graph
            return this.orderedstates.map(state => 
                backend.messageFromStatus(state.stateafter, this.account.usertype)
            )
        },

        // total() {
        //     var sum = 0;
        //     Object.values(this.productdata).forEach(state => {
        //         sum += parseInt(state.count);
        //     })

        //     return sum
        // },

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