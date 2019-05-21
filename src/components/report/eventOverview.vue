<template>
  <div class="wrapper">
    <Row style="height:30px;line-height:30px">
      <i-col span="24">
        <div class="title">事 件 概 览 表</div>
      </i-col>
    </Row>
    <Row style="height:40px;line-height:40px">
      <i-col span="5">&emsp;</i-col>
      <i-col span="14" style="text-align:center">
        <DatePicker size="small" style="width:120px" type="date" placeholder="选择起始日期" :value="searchInfo.startDate" format="yyyy-MM-dd" @on-change="(val)=>{this.searchInfo.startDate=val;this.getData()}"/>
         至 <DatePicker size="small" style="width:120px" type="date" placeholder="选择终止日期" :value="searchInfo.endDate" format="yyyy-MM-dd" @on-change="(val)=>{this.searchInfo.endDate=val;this.getData()}"/>
      </i-col>
      <i-col span="5" style="padding-right:8px;text-align:right">
        <!-- <Button icon="ios-grid" type="primary" shape="circle" size="small" @click.native="getData">报表查询</Button>&emsp; -->
        <Button icon="ios-download" type="info" shape="circle" size="small" @click.native="exportData">导出报表</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="24">
        <Table size="small" ref="tabDataList" :columns="columns" :data="rowList" border stripe></Table>
      </i-col>
    </Row>
    <!-- 分页组件 -->
    <Row style="height:40px;line-height:40px;text-align:left">
      <i-col span="24">
        <Page :total="page.totalRecord"
          :page-size="page.size"
          :page-size-opts="pageOption"
          :current="page.currentNum"
          @on-change="pageChange"
          @on-page-size-change="sizeChange"
          show-sizer show-elevator/>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'EventOverview',
  data () {
    return {
      // 查询参数数据绑定
      searchInfo: {
        startDate: (new Date((new Date()).setDate(1))).format('yyyy-MM-dd'),
        endDate: (new Date()).format('yyyy-MM-dd')
      },
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 20,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100, 1000],
      // 报表当前页数据项列表数据
      rowList: [],
      // 报表栏目定义
      columns: [
        {type: 'index', title: '序号', align: 'center', width: 70},
        {type: 'text', title: '事件名称', key: 'eventName', sortable: true, align: 'center'},
        {type: 'text', title: '上行总量', key: 'upCount', sortable: true, align: 'center'},
        {type: 'text', title: '下行总量', key: 'downCount', sortable: true, align: 'center'},
        {type: 'text', title: '触发率(%)', key: 'percent', sortable: true, align: 'center'}
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/report/eventOverview', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
      })
    },
    // 页码改变时触发
    pageChange (page) {
      this.page.currentNum = page
      this.getData()
    },
    // 每页显示条数改变时触发
    sizeChange (size) {
      this.page.size = size
      this.getData()
    },
    // 报表导出Csv文件
    exportData () {
      this.$refs.tabDataList.exportCsv({
        filename: '事件概览_' + new Date().format('yyyyMMddhhmmss')
      })
    }
  }
}
</script>
<style scoped>
.wrapper {
  background: #ffffff;
  margin: 5px;
  padding: 5xp;
}
.title {
  font-size: 24px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  color: #657180
}
</style>
