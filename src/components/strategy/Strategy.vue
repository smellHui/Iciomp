<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">策略名称</i-col>
      <i-col span="5"><Input type="text" placeholder="请输入策略名称" clearable v-model="searchInfo.strategyName"/></i-col>
      <i-col span="3" class="label">营销事件</i-col>
      <i-col span="5">
        <Cascader  placeholder="请选择营销事件" style="width:auto" transfer trigger="hover" filterable
          :data="marketingEvents" v-model="marketingEvent"
          @on-change="(val)=>searchInfo.marketingEventId=val.length>0?val[1]:''" />
      </i-col>
      <i-col span="3" class="label">状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.status" clearable placeholder="请选择策略状态" style="width:auto">
          <Option value="0">下线</Option>
          <Option value="1">上线</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">运营位</i-col>
      <i-col span="5">
        <Cascader  placeholder="请选择运营位" style="width:auto" transfer trigger="hover" filterable
          :data="operatePositions" v-model="operatePosition"
          @on-change="(val)=>searchInfo.operatePositionId=val.length>0?val[1]:''" />
      </i-col>
      <i-col span="3" class="label">创建时间</i-col>
      <i-col span="13">
        <DatePicker type="datetime" placeholder="请选择开始日期和时间" v-model="searchInfo.startTime" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.searchInfo.startTime=val"/>
        &emsp;—&emsp;<DatePicker type="datetime" placeholder="请选择结束日期和时间" v-model="searchInfo.endTime" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.searchInfo.endTime=val"/>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="24" style="text-align:center">
        <Button icon="ios-search" type="primary" shape="circle" size="small" @click.native="getData">搜&emsp;索</Button>&emsp;&emsp;&emsp;&emsp;
        <Button icon="ios-refresh" type="primary" shape="circle" size="small" @click.native="clearSearchInfo">重&emsp;置</Button>
      </i-col>
    </Row>
    <!-- 数据列表  -->
    <Row class="row">
      <i-col span="20">
        <div class="title"><Icon type="ios-list"/> 策略列表</div>
      </i-col>
      <i-col span="4" style="text-align:right;padding-right:10px">
        <Button v-if="this.$store.state.currentLevel&8" icon="ios-add" type="primary" size="small" @click="clickAdd">新增策略</Button>
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
export default {
  name: 'Strategy',
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        strategyName: '',
        marketingEventId: '',
        operatePositionId: '',
        status: null,
        startTime: '',
        endTime: ''
      },
      marketingEvent: [],
      operatePosition: [],
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100],
      // 当前页数据项列表数据
      rowList: [],
      // 营销事件列表
      marketingEvents: [],
      // 运营位列表
      operatePositions: [],
      // 数据列表栏目定义
      columns: [
        {
          type: 'text',
          width: 30,
          align: 'center',
          className: 'padding8cell',
          renderHeader: (h, params) => {
            return h('Icon', {props: {type: 'ios-eye', size: 24}, style: {marginLeft: '-12px'}})
          },
          render: (h, params) => {
            let icon = []
            icon.push(h('Icon', {props: {type: 'ios-book-outline', size: 20}, style: {marginLeft: '-2px'}}))
            return h('div', {
              style: {
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.$router.push({path: '/strategy/strategyConfig', query: {id: params.row.id, editMode: false}})
                }
              }
            }, icon)
          }
        },
        {title: '策略名称', key: 'strategyName', sortable: true, align: 'center'},
        {
          title: '营销事件',
          key: 'marketingEventId',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            let text = ''
            for (let i in this.marketingEvents) {
              for (let j in this.marketingEvents[i].children) {
                if (params.row.marketingEventId === this.marketingEvents[i].children[j].value) {
                  text = this.marketingEvents[i].children[j].label
                  break
                }
              }
            }
            return h('div', text)
          }
        },
        {title: '优先级', key: 'priority', sortable: true, align: 'center', width: 95},
        {title: '生效时间', key: 'effectTime', sortable: true, align: 'center'},
        {title: '失效时间', key: 'expireTime', sortable: true, align: 'center'},
        {
          title: '状态',
          key: 'status',
          sortable: true,
          align: 'center',
          width: 95,
          render: (h, params) => {
            return h('div', params.row.status ? '上线' : '下线')
          }
        },
        // 定义操作按钮列（开始）
        {
          title: '操作',
          align: 'center',
          width: 125,
          render: (h, params) => {
            let btns = []
            if ((this.$store.state.currentLevel & 2)) {
              btns.push(h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$router.push({path: '/strategy/strategyConfig', query: {id: params.row.id, editMode: true}})
                  }
                }
              }, '修改'))
            }
            if ((this.$store.state.currentLevel & 4) && !params.row.verify) {
              let delBtn = [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '5px'
                  }}, '删除')
              ]
              btns.push(h('Poptip', {
                props: {
                  trigger: 'click',
                  confirm: true,
                  title: '您真的要删除该行吗？',
                  placement: 'left',
                  transfer: true,
                  width: 200
                },
                on: {
                  'on-ok': () => {
                    this.delRow(params.row)
                  }
                }
              }, delBtn))
            }
            return h('div', btns)
          }
        }
        // 定义操作按钮列结束（结束）
      ]
    }
  },
  mounted () {
    this.getData()
    // 获取营销事件选择列表
    this.$httpReq('/common/listMarketingEvents', null, 'GET', (res) => {
      this.marketingEvents = []
      let temp = ''
      let obj = null
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].type !== temp) {
          temp = res.data.data[i].type
          obj = {value: temp, label: temp, children: []}
          this.marketingEvents.push(obj)
        }
        obj.children.push({value: res.data.data[i].id, label: res.data.data[i].name})
      }
    })
    // 获取运营位选择列表
    this.$httpReq('/common/operatePosition/names', null, 'get', (res) => {
      this.operatePositions = []
      let d = res.data.data
      let t = ''
      let o = null
      for (let i in d) {
        if (d[i].touchId !== t) {
          t = d[i].touchId
          o = {value: t, label: d[i].touchName, children: []}
          this.operatePositions.push(o)
        }
        o.children.push({value: d[i].id, label: d[i].positionName})
      }
    })
  },
  methods: {
    // 点击“新增策略”按钮时触发
    clickAdd () {
      this.$router.push({path: '/strategy/strategyConfig', query: {id: null, editMode: true}})
    },
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/strategy/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.strategyName = ''
      this.searchInfo.marketingEventId = ''
      this.searchInfo.operatePositionId = ''
      this.searchInfo.status = null
      this.marketingEvent = []
      this.operatePosition = []
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
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
    // 删除数据，点击“删除”按钮时触发
    delRow (rowData) {
      this.$httpReq('/strategy/' + rowData.id, '', 'del', (res) => {
        this.$Message.success('所选策略已成功删除！')
        this.getData()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  background: #ffffff;
  margin: 5px;
  padding: 5xp;
}
.row {
  height: 32px;
  line-height: 32px;
  margin: 5px auto;
  text-align: left
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
<style>
.ivu-table-row .padding8cell>.ivu-table-cell {
  padding: 0 8px
}
</style>
