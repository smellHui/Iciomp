<template>
  <div id="TypesPie" style="width:350px;height:300px"></div>
</template>

<script>
export default {
  name: 'TypesPie',
  props: {
    title: {type: String, default () { return '营销事件分类统计' }},
    subTitle: {
      type: String,
      default () {
        let now = new Date().getTime()
        return new Date(now - 24 * 60 * 60 * 1000).format('yyyy年MM月dd日')
      }
    },
    pieData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      themes: ['dark', 'infographic', 'macarons', 'roma', 'shine', 'vintage'],
      pie: null,
      option: {
        // backgroundColor: '#f8f8f8',
        title: {
          text: '标题',
          subtext: '副标题',
          left: 'center',
          top: 20,
          textStyle: {color: '#2d8cf0'},
          subtextStyle: {color: '#5cadff'}
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} ：{c} （{d}%）'
        },
        visualMap: {
          show: false,
          min: 0,
          max: 500,
          inRange: {
            colorLightness: [0.2, 0.8]
          }
        },
        series: [{
          name: '营销事件名称',
          type: 'pie',
          radius: '65%',
          center: ['50%', '60%'],
          data: [
            {value: 486, name: 'rose1'},
            {value: 310, name: 'rose2'},
            {value: 174, name: 'rose3'},
            {value: 235, name: 'rose4'},
            {value: 400, name: 'rose5'}
          ].sort(function (a, b) { return a.value - b.value }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {color: 'rgba(80, 80, 255, 0.6)'},
              formatter: (param) => {
                let newText = ''
                let len = 0
                let pattern = /^[\u4E00-\u9FA5]$/
                for (let i = 0, l = param.name.length; i < l; i++) {
                  let char = param.name.substr(i, 1)
                  newText += char
                  len++
                  if (pattern.test(char)) {
                    len++
                  }
                  if (len >= 10) {
                    newText += '\n'
                    len = 0
                  }
                }
                return newText
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {color: 'rgba(80, 80, 255, 0.6)'},
              smooth: 0.2,
              length: 5,
              length2: 10
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200
          }
        }]
      }
    }
  },
  mounted () {
    this.pie = this.$echarts.init(document.getElementById('TypesPie'), this.themes[1])
  },
  watch: {
    pieData () {
      if (this.pieData.length < 1) {
        return
      }
      let max = 0
      for (let i = 0; i < this.pieData.length; i++) {
        if (this.pieData[i].value > max) {
          max = this.pieData[i].value
        }
      }
      max = Math.ceil(max / 1000) * 1000
      this.pie.setOption(this.option)
      this.pie.setOption({
        title: {
          text: this.title,
          subtext: this.subTitle
        },
        visualMap: {
          max: max
        },
        series: [
          {data: this.pieData}
        ]
      })
    }
  }
}
</script>
