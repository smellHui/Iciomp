<template>
  <div class="dashboard" :style="{background: color, borderColor: color}">
    <div class="title">{{title}}</div>
    <div class="content">
      <span class="valueText" :style="{color: color}">{{value}}</span><span class="unit">{{unit}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {}
  },
  props: {
    title: {type: String, default () { return '标题' }},
    value: {type: Number, default () { return 88.88 }},
    unit: {type: String, default () { return '%' }},
    color: {type: String, default () { return '#2d8cf0' }}
  }
}
</script>
<style scoped>
.dashboard {
  width: 240px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-width: 1px;
  border-style: solid;
  margin: 15px;
  cursor: default;
}
.title {
  line-height: 40px;
  height: 40px;
  color: #ffffff;
  font-size: 16px
}
.content {
  height: 80px;
  background: #f8f8f9;
  line-height:80px;
}
.valueText {
  font-size: 36px
}
.unit {
  font-size: 16px;
  margin-left: 5px;
  color: #515a6e
}
</style>
