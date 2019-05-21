<template>
  <div>
    <div id="bar" style="width:620px;height:300px"></div>
  </div>
</template>

<script>
export default {
  name: 'Bar',
  props: {
    barData: {type: Array, default () { return [] }}
  },
  data () {
    return {
      themes: ['dark', 'infographic', 'macarons', 'roma', 'shine', 'vintage'],
      bar: null,
      option: {
        title: {
          text: '标题',
          subtext: '副标题',
          left: 'center',
          top: 20,
          textStyle: {color: '#2d8cf0'},
          subtextStyle: {color: '#5cadff'}
        },
        grid: {
          left: 70,
          top: 75,
          right: 30,
          bottom: 20
        },
        xAxis: {
          // data: dataAxis,
          type: 'category',
          axisLabel: {
            inside: false,
            textStyle: {color: '#999'},
            formatter: (value, index) => {
              return new Date(value).format('MM-dd')
            }
          },
          axisTick: {show: false},
          axisLine: {show: false},
          z: 10
        },
        yAxis: {
          axisLine: {show: false},
          axisTick: {show: false},
          axisLabel: {
            textStyle: {color: '#999'}
          }
        },
        dataZoom: [
          {type: 'inside'}
        ],
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let text = new Date(params.name).format('yyyy年MM月dd日')
            if (params.seriesIndex === 1) {
              text = '日营销事件量<br/>' + text + '：'
              text += params.value[1] ? params.value[1] + '件' : '无数据'
            }
            return text
          }
        },
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              normal: {color: 'rgba(0,0,0,0.05)'}
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: [],
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                  [
                    {offset: 0, color: '#83bff6'},
                    {offset: 0.5, color: '#188df0'},
                    {offset: 1, color: '#188df0'}
                  ]
                )
              },
              emphasis: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,
                  [
                    {offset: 0, color: '#2378f7'},
                    {offset: 0.7, color: '#2378f7'},
                    {offset: 1, color: '#83bff6'}
                  ]
                )
              }
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.bar = this.$echarts.init(document.getElementById('bar'), this.themes[1])
    let zoomSize = 6
    this.bar.on('click', (params) => {
      this.bar.dispatchAction({
        type: 'dataZoom',
        startValue: Math.max(params.dataIndex - zoomSize / 2, 0),
        endValue: Math.min(params.dataIndex + zoomSize / 2, this.barData.length - 1)
      })
    })
  },
  watch: {
    barData () {
      if (this.barData.length < 1) {
        return
      }
      let dataShadow = []
      let yMax = 0
      for (let i = 0; i < this.barData.length; i++) {
        if (this.barData[i][1] > yMax) {
          yMax = this.barData[i][1]
        }
      }
      yMax = Math.ceil(yMax / 500000) * 500000
      for (let i = 0; i < this.barData.length; i++) {
        dataShadow.push(yMax)
      }
      this.bar.setOption(this.option)
      this.bar.setOption({
        title: {
          text: '最近30天营销事件统计',
          subtext: new Date(this.barData[0][0]).format('yyyy年MM月dd日') + '至' + new Date(this.barData[29][0]).format('yyyy年MM月dd日')
        },
        series: [
          {data: dataShadow},
          {
            type: 'bar',
            data: this.barData
          }
        ]
      })
    }
  }
}
</script>
