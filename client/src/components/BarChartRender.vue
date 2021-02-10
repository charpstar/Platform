<script>
import { Bar } from 'vue-chartjs'

//This component renders the bar graph canvas with data passed from the parent element
export default {
  extends: Bar,
  props: ['bardata', 'baroptions'],
  mounted () {
    this.renderChart(this.bardata, this.baroptions)
  }
}
</script>
