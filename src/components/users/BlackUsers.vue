<template>
  <div class="wrapper">
    <Row class="row">
      <i-col span="3" class="label">客户号码</i-col>
      <i-col span="5">
        <Input v-model="searchInfo.accNbr" placeholder="客户号码"/>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">黑名单属性</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.blackType" clearable style="width:auto" placeholder="请选择黑名单属性">
          <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="24" style="text-align:center">
        <Button icon="md-add" type="primary" shape="circle" size="small" @click.native="addBlackUser">添  加</Button>
        <Button icon="md-close" type="primary" shape="circle" size="small" @click.native="deleteBlackUser">删  除</Button>
        <Button icon="ios-search" type="primary" shape="circle" size="small" @click.native="searchBlackUser">查  找</Button>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="20">
        <div class="title">
          <Icon type="md-reorder"/>
          黑名单列表
        </div>
      </i-col>
    </Row>
    <Row>
      <i-col span="24">
        <Table ref="tabDataList" :columns="columns" :data="rowList" border stripe></Table>
      </i-col>
    </Row>
    <!-- 分页组件 -->
    <Row class="row">
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
import moment from 'moment'
export default {
  name: 'products',
  components: {},
  data () {
    return {
      deleteIds: [],
      searchInfo: {},
      rowList: [],
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100],
      menuList: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '副卡'
        },
        {
          value: 2,
          label: '流量包'
        }
      ],
      columns: [
        {
          title: '客户号码',
          align: 'center',
          key: 'accNbr'
        },
        {
          title: '黑名单属性',
          align: 'center',
          render: (h, params) => {
            let blackType = params.row.blackType
            return h('dev', this.tranBlackType(blackType))
          }
        },
        {
          title: '添加时间',
          align: 'center',
          render: (h, params) => {
            let createTime = params.row.createTime
            return h('dev', this.formatDate(createTime))
          }
        },
        {
          title: '操作员',
          align: 'center',
          key: 'operator'
        }
      ]
    }
  },
  methods: {
    // 获取当前页列表数据
    searchBlackUser () {
      this.$httpReq('/user/getBlackUser', {page: this.page, search: this.searchInfo}, 'get', res => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
      })
    },
    // 新增
    addBlackUser () {
      this.$httpReq('/user/add', this.searchInfo, 'add', res => {
        this.$Message.success(res.data.msg)
        this.searchBlackUser()
        this.searchInfo = {}
      })
    },
    // 删除
    deleteBlackUser () {
      this.$httpReq('/touch/delete', this.searchInfo, 'post', res => {
        this.$Message.success(res.data.msg)
        this.searchBlackUser()
        this.searchInfo = {}
      })
    },
    tranBlackType (type) {
      switch (type) {
        case 0:
          return '全部'
        case 1:
          return '副卡'
        case 2:
          return '流量包'
        default:
          return '全部'
      }
    },
    // 页码改变时触发
    pageChange (page) {
      this.page.currentNum = page
      this.searchBlackUser()
    },
    // 每页显示条数改变时触发
    sizeChange (size) {
      this.page.size = size
      this.searchBlackUser()
    },
    formatDate (time) {
      return moment(time).format('YYYY-MM-DD h:mm:ss')
    }
  }
}
</script>
<style scoped>
  .row {
    height: 32px;
    line-height: 32px;
    margin: 5px auto;
    text-align: left
  }
  .wrapper {
    background: #ffffff;
    margin: 5px;
    padding: 5px;
  }
  .label {
    text-align: right;
    padding-right: 10px;
  }
  .title {
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bolder;
    padding-left: 10px;
  }
</style>
