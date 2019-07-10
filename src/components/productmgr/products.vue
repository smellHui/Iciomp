<template>
  <div class="wrapper">
    <Row class="row">
      <i-col span="3" class="label">产品名称</i-col>
      <i-col span="5">
        <Input v-model="searchInfo.proName" placeholder="产品名称"/>
      </i-col>
      <i-col span="3" class="label">目录</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.proMenu" clearable style="width:auto" placeholder="请选择产品目录">
          <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">产品类别</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.proType" clearable style="width:auto" placeholder="请选择产品类别">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">创建日期</i-col>
      <i-col span="21">
        <DatePicker type="date" placeholder="开始日期" @on-change="(value) => this.searchInfo.startTime = value"/>
        &emsp;—&emsp;<DatePicker type="date" placeholder="结束日期" @on-change="(value) => this.searchInfo.endTime = value"/>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="24" style="text-align:center">
        <Button icon="ios-search" type="primary" shape="circle" size="small" @click.native="getList">搜&emsp;索</Button>&emsp;&emsp;&emsp;&emsp;
        <Button icon="ios-refresh" type="primary" shape="circle" size="small" @click.native="clearSearchInfo">重&emsp;置</Button>
      </i-col>
    </Row>
    <Row class="row" :gutter="20">
      <i-col span="18">
        <div class="title">
          <Icon type="md-reorder" />
          产品列表
        </div>
      </i-col>
      <i-col span="3" style="text-align: right">
        <Button icon="ios-add" type="primary" size="small" @click="deleteProduct(deleteIds)">批量删除</Button>
      </i-col>
      <i-col span="3" style="text-align: right">
        <Button icon="ios-add" type="primary" size="small" @click="createProduct">新增产品</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="24">
        <Table ref="tabDataList" :columns="columns" :data="rowList" @on-selection-change="onSelectionChange" border stripe></Table>
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
    <addProductPop :editMode='!editMode' :product='rowData' :title="popTitle" :menuList="menuList" :typeList="typeList" :show="showModal" @saveInfo="saveInfo" @cancelInfo="dismissPop"></addProductPop>
  </div>
</template>
<script>
import addProductPop from './addProductPop'
export default {
  name: 'products',
  components: {
    addProductPop
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
                  this.popTitle = '查看产品详情'
                  this.rowData = params.row
                  this.editMode = false
                  this.showModal = true
                }
              }
            }, icon)
          }
        },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          align: 'center',
          key: 'proName'
        },
        {
          title: '定价ID',
          align: 'center',
          key: 'priceId'
        },
        {
          title: '区域标识',
          align: 'center',
          key: 'suitableCity'
        },
        {
          title: '目录',
          align: 'center',
          key: 'proMenu'
        },
        {
          title: '产品类别',
          align: 'center',
          key: 'proType'
        },
        {
          title: '短厅受理指令',
          align: 'center',
          key: 'orderCode'
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
                falseValue: 0
              },
              on: {
                'on-change': (val) => {
                  this.rowList[params.index].status = val
                  params.row.status = val
                  this.setStatus(params.row)
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
      ]
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 获取当前页列表数据
    getList () {
      this.$httpReq('/product/getProductList', {page: this.page, search: this.searchInfo}, 'get', res => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.events = res.data.data.events
        this.currentRow = -1
        this.editMode = false
      })
    },
    // 新增
    saveInfo () {
      if (!this.editMode) {
        this.dismissPop()
        return
      }
      let isCreate = this.createTag === 0
      this.$httpReq(isCreate ? '/product/addProduct' : '/product/editProduct', this.rowData, 'add', res => {
        this.$Message.success(res.data.msg)
        this.showModal = false
        this.rowData = {}
        this.getList()
      })
    },
    // 批量删除和单个删除
    deleteProduct (ids) {
      this.$httpReq('/product/deleteProducts', ids, 'post', res => {
        this.$Message.success(res.data.msg)
        this.getList()
      })
    },
    // 设置产品开关状态
    setStatus (rowData) {
      this.$httpReq('/product/setProductStatus/' + rowData.id, {}, 'edit', (res) => {
        this.$Message.success(res.data.msg)
        this.getList()
      })
    },
    // 新增产品弹框
    createProduct () {
      this.popTitle = '新增产品'
      this.showModal = true
      this.editMode = true
      this.createTag = 0
    },
    // 修改某一行数据
    editProduct (rowData) {
      this.popTitle = '修改产品'
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
      this.rowData = {}
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
