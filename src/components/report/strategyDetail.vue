<template>
  <div class="wrapper">
    <Row style="height:30px;line-height:30px">
      <i-col span="24">
        <div class="title">策 略 详 情 统 计 表</div>
      </i-col>
    </Row>
    <Row style="height:40px;line-height:40px">
      <i-col span="4" style="padding:0 8px;text-align:left">
        <Select size="small" clearable filterable placeholder="请选择事件名称" v-model="searchInfo.eventName" @on-change="getData">
          <Option v-for="(item,key) in eventNames" :key="key" :value="item.EVENT_ID">{{item.EVENT_NAME}}</Option>
        </Select>
      </i-col>
      <i-col span="4" style="padding:0 8px;text-align:left">
        <Select size="small" clearable filterable placeholder="请选择策略名称" v-model="searchInfo.strategyName" @on-change="getData">
          <Option v-for="(item,key) in strategyNames" :key="key" :value="item.STRA_ID">{{item.STRA_NAME}}</Option>
        </Select>
      </i-col>
      <i-col span="4" style="padding:0 8px;text-align:left">
        <Select size="small" clearable filterable placeholder="请选择产品类别" v-model="searchInfo.productType" @on-change="getData">
          <Option v-for="(item,key) in productTypes" :key="key" :value="item.PTID">{{item.TYPENAME}}</Option>
        </Select>
      </i-col>
      <i-col span="7">
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
  name: 'StrategyDetail',
  data () {
    return {
      // 查询参数数据绑定
      searchInfo: {
        startDate: (new Date((new Date()).setDate(1))).format('yyyy-MM-dd'),
        endDate: (new Date()).format('yyyy-MM-dd'),
        eventName: '',
        strategyName: '',
        productType: ''
      },
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 20,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100, 20000],
      // 报表当前页数据项列表数据
      rowList: [],
      // 事件名称选项数组
      eventNames: [],
      // 策略名称选项数组
      strategyNames: [],
      // 产品类别选项数组
      productTypes: [],
      // 报表栏目定义
      columns: [
        {type: 'index', title: '序号', align: 'center', width: 70},
        {type: 'text', title: '事件名称', key: 'eventName', sortable: true, align: 'center'},
        {type: 'text', title: '策略名称', key: 'strategyName', sortable: true, align: 'center'},
        {type: 'text', title: '产品类别', key: 'productType', sortable: true, align: 'center'},
        {type: 'text', title: '触发量', key: 'triggleNum', sortable: true, align: 'center'}
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/report/strategyDetail', {page: this.page, search: this.searchInfo}, 'post', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.eventNames = res.data.data.eventNames
        this.strategyNames = res.data.data.strategyNames
        this.productTypes = res.data.data.productTypes
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
        filename: '策略详情_' + new Date().format('yyyyMMddhhmmss')
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
  color: #657180;
  text-align: center
}
</style>
