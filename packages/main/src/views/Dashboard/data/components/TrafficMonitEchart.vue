<script>
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
])

export default {
  name: 'TrafficMonitEchart',
  props: {
    info: Object,
  },
  computed: {
    xList() {
      const list = this.info.xList
      return list ? [...list].reverse() : []
    },
    yList() {
      const list = this.info.yList
      return list ? [...list].reverse() : []
    },
    option() {
      return {
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 },
          data: this.xList,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.yList,
            type: 'line',
            label: {
              show: true,
              position: 'top',
            },
          },
        ],
        grid: {
          top: '30px',
          left: '30px',
          right: '30px',
          bottom: '30px',
        },
      }
    },
  },
  watch: {
    option: {
      deep: true,
      handler() {
        this.initChartData()
      },
    },
  },
  mounted() {
    const chartDom = this.$refs.trafficRef
    this.myChart = echarts.init(chartDom)
  },
  methods: {
    initChartData() {
      this.option && this.myChart.setOption(this.option)
    },
  },
}
</script>

<template>
  <div ref="trafficRef" class="w-full min-h-50" style="height: 300px" />
</template>

<style lang='scss' scoped>

</style>
