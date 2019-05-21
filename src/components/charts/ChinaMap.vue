<template>
  <div id="chinaMap" style="height:450px"></div>
</template>

<script>
/* eslint-disable no-unused-vars */
import map from 'echarts/map/js/china'
export default {
  name: 'ChinaMap',
  data () {
    return {
      themes: ['dark', 'infographic', 'macarons', 'roma', 'shine', 'vintage']
    }
  },
  props: {
    mapTitle: {
      type: String,
      default () {
        return '全国iphone销量'
      }
    },
    mapSubtitle: {
      type: String,
      default () {
        return '(纯属虚构)'
      }
    },
    mapData: {
      type: Array,
      default () {
        return [
          {name: '北京', value: Math.round(Math.random() * 1000)},
          {name: '天津', value: Math.round(Math.random() * 1000)},
          {name: '上海', value: Math.round(Math.random() * 1000)},
          {name: '重庆', value: Math.round(Math.random() * 1000)},
          {name: '河北', value: Math.round(Math.random() * 1000)},
          {name: '河南', value: Math.round(Math.random() * 1000)},
          {name: '云南', value: Math.round(Math.random() * 1000)},
          {name: '辽宁', value: Math.round(Math.random() * 1000)},
          {name: '黑龙江', value: Math.round(Math.random() * 1000)},
          {name: '湖南', value: Math.round(Math.random() * 1000)},
          {name: '安徽', value: Math.round(Math.random() * 1000)},
          {name: '山东', value: Math.round(Math.random() * 1000)},
          {name: '新疆', value: Math.round(Math.random() * 1000)},
          {name: '江苏', value: Math.round(Math.random() * 1000)},
          {name: '浙江', value: Math.round(Math.random() * 1000)},
          {name: '江西', value: Math.round(Math.random() * 1000)},
          {name: '湖北', value: Math.round(Math.random() * 1000)},
          {name: '广西', value: Math.round(Math.random() * 1000)},
          {name: '甘肃', value: Math.round(Math.random() * 1000)},
          {name: '山西', value: Math.round(Math.random() * 1000)},
          {name: '内蒙古', value: Math.round(Math.random() * 1000)},
          {name: '陕西', value: Math.round(Math.random() * 1000)},
          {name: '吉林', value: Math.round(Math.random() * 1000)},
          {name: '福建', value: Math.round(Math.random() * 1000)},
          {name: '贵州', value: Math.round(Math.random() * 1000)},
          {name: '广东', value: Math.round(Math.random() * 1000)},
          {name: '青海', value: Math.round(Math.random() * 1000)},
          {name: '西藏', value: Math.round(Math.random() * 1000)},
          {name: '四川', value: Math.round(Math.random() * 1000)},
          {name: '宁夏', value: Math.round(Math.random() * 1000)},
          {name: '海南', value: Math.round(Math.random() * 1000)},
          {name: '台湾', value: Math.round(Math.random() * 1000)},
          {name: '香港', value: Math.round(Math.random() * 1000)},
          {name: '澳门', value: Math.round(Math.random() * 1000)}
        ]
      }
    }
  },
  mounted () {
    this.drawChinaMap()
  },
  methods: {
    drawChinaMap () {
      let chart = this.$echarts.init(document.getElementById('chinaMap'), this.themes[5])
      let option = {
        title: {
          text: this.mapTitle,
          subtext: this.mapSubtitle,
          x: 'center'
        },
        tooltip: {trigger: 'item'},
        legend: {orient: 'vertical', x: 'left', data: ['iphoneX']},
        dataRange: {min: 0, max: 1500, x: 'left', y: 'bottom', text: ['高', '低'], calculable: true},
        toolbox: {
          show: true,
          orient: 'vertical',
          x: 'right',
          y: 'top',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        roamController: {
          show: true,
          x: 'right',
          mapTypeControl: {'china': true}
        },
        series: [{
          name: 'iphoneX',
          type: 'map',
          mapType: 'china',
          roam: true,
          itemStyle: {
            normal: {label: {show: true}},
            emphasis: {label: {show: true}}
          },
          data: this.mapData
        }]
      }
      chart.setOption(option)
    }
  }
}
</script>
