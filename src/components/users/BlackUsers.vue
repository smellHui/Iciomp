<template>
  <div class="wrapper">
    <Row style="margin-left: 50px">
      <i-col class="icol" span="6">
        <p class="label">客户号码</p>
        <Input v-model="searchInfo.accNbr" placeholder="客户号码" style="width: 300px"/>
      </i-col>
    </Row>
    <Row style="margin-left: 50px">
      <i-col class="icol" span="6">
        <p class="label">黑名单属性</p>
        <Select v-model="searchInfo.blackType" clearable style="width:300px;text-align: left">
          <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="code-row-bg">
      <Button type="primary" shape="circle" icon="ios-search" @click="addBlackUser">添加</Button>
      <Button type="primary" shape="circle" icon="ios-search" @click="deleteBlackUser" style="margin-left: 30px">删除</Button>
      <Button type="primary" shape="circle" icon="ios-search" @click="searchBlackUser" style="margin-left: 30px">查找</Button>
    </Row>
    <Row class="row">
      <i-col span="20">
        <div class="title">
          <Icon type="ios-list"/>
          黑名单列表
        </div>
      </i-col>
    </Row>
    <Row>
      <i-col span="24">
        <Table ref="tabDataList" :columns="columns" :data="rowList" border stripe></Table>
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
        }
      ]
    }
  },
  methods: {
    // 获取当前页列表数据
    searchBlackUser () {
      this.$httpReq('/user/getBlackUser', {search: this.searchInfo}, 'get', res => {
        console.log(res.data.data)
        this.rowList = res.data.data
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
    formatDate (time) {
      return moment(time).format('YYYY-MM-DD h:mm:ss')
    }
  }
}
</script>
<style scoped>
  .code-row-bg {
    margin-top: 30px;
  }
  .row {
    height: 32px;
    line-height: 32px;
    margin: 5px auto;
    text-align: left
  }
  .icol {
    display: flex;
    margin-top: 20px;
    margin-left: 30px;
    align-items: center;
  }
  .wrapper {
    background: #ffffff;
    margin: 5px;
    padding: 5px;
  }
  .label {
    width: 100px;
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
