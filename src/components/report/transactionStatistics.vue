<template>
  <div class="wrapper">
    <Row class="row">
      <i-col span="3" class="label">营销起始时间：</i-col>
      <i-col span="7">
        <DatePicker size="small" style="width:260px;" type="date" placeholder="请选择开始营销时间" :value="searchInfo.startDate" format="yyyy-MM-dd" @on-change="(val)=>{this.searchInfo.startDate=val;}"/>
      </i-col>
      <i-col span="3" class="label">营销终止时间：</i-col>
      <i-col span="11">
        <DatePicker size="small" style="width:260px;" type="date" placeholder="请选择终止营销时间" :value="searchInfo.endDate" format="yyyy-MM-dd" @on-change="(val)=>{this.searchInfo.endDate=val;}"/>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">业务办理起始时间：</i-col>
      <i-col span="7">
        <DatePicker size="small" style="width:260px;" type="date" placeholder="请选择业务办理开始时间" :value="searchInfo.startDate1" format="yyyy-MM-dd" @on-change="(val)=>{this.searchInfo.startDate1=val;}"/>
      </i-col>
      <i-col span="3" class="label">业务办理终止时间：</i-col>
      <i-col span="11">
        <DatePicker size="small" style="width:260px;" type="date" placeholder="请选择业务办理终止时间" :value="searchInfo.endDate1" format="yyyy-MM-dd" @on-change="(val)=>{this.searchInfo.endDate1=val;}"/>
      </i-col>
    </Row>
    <Row style="height:50px;line-height:50px;">
      <i-col span="7" style="text-align:center">
        <Button icon="ios-grid" type="primary" shape="circle" size="small" @click.native="getData">报表查询</Button>
        <Button style="margin-left:30px" icon="ios-download" type="info" shape="circle" size="small" @click.native="exportData">导出报表</Button>
      </i-col>
    </Row>
    <Divider><span class="title">业 务 办 理 统 计 详 情</span></Divider>
    <Row class="row">
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
  name: 'TransactionStatistics',
  data () {
    return {
      // 查询参数数据绑定
      searchInfo: {
        startDate: (new Date((new Date()).setDate(1))).format('yyyy-MM-dd'),
        endDate: (new Date()).format('yyyy-MM-dd'),
        startDate1: (new Date((new Date()).setDate(1))).format('yyyy-MM-dd'),
        endDate1: (new Date()).format('yyyy-MM-dd')
      },
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 1000,
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
        {type: 'text', title: '策略名称', key: 'stragegyName', sortable: true, align: 'center'},
        {type: 'text', title: '产品名称', key: 'productName', sortable: true, align: 'center'},
        {type: 'text', title: '办理量', key: 'value', sortable: true, align: 'center'}
      ]
    }
  },
  mounted () {
    // this.getData()
  },
  methods: {
    // 获取当前页列表数据
    getData () {
      if (this.searchInfo.startDate !== null && this.searchInfo.startDate !== '' &&
        this.searchInfo.endDate !== null && this.searchInfo.endDate !== '') {
        let s = new Date(this.searchInfo.startDate)
        let e = new Date(this.searchInfo.endDate)
        if (s > e) {
          this.$Message.warning({duration: 5, content: '起始营销时间不能大于终止营销时间！'})
          return
        }
        if (s.getFullYear() !== e.getFullYear() || s.getMonth() !== e.getMonth()) {
          this.$Message.warning({duration: 5, content: '起止营销时间不能跨月！'})
          return
        }
      }
      if (this.searchInfo.startDate1 !== null && this.searchInfo.startDate1 !== '' &&
        this.searchInfo.endDate1 !== null && this.searchInfo.endDate1 !== '') {
        let s = new Date(this.searchInfo.startDate1)
        let e = new Date(this.searchInfo.endDate1)
        if (s > e) {
          this.$Message.warning({duration: 5, content: '起始业务办理时间不能大于终止业务办理时间！'})
          return
        }
        if (s.getFullYear() !== e.getFullYear() || s.getMonth() !== e.getMonth()) {
          this.$Message.warning({duration: 5, content: '起止业务办理时间不能跨月！'})
          return
        }
      }
      this.$httpReq('/report/transactionStatistics', {page: this.page, search: this.searchInfo}, 'post', (res) => {
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
        filename: '业务办理详情_' + new Date().format('yyyyMMddhhmmss')
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
.row {
  height: 30px;
  line-height: 30px;
  text-align: left
}
.label {
  text-align: right;
  padding-right: 15px;
}
</style>
