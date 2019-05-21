<template>
  <div>
    <Dashboard style="display:inline-block" v-for="(item,key) in dashboards" :key="key"
      :title="item.title"
      :value="item.value"
      :unit="item.unit"
      :color="item.color"/>
    <div style="clear:both;height:5px"></div>
    <TypesPie style="display:inline-block;margin-left:40px" :pieData="pie_Data"/>
    <Bar style="display:inline-block;margin-left:40px" :barData="bar_Data"/>
  </div>
</template>

<script>
import Dashboard from './charts/Dashboard'
import TypesPie from './charts/TypesPie'
import Bar from './charts/Bar'
export default {
  name: 'Home',
  components: {
    Dashboard,
    TypesPie,
    Bar
  },
  data () {
    return {
      msg: '欢迎你，' + this.$store.state.currentUser.nickName + '！您当前登录帐号为：' +
      this.$store.state.currentUser.account + '。',
      themes: ['dark', 'infographic', 'macarons', 'roma', 'shine', 'vintage'],
      dashboards: [
        // {title: '累计触点', value: 12345, unit: '个', color: '#19be6b'},
        // {title: '营销事件', value: 3333, unit: '件', color: '#2b85e4'},
        // {title: '成功营销', value: 245, unit: '例', color: '#ff9900'},
        // {title: '累计接触', value: 12345, unit: '次'}
      ],
      bar_Data: [],
      pie_Data: []
    }
  },
  created () {
    this.$store.commit('setCurrentPage', 'home')
  },
  mounted () {
    this.getBarData()
    this.getPieData()
    this.getDashboardData()
  },
  methods: {
    getBarData () {
      let url = this.$store.state.serviceRoot + '/chart/countMarketingEventByDay' + '?r=' + Math.random()
      this.$Axios.get(url).then((res) => {
        this.bar_Data = res.data
      })
    },
    getPieData () {
      let url = this.$store.state.serviceRoot + '/chart/countMarketingEvents' + '?r=' + Math.random()
      this.$Axios.get(url).then((res) => {
        this.pie_Data = res.data.sort((a, b) => { return a.value - b.value })
      })
    },
    getDashboardData () {
      let url = this.$store.state.serviceRoot + '/chart/dashboard' + '?r=' + Math.random()
      this.$Axios.get(url).then((res) => {
        this.dashboards = res.data
        setTimeout(this.getDashboardData, 60000)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
