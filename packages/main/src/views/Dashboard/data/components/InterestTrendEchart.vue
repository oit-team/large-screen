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
  name: 'InterestTrend',
  props: {
    infoList: Array,
  },
  computed: {
    xList() {
      const list = this.infoList
      return list ? [...list].map(item => item.time) : []
    },
    yList() {
      const list = this.infoList
      return list ? [...list].map(item => item.value) : []
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
    const chartDom = this.$refs.interestRef
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
  <div ref="interestRef" class="w-full min-h-30" style="height: 300px" />
</template>

<style lang='scss' scoped>

</style>
