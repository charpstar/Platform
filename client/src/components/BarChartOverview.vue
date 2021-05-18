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
        stepSize() { //calculate the yAxis steps/ticks
            if (this.productData.assigned > 50) {return 10}
            else if (50 > this.productData.assigned > 10) {return 5}
            else {return 1}
        },
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
                            stepSize: this.stepSize, 
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

            dataObj.labels = Object.keys(this.productData).map(p => p)
            dataObj.datasets[0].data = Object.values(this.productData).map(p => p)

            dataObj.datasets[0].backgroundColor = ['#868686', '#7FCB7F', '#744885']

            return dataObj
        }
    }
}
</script>

<style lang="scss" scoped>
    .bar-graph {
        position: relative;
        width: 90%
    }
</style>

