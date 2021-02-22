<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

//This component renders the bar graph canvas with data passed from the parent element
export default {
  extends: Bar,

  //according to vue-chartjs docs, this mixin is necessary to update the chart when data changes
  //if the mixin is used, the props need to be named 'chart-data' and 'options' in parent element
  mixins: [reactiveProp],
  props: ['options'],
 
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
