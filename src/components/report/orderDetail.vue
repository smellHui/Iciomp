<template>
  <div class="wrapper">
    <Row class="row">
      <i-col span="3" class="label">起始日期：</i-col>
      <i-col span="7">
        <DatePicker size="small" style="width:260px;" type="date" placeholder="请选择订购起始日期" :value="searchInfo.startDate" format="yyyy-MM-dd" @on-change="(val)=>{this.searchInfo.startDate=val;}"/>
      </i-col>
      <i-col span="3" class="label">终止日期：</i-col>
      <i-col span="11">
        <DatePicker size="small" style="width:260px;" type="date" placeholder="请选择订购终止日期" :value="searchInfo.endDate" format="yyyy-MM-dd" @on-change="(val)=>{this.searchInfo.endDate=val;}"/>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">事件名称：</i-col>
      <i-col span="7">
        <Select size="small" style="width:260px;" clearable filterable placeholder="请选择事件名称" v-model="searchInfo.eventName" @on-change="getCondition">
          <Option v-for="(item,key) in eventNames" :key="key" :value="item.EVENT_ID">{{item.EVENT_NAME}}</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">策略名称：</i-col>
      <i-col span="11">
        <Select size="small" style="width:260px;" clearable filterable placeholder="请选择策略名称" v-model="searchInfo.strategyName" @on-change="getCondition">
          <Option v-for="(item,key) in strategyNames" :key="key" :value="item.STRA_ID">{{item.STRA_NAME}}</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">产品类别：</i-col>
      <i-col span="7">
        <Select size="small" style="width:260px;" clearable filterable placeholder="请选择产品类别" v-model="searchInfo.productType" @on-change="getCondition">
          <Option v-for="(item,key) in productTypes" :key="key" :value="item.PTID">{{item.TYPENAME}}</Option>
        </Select>
      </i-col>
      <i-col span="3" style="text-align:right;padding-right:8px">
        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">产品名称：</Checkbox>
      </i-col>
      <i-col span="11">
        <CheckboxGroup v-model="searchInfo.productName">
          <Checkbox v-for="item in productNames" :key="item.PRODUCTCODE" :label="item.PRODUCTCODE">{{item.PRODUCTNAME}}</Checkbox>
        </CheckboxGroup>
      </i-col>
    </Row>
    <Row style="height:50px;line-height:50px;">
      <i-col span="7" style="text-align:center">
        <Button icon="ios-grid" type="primary" shape="circle" size="small" @click.native="getData">报表查询</Button>
        <Button style="margin-left:30px" icon="ios-download" type="info" shape="circle" size="small" @click.native="exportData">导出报表</Button>
      </i-col>
    </Row>
    <Divider><span class="title">订 购 详 情 统 计 表</span></Divider>
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
  name: 'OrderDetail',
  data () {
    return {
      // 查询参数数据绑定
      searchInfo: {
        startDate: (new Date((new Date()).setDate(1))).format('yyyy-MM-dd'),
        endDate: (new Date()).format('yyyy-MM-dd'),
        eventName: '',
        strategyName: '',
        productType: '',
        productName: []
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
      // 事件名称选项数组
      eventNames: [],
      // 策略名称选项数组
      strategyNames: [],
      // 产品类别选项数组
      productTypes: [],
      // 产品名称选项数组
      productNames: [],
      // 报表栏目定义
      columns: [
        {type: 'index', title: '序号', align: 'center', width: 70},
        {type: 'text', title: '产品名称', key: 'productName', sortable: true, align: 'center'},
        {type: 'text', title: '订购代码', key: 'orderCode', sortable: true, align: 'center'},
        {type: 'text', title: '订购量', key: 'orderNum', sortable: true, align: 'center'}
      ]
    }
  },
  computed: {
    indeterminate () {
      if (this.searchInfo.productName.length >= this.productNames.length || this.searchInfo.productName.length < 1) {
        return false
      } else {
        return true
      }
    },
    checkAll () {
      if (this.searchInfo.productName.length > 0 && this.searchInfo.productName.length >= this.productNames.length) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    this.getCondition()
    // this.getData()
  },
  methods: {
    handleCheckAll () {
      if (this.searchInfo.productName.length >= this.productNames.length) {
        this.searchInfo.productName = []
      } else {
        let checks = []
        for (let i = 0; i < this.productNames.length; i++) {
          checks.push(this.productNames[i].PRODUCTCODE)
        }
        this.searchInfo.productName = checks
      }
    },
    // 获取当前页列表数据
    getData () {
      if (this.searchInfo.startDate !== null && this.searchInfo.startDate !== '' &&
        this.searchInfo.endDate !== null && this.searchInfo.endDate !== '') {
        let s = new Date(this.searchInfo.startDate)
        let e = new Date(this.searchInfo.endDate)
        if (s > e) {
          this.$Message.warning({duration: 5, content: '起始日期不能大于终止日期！'})
          return
        }
        if (s.getFullYear() !== e.getFullYear() || s.getMonth() !== e.getMonth()) {
          this.$Message.warning({duration: 5, content: '起止日期不能跨月！'})
          return
        }
      }
      if (this.searchInfo.productName.length < 1) {
        this.$Message.warning({duration: 5, content: '请勾选所要查询的产品名称！'})
        return
      }
      this.$httpReq('/report/orderDetail', {page: this.page, search: this.searchInfo}, 'post', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
      })
    },
    // 获取筛选条件
    getCondition () {
      this.$httpReq('/report/orderCondition', this.searchInfo, 'post', (res) => {
        this.eventNames = res.data.data.eventNames
        this.strategyNames = res.data.data.strategyNames
        this.productTypes = res.data.data.productTypes
        this.productNames = res.data.data.productNames
        this.searchInfo.productName = []
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
        filename: '订购详情_' + new Date().format('yyyyMMddhhmmss')
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
