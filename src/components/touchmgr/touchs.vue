<template>
  <div>
    <Row type="flex" justify="flex-start" style="margin-left: 50px">
      <i-col class="icol" span="6">
        <p class="title">触点编码</p>
        <Input v-model="touch.touchCode" placeholder="Enter something..." style="width: 300px"/>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">触点来源</p>
        <Input v-model="touch.touchSource" placeholder="Enter something..." style="width: 300px"/>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">月接触总阀值</p>
        <InputNumber :max="10" :min="1" v-model="touch.monthThreshold"></InputNumber>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">接触媒介</p>
        <Select v-model="touch.touchMedia" clearable style="width:200px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">接触时效</p>
        <Select v-model="touch.timesType" clearable style="width:200px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col class="icol" span="6">
        <p class="title">开关</p>
        <i-switch size="large"/>
      </i-col>
    </Row>
    <Row class="code-row-bg">
      <Button type="primary" shape="circle" icon="ios-search">编辑</Button>
      <Button type="primary" shape="circle" icon="ios-search">运营位</Button>
    </Row>
    <Row class="row">
      <i-col span="22">
        <div class="title">
          <Icon type="ios-list"/>
          产品列表
        </div>
      </i-col>
      <i-col span="2">
        <Button icon="ios-add" type="primary" size="small" @click="showModal = true">新增触点
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
    <addTouchPop :touch='touch' :show="showModal" @saveInfo="saveInfo" @cancelInfo="showModal = false"></addTouchPop>
  </div>
</template>

<script>
import addTouchPop from './addTouchPop'
export default {
  name: 'products',
  components: {
    addTouchPop
  },
  data () {
    return {
      searchInfo: {
        touchCode: '',
        touchSource: '',
        monthThreshold: 0,
        touchMedia: 0,
        timesType: 0
      },
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100],
      showModal: false,
      touch: {},
      value1: 1,
      columns: [
        {
          title: '名称',
          key: 'touchName'
        },
        {
          title: '编码',
          key: 'touchCode'
        },
        {
          title: '单用户日接触频次',
          key: 'touchCode'
        },
        {
          title: '用户月次接触阈值',
          key: 'monthThreshold'
        },
        {
          title: '日营销时间',
          key: 'createTime'
        },
        {
          title: '创建人',
          key: 'operator'
        },
        {
          title: '生效时间',
          key: 'createTime'
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
                    this.show(params.index)
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
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      rowList: [
        {
          name: 'John Brown'
        },
        {
          name: 'Jim Green'
        },
        {
          name: 'Joe Black'
        },
        {
          name: 'Jon Snow'
        }
      ],
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
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
      this.$httpReq('/touch/getTouchList', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.events = res.data.data.events
        this.currentRow = -1
        this.editMode = false
      })
    },
    // 新增
    saveInfo () {
      this.$httpReq('/touch/addTouch', this.touch, 'add', (res) => {
        this.$Message.success('产品已成功新增！')
        this.showModal = false
        this.getList()
      })
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
      this.searchInfo.proName = ''
      this.searchInfo.proMenu = ''
      this.searchInfo.proType = ''
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
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
