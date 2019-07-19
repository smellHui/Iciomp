<template>
  <div class="wrapper">
    <Row class="row">
      <i-col span="3" class="label">运营位名称</i-col>
      <i-col span="5">
        <Input v-model="searchInfo.positionName" placeholder="运营位名称" style="width: auto"/>
      </i-col>
      <i-col span="3" class="label">开关状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.status" clearable style="width: 130px" placeholder="请选择开关状态">
          <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="code-row-bg">
      <Button type="primary" shape="circle" icon="ios-search" @click="getList">搜 索</Button>
      <Button type="primary" shape="circle" icon="ios-search" @click="clearSearchInfo" style="margin-left: 30px">重 置</Button>
    </Row>
    <Row class="row">
      <i-col span="20">
        <div class="title">
          <Icon type="md-reorder" />
          运营位列表
        </div>
      </i-col>
      <i-col span="4" style="text-align: right">
        <Button icon="ios-add" type="primary" size="small" @click="createProduct">新增运营位
        </Button>
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
    <operationPop :editMode='!editMode' :product='rowData' :touchName='touch.touchName' :title="popTitle" :menuList="menuList" :typeList="typeList" :show="showModal" @saveInfo="saveInfo" @cancelInfo="dismissPop"></operationPop>
  </div>
</template>
<script>
import operationPop from './operationPop'
export default {
  name: 'products',
  components: {
    operationPop
  },
  data () {
    return {
      touch: {},
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
      rowData: {},
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
                  this.popTitle = '查看运营位详情'
                  let rowData = params.row
                  let marketTime = []
                  marketTime.push(rowData.dayBeginTime)
                  marketTime.push(rowData.dayEndTime)
                  this.$set(rowData, 'marketTime', marketTime)
                  this.rowData = rowData
                  this.editMode = false
                  this.showModal = true
                }
              }
            }, icon)
          }
        },
        {
          title: '名称',
          align: 'center',
          key: 'positionName'
        },
        {
          title: '编码',
          align: 'center',
          key: 'positionCode'
        },
        {
          title: '用户日接触频次',
          align: 'center',
          children: [
            {
              title: '周期（天）',
              align: 'center',
              key: 'touchLimitCycle'
            },
            {
              title: '频次',
              align: 'center',
              key: 'touchLimitNum'
            }
          ]
        },
        {
          title: '月次接触阀值（次）',
          align: 'center',
          key: 'monthLimitCount'
        },
        {
          title: '日营销时间',
          align: 'center',
          children: [
            {
              title: '起始',
              align: 'center',
              width: 100,
              key: 'dayBeginTime'
            },
            {
              title: '截至',
              align: 'center',
              width: 100,
              key: 'dayEndTime'
            }
          ]
        },
        {
          title: '创建人',
          align: 'center',
          key: 'operator'
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
                disabled: (this.$store.state.currentLevel & 2) === 0
              },
              on: {
                'on-change': (val) => {
                  this.rowList[params.index].status = val
                  params.row.status = val
                  this.editInfo(params.row)
                }
              }
            }, [
              h('span', {slot: 'open'}, '开'),
              h('span', {slot: 'close'}, '关')
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editProduct(params.row)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    let ids = []
                    ids.push(params.row.id)
                    this.deleteProduct(ids)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      rowList: [],
      // 目录
      menuList: [
        {
          value: '主套餐',
          label: '主套餐'
        },
        {
          value: '可选包',
          label: '可选包'
        }
      ],
      // 产品类别
      typeList: [
        {
          value: '互联网卡',
          label: '互联网卡'
        },
        {
          value: '畅享套餐',
          label: '畅享套餐'
        },
        {
          value: '十全十美',
          label: '十全十美'
        },
        {
          value: '其它',
          label: '其它'
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
      ]
    }
  },
  created () {
    this.touch = this.$route.params.touch
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 获取当前页列表数据
    getList () {
      this.searchInfo.touchId = this.touch.id
      this.$httpReq('/operate/getList', {page: this.page, search: this.searchInfo}, 'get', res => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.editMode = false
      })
    },
    // 新增或修改
    saveInfo () {
      if (!this.editMode) {
        this.dismissPop()
        return
      }
      let isCreate = this.createTag === 0
      this.rowData.touchId = this.touch.id
      let marketTime = this.rowData.marketTime
      if (marketTime !== null && marketTime !== undefined && marketTime.length === 2) {
        this.rowData.dayBeginTime = this.rowData.marketTime[0]
        this.rowData.dayEndTime = this.rowData.marketTime[1]
      }
      console.log(this.rowData)
      if (isCreate) {
        this.$httpReq('/operate/add', this.rowData, 'add', res => {
          this.$Message.success(res.data.msg)
          this.showModal = false
          this.rowData = {}
          this.getList()
        })
      } else {
        this.editInfo(this.rowData)
      }
    },
    editInfo (rowData) {
      this.$httpReq('/operate/edit', rowData, 'add', res => {
        this.$Message.success(res.data.msg)
        this.showModal = false
        this.rowData = {}
        this.getList()
      })
    },
    // 批量删除和单个删除
    deleteProduct (ids) {
      this.$httpReq('/operate/delete', ids, 'post', res => {
        this.$Message.success(res.data.msg)
        this.getList()
      })
    },
    // 新增产品弹框
    createProduct () {
      this.popTitle = '新增运营位'
      this.showModal = true
      this.editMode = true
      this.rowData = {
        touchLimitCycle: 0,
        touchLimitNum: 0,
        monthLimitCount: 0,
        status: 0
      }
      this.createTag = 0
    },
    // 修改某一行数据
    editProduct (rowData) {
      this.popTitle = '修改运营位'
      let marketTime = []
      marketTime.push(rowData.dayBeginTime)
      marketTime.push(rowData.dayEndTime)
      this.$set(rowData, 'marketTime', marketTime)
      this.rowData = rowData
      this.createTag = 1
      this.showModal = true
      this.editMode = true
    },
    // 多选框变化
    onSelectionChange (selection) {
      this.deleteIds = []
      for (let i = 0; i < selection.length; i++) {
        this.deleteIds.push(selection[i].id)
      }
      console.log(this.deleteIds)
    },
    // 弹框隐藏
    dismissPop () {
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
    margin-left: 30px;
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
