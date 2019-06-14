<template>
  <div>
    <Row type="flex" justify="start" style="margin-left: 50px">
      <i-col class="icol" span="6">
        <p class="title">产品名称</p>
        <Input v-model="searchInfo.proName" placeholder="产品名称..." style="width: 300px"/>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">目录</p>
        <Select v-model="searchInfo.proMenu" clearable style="width:300px">
          <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">产品类别</p>
        <Select v-model="searchInfo.proType" clearable style="width:300px">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol">
        <p class="title">创建日期</p>
        <DatePicker type="date" :options="searchInfo.startTime" placeholder="开始日期"
                    style="width: 215px;margin-right: 10px"></DatePicker>
        -
        <DatePicker type="date" :options="searchInfo.endTime" placeholder="结束日期"
                    style="width: 215px;margin-left: 10px"></DatePicker>
      </i-col>
    </Row>
    <Row class="code-row-bg">
      <Button type="primary" shape="circle" icon="ios-search" @click="getList">搜 索</Button>
      <Button type="primary" shape="circle" icon="ios-search" @click="clearSearchInfo">重 置</Button>
    </Row>
    <Row class="row">
      <i-col span="20">
        <div class="title">
          <Icon type="ios-list"/>
          产品列表
        </div>
      </i-col>
      <i-col span="2">
        <Button icon="ios-add" type="primary" size="small" @click="deleteProduct(deleteIds)">批量删除
        </Button>
      </i-col>
      <i-col span="2">
        <Button icon="ios-add" type="primary" size="small" @click="createProduct">新增产品
        </Button>
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
    <addProductPop :product='product' :title="popTitle" :menuList="menuList" :typeList="typeList" :show="showModal" @saveInfo="saveInfo" @cancelInfo="dismissPop"></addProductPop>
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
      popTitle: '',
      product: {},
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'proName'
        },
        {
          title: '定价ID',
          key: 'priceId'
        },
        {
          title: '区域标识',
          key: 'suitableCity'
        },
        {
          title: '目录',
          key: 'proMenu'
        },
        {
          title: '产品类别',
          key: 'proType'
        },
        {
          title: '短厅受理指令',
          key: 'orderCode'
        },
        {
          title: '状态',
          key: 'status'
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
      let isCreate = this.createTag === 0
      this.$httpReq(isCreate ? '/product/addProduct' : '/product/editProduct', this.product, 'add', res => {
        this.$Message.success(res.data.msg)
        this.showModal = false
        this.product = {}
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
    // 新增产品弹框
    createProduct () {
      this.popTitle = '新增产品'
      this.showModal = true
      this.createTag = 0
    },
    // 修改某一行数据
    editProduct (params) {
      this.popTitle = '修改产品'
      this.product = params
      this.createTag = 1
      this.showModal = true
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
      this.product = {}
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
    margin-top: 20px;
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

  .title {
    padding-right: 10px
  }
</style>
