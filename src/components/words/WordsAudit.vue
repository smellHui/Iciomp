<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">话术名称</i-col>
      <i-col span="5"><Input type="text" placeholder="请输入话术名称" v-model="searchInfo.descName"/></i-col>
      <i-col span="3" class="label">开关状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.status" clearable placeholder="请选择开关状态" style="width:auto">
          <Option value="0">关闭</Option>
          <Option value="1">运行中</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">审核状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.verify" clearable placeholder="请选择审核状态" style="width:auto">
          <Option value="0">待审核</Option>
          <Option value="1">已审核</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">场景类别</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.sceneTypeId" clearable placeholder="请选择场景类别">
          <Option v-for="(item,key) in sceneTypes" :key="key" :value="key">{{item}}</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">开始时间</i-col>
      <i-col span="5">
        <DatePicker type="datetime" placeholder="请选择开始日期和时间" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.searchInfo.startTime=val"/>
      </i-col>
      <i-col span="3" class="label">结束时间</i-col>
      <i-col span="5">
        <DatePicker type="datetime" placeholder="请选择结束日期和时间" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.searchInfo.endTime=val"/>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="24" style="text-align:center">
        <Button icon="ios-search" type="primary" shape="circle" size="small" @click.native="getData">搜&emsp;索</Button>&emsp;&emsp;&emsp;&emsp;
        <Button icon="ios-refresh-empty" type="primary" shape="circle" size="small" @click.native="clearSearchInfo">重&emsp;置</Button>
      </i-col>
    </Row>
    <!-- 数据列表  -->
    <Row class="row">
      <i-col span="24">
        <div class="title"><Icon type="ios-list"/> 话术列表</div>
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
    <!-- 详情对话框 -->
    <Modal v-model="showModal" title="查看话术详情" width="580" :okText="'关闭'" cancelText="取消" :styles="{top: 0}">
      <Form ref="Data_" :label-width="100" :rules="rules" :model="Data_">
        <Row>
          <i-col span="12">
            <FormItem label="话术名称" prop="descName">
              <Input placeholder="请输入话术名称" v-model="Data_.descName" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="场景类型">
              <Select v-model="Data_.sceneTypeId" placeholder="请选择场景类型" clearable :disabled="!editMode">
                <Option v-for="(item,key) in sceneTypes" :key="key" :value="key">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="开始时间">
              <DatePicker type="datetime" :disabled="!editMode" :value="Data_.startTime" placeholder="请选择开始日期和时间" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.Data_.startTime=val"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="结束时间">
              <DatePicker type="datetime" :disabled="!editMode" :value="Data_.endTime" placeholder="请选择结束日期和时间" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.Data_.endTime=val"/>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="前置语">
          <Editor v-if="showModal" v-model="Data_.prependWord" :disabled="!editMode"></Editor>
        </FormItem>
        <FormItem label="主体">
          <Editor  v-if="showModal" :autosize="{minRows:5,maxRows:5}" :disabled="!editMode" v-model="Data_.content"></Editor>
        </FormItem>
        <FormItem label="尾部附加">
          <Editor v-if="showModal" v-model="Data_.appendWord" :disabled="!editMode"></Editor>
        </FormItem>
        <FormItem label="备注">
          <Input type="textarea" :disabled="!editMode" :autosize="{minRows: 3,maxRows: 5}" placeholder="请在此输入营销机会备注" v-model="Data_.remark"/>
        </FormItem>
        <template v-if="!editMode">
           <Row>
            <i-col span="12">
              <label class="label1">创建时间：</label>
              <span>{{this.Data_.createTime}}</span>
            </i-col>
            <i-col span="12">
              <label class="label1">修改时间：</label>
              <span>{{this.Data_.updateTime}}</span>
            </i-col>
          </Row>
        </template>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Editor from '@/components/editor/Editor'
export default {
  name: 'Words',
  components: {
    Editor
  },
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        descName: '',
        startTime: '',
        endTime: '',
        status: null,
        sceneTypeId: null,
        verify: null
      },
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100],
      // 新增模态对话框是否显示
      showModal: false,
      // 数据项数据
      Data_: {
        descName: '',
        sceneTypeId: null,
        prependWord: '',
        content: '',
        appendWord: '',
        suitableChannel: null,
        startTime: '',
        endTime: '',
        remark: ''
      },
      // 新增数据表单验证规则
      rules: {
        descName: [{required: true, message: '话术名称不能为空！', trigger: 'blur, change'}]
      },
      // 当前行索引
      currentRow: -1,
      // 当前页数据项列表数据
      rowList: [],
      // 编辑模式
      editMode: false,
      // 场景类别选项
      sceneTypes: {'1': '场景类别一', '2': '场景类别二', '3': '场景类别三'},
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
                  this.currentRow = params.index
                  this.editMode = false
                  this.showModal = true
                  this.Data_ = this.rowList[this.currentRow]
                }
              }
            }, icon)
          }
        },
        {title: '话术名称', key: 'descName', sortable: true},
        {
          title: '场景类型',
          key: 'sceneTypeId',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h('div', this.sceneTypes[params.row.sceneTypeId])
          }
        },
        {title: '开始时间', key: 'startTime', sortable: true, align: 'center'},
        {title: '结束时间', key: 'endTime', sortable: true, align: 'center'},
        {
          title: '开关状态',
          key: 'status',
          align: 'center',
          sortable: true,
          width: 105,
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: this.rowList[params.index].status,
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
            return h('div', params.row.verify > 0 ? '已审核' : '待审核')
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
                  icon: params.row.verify ? 'reply' : 'checkmark',
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
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/word/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.events = res.data.data.events
        this.currentRow = -1
        this.editMode = false
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.descName = ''
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
      this.searchInfo.status = null
      this.searchInfo.verify = null
      this.searchInfo.sceneTypeId = null
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
    // 话术审核
    audit (rowData) {
      this.$httpReq('/word/audit/' + rowData.id, {}, 'edit', (res) => {
        this.$Message.success('话术审核操作成功')
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
.label1 {
  text-align: right;
  padding-right: 8px;
  width: 94px;
  display: inline-block;
  cursor: pointer;
  font-size: 12px;
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
