<template>
<!-- This bar chart is used for QA overview and Modellers overview -->
    <div class="bar-graph">
        <bar-chart-render 
            :chart-data="barData"
            :options="barOptions"
            :height="300"
        />
    </div>
</template>

<script>
import BarChartRender from './BarChartRender.vue';
export default {
    components: { BarChartRender },
    props: {
        productData: {type: Object}
    },
    computed: {
        //options configuration for bar graph
        barOptions() {
            var optionsObj = {
                legend: {
                    display: false
                },
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
                            labelString: 'Products',
                            fontFamily: "Montserrat, sans-serif"
                        },
                        ticks: {
                            min: 0,
                            stepSize: this.productData.assigned > 50 ? 10 : 5, 
                            fontFamily: "Montserrat, sans-serif"
                        },
                    }],
                }
            }
            return optionsObj
        },

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
            // for (let i=0; i<this.orderedstates.length ; i++) {dataObj.labels[i] = ''}
            dataObj.labels = Object.keys(this.productData).map(p => p)
            dataObj.datasets[0].data = Object.values(this.productData).map(p => p)

            // //dynamically set colors for each bar
            // dataObj.datasets[0].backgroundColor = this.orderedstates.map(state => backend.colorFromAccount(state.stateafter, this.account.usertype))

            return dataObj
        },
    }
}
</script>

<style lang="scss" scoped>
    .bar-graph {
        position: relative;
        width: 90%
    }
</style>

