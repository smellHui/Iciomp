<template>
  <div class="wrapper">
    <Row class="row">
      <i-col span="3" class="label">模板名称</i-col>
      <i-col span="5">
        <Input v-model="searchInfo.templateName" placeholder="模板名称"/>
      </i-col>
      <i-col span="3" class="label">适用场景</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.suitableSence" placeholder="适用场景" filterable clearable style="width: auto">
          <Option v-for="item in sences" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">开关状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.status" clearable style="width: auto" placeholder="请选择开关状态">
          <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">审核状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.verify" clearable >
          <Option v-for="item in verifyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">开始日期</i-col>
      <i-col span="5">
        <DatePicker type="date" placeholder="开始日期" @on-change="(value) => this.searchInfo.startTime = value" />
      </i-col>
      <i-col span="3" class="label">失效日期</i-col>
      <i-col span="5">
        <DatePicker type="date" placeholder="失效日期" @on-change="(value) => this.searchInfo.endTime = value" />
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="24" style="text-align:center">
        <Button icon="ios-search" type="primary" shape="circle" size="small" @click.native="getList">搜&emsp;索</Button>&emsp;&emsp;&emsp;&emsp;
        <Button icon="ios-refresh" type="primary" shape="circle" size="small" @click.native="clearSearchInfo">重&emsp;置</Button>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="22">
        <div class="title">
          <Icon type="md-reorder" />
          话术列表
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
    <addSpeechPop :editMode='!editMode' :template='template' :title="popTitle" :show="showModal" @saveInfo="saveInfo" @cancelInfo="dismissPop"></addSpeechPop>
  </div>
</template>

<script>
import addSpeechPop from './addSpeechPop'
import moment from 'moment'
export default {
  name: 'products',
  components: {
    addSpeechPop
  },
  data () {
    return {
      createTag: 0, // 0-新增，1-修改
      deleteIds: [],
      searchInfo: {},
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100],
      showModal: false,
      editMode: false,
      popTitle: '',
      template: {},
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
                  this.popTitle = '查看话术模板详情'
                  this.template = params.row
                  this.editMode = false
                  this.showModal = true
                }
              }
            }, icon)
          }
        },
        {
          title: '模板名称',
          align: 'center',
          key: 'templateName'
        },
        {
          title: '模板内容',
          align: 'center',
          key: 'wordContent'
        },
        {
          title: '类型',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, [
              h('p', params.row.templateType === 0 ? '主话术' : '营销后缀')
            ])
          }
        },
        {
          title: '场景',
          align: 'center',
          key: 'suitableSence'
        },
        {
          title: '时间',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, [
              h('p', this.formatDate(params.row.startTime) + ' - ' + this.formatDate(params.row.endTime))
            ])
          }
        },
        {
          title: '开关状态',
          key: 'status',
          align: 'center',
          sortable: true,
          width: 105,
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: params.row.status,
                trueValue: 1,
                falseValue: 0,
                disabled: true
              }
            }, [
              h('span', {slot: 'open'}, '开'),
              h('span', {slot: 'close'}, '关')
            ])
          }
        },
        {
          title: '审核状态',
          width: 105,
          key: 'state',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', params.row.verify ? '已审核' : '待审核')
          }
        },
        // 定义操作按钮列（开始）
        {
          title: '操作',
          align: 'center',
          width: 130,
          render: (h, params) => {
            if (this.$store.state.currentLevel & 16) {
              return h('Button', {
                props: {
                  type: params.row.verify ? 'warning' : 'primary',
                  icon: params.row.verify ? 'md-undo' : 'md-checkmark',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.audit(params.row)
                  }
                }
              }, params.row.verify ? '取消审核' : '审核通过')
            }
          }
        }
        // 定义操作按钮列结束（结束）
      ],
      rowList: [],
      senceList: [
        {
          value: '流量包营销',
          label: '流量包营销'
        }
      ],
      // 上线状态
      stateList: [
        {
          value: 1,
          label: '开启'
        },
        {
          value: 0,
          label: '关闭'
        }
      ],
      // 审核状态
      verifyList: [
        {
          value: 0,
          label: '未审核'
        },
        {
          value: 1,
          label: '已审核'
        }
      ],
      sences: [
        {
          value: '低零活动',
          label: '低零活动'
        },
        {
          value: '服务查询',
          label: '服务查询'
        },
        {
          value: '互联网卡',
          label: '互联网卡'
        },
        {
          value: '欢go客户端',
          label: '欢go客户端'
        },
        {
          value: '加黑名单专用',
          label: '加黑名单专用'
        },
        {
          value: '流量产品',
          label: '流量产品'
        },
        {
          value: '流量服务提醒',
          label: '流量服务提醒'
        },
        {
          value: '语音包',
          label: '语音包'
        }
      ]
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 获取当前页列表数据
    getList () {
      this.$httpReq('/word/getWordList', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.events = res.data.data.events
        this.currentRow = -1
        this.editMode = false
      })
    },
    // 审核操作
    audit (rowData) {
      this.$httpReq('/word/auditWord/' + rowData.id, {}, 'edit', (res) => {
        this.$Message.success(res.data.msg)
        this.getList()
      })
    },
    // 新增
    saveInfo () {
      this.dismissPop()
    },
    // 修改某一行数据
    editProduct (params) {
      this.popTitle = '修改话术模板'
      this.template = params
      this.createTag = 1
      this.showModal = true
    },
    formatDate (time) {
      if (time === undefined || time == null) {
        return ''
      }
      return moment(time).format('YYYY/MM/DD')
    },
    // 弹框隐藏
    dismissPop () {
      this.template = {}
      this.showModal = false
    },
    // 页码改变时触发
    pageChange (page) {
      this.page.currentNum = page
      this.getList()
    },
    // 每页显示条数改变时触发
    sizeChange (size) {
      this.page.size = size
      this.getList()
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo = {}
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
    align-items: center;
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
