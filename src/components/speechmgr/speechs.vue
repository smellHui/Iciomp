<template>
  <div>
    <Row type="flex" justify="start" style="margin-left: 50px">
      <i-col class="icol" span="6">
        <p class="title">模板名称</p>
        <Input v-model="searchInfo.templateName" placeholder="模板名称..." style="width: 300px"/>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">适用场景</p>
        <Select v-model="searchInfo.suitableSence" clearable style="width:300px">
          <Option v-for="item in senceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="3">
        <p class="title">上线状态</p>
        <Select v-model="searchInfo.status" clearable style="width:100px">
          <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="3">
        <p class="title">审核状态</p>
        <Select v-model="searchInfo.verify" clearable style="width:100px">
          <Option v-for="item in verifyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">开始日期</p>
        <DatePicker type="date" :options="searchInfo.startTime" placeholder="开始日期"
                    style="width: 215px;margin-right: 10px"></DatePicker>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">失效日期</p>
        <DatePicker type="date" :options="searchInfo.endTime" placeholder="失效日期"
                    style="width: 215px;margin-right: 10px"></DatePicker>
      </i-col>
    </Row>
    <Row class="code-row-bg">
      <Button type="primary" shape="circle" icon="ios-search" @click="getList">搜 索</Button>
      <Button type="primary" shape="circle" icon="ios-search" @click="clearSearchInfo">重 置</Button>
    </Row>
    <Row class="row">
      <i-col span="22">
        <div class="title">
          <Icon type="ios-list"/>
          话术列表
        </div>
      </i-col>
      <i-col span="2">
        <Button icon="ios-add" type="primary" size="small" @click="createProduct">新增话术模板
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
    <addSpeechPop :template='template' :title="popTitle" :typeList="typeList" :show="showModal" @saveInfo="saveInfo" @cancelInfo="dismissPop"></addSpeechPop>
  </div>
</template>

<script>
import addSpeechPop from './addSpeechPop'
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
      popTitle: '',
      template: {},
      columns: [
        {
          title: '模板名称',
          key: 'templateName'
        },
        {
          title: '模板内容',
          key: 'wordContent'
        },
        {
          title: '类型',
          key: 'templateType'
        },
        {
          title: '场景',
          key: 'suitableSence'
        },
        {
          title: '时间',
          key: 'startTime'
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
      senceList: [
        {
          value: '流量包营销',
          label: '流量包营销'
        }
      ],
      // 上线状态
      stateList: [
        {
          value: 0,
          label: '开启'
        },
        {
          value: 1,
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
      // 模板类型
      typeList: [
        {
          value: 0,
          label: '主话术'
        },
        {
          value: 1,
          label: '尾部营销后缀'
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
    // 新增
    saveInfo () {
      let isCreate = this.createTag === 0
      this.$httpReq(isCreate ? '/word/addWord' : '/word/editWord', this.template, 'add', (res) => {
        this.$Message.success(res.data.msg)
        this.showModal = false
        this.template = {}
        this.getList()
      })
    },
    // 批量删除和单个删除
    deleteProduct (ids) {
      this.$httpReq('/word/deleteWords', ids, 'post', res => {
        this.$Message.success(res.data.msg)
        this.getList()
      })
    },
    // 新增产品弹框
    createProduct () {
      this.popTitle = '新增话术模板'
      this.showModal = true
      this.createTag = 0
    },
    // 修改某一行数据
    editProduct (params) {
      this.popTitle = '修改话术模板'
      this.template = params
      this.createTag = 1
      this.showModal = true
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
