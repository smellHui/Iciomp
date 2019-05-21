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
        <Button icon="ios-refresh" type="primary" shape="circle" size="small" @click.native="clearSearchInfo">重&emsp;置</Button>
      </i-col>
    </Row>
    <!-- 数据列表  -->
    <Row class="row">
      <i-col span="20">
        <div class="title"><Icon type="ios-list"/> 话术列表</div>
      </i-col>
      <i-col span="4" style="text-align:right;padding-right:10px">
        <Button icon="ios-add" type="primary" size="small" @click="clickAdd">新增话术</Button>
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
    <!-- 新增对话框 -->
    <Modal v-model="showModal" :title="modalTitle" width="580"
      :okText="editMode?'保存':'关闭'"
      cancelText="取消" :styles="{top: 0}"
      @on-visible-change="visibleChange"
      @on-ok="clickOk">
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
          <Input type="textarea" :disabled="!editMode" :autosize="{minRows: 3,maxRows: 5}" placeholder="请在此输入话术备注" v-model="Data_.remark"/>
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
      // 新增数据项数据
      newRow: {
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
      // 当前编辑行索引
      currentRow: -1,
      // 对话框标题
      modalTitle: '新建话术',
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
            if (this.editMode && this.currentRow >= 0) {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '有数据未保存，您确定要放弃保存而查看本行吗？',
                  placement: 'right',
                  width: 200,
                  transfer: true
                },
                style: {
                  padding: 0,
                  cursor: 'pointer'
                },
                on: {
                  'on-ok': () => {
                    this.modalTitle = '查看话术详情'
                    this.currentRow = params.index
                    this.editMode = false
                    this.showModal = true
                  }
                }
              }, icon)
            } else {
              return h('div', {
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.modalTitle = '查看话术详情'
                    this.currentRow = params.index
                    this.editMode = false
                    this.showModal = true
                  }
                }
              }, icon)
            }
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
                disabled: (this.$store.state.currentLevel & 2) === 0
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
          width: 125,
          render: (h, params) => {
            let btns = []
            if ((this.$store.state.currentLevel & 2) && !params.row.verify) {
              if (this.editMode && params.index === this.currentRow) {
                btns.push(h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.modalTitle = '保存话术信息'
                      this.editMode = true
                      this.showModal = true
                    }
                  }
                }, '保存'))
              } else {
                if (!this.editMode || this.currentRow < 0) {
                  btns.push(h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.currentRow = params.index
                        this.modalTitle = '修改话术'
                        this.editMode = true
                        this.showModal = true
                      }
                    }
                  }, '修改'))
                } else {
                  btns.push(h('Poptip', {
                    props: {
                      confirm: true,
                      title: '有数据未保存，您确定要放弃保存而修改本行吗？',
                      placement: 'left',
                      width: 200,
                      transfer: true
                    },
                    on: {
                      'on-ok': () => {
                        this.currentRow = params.index
                        this.modalTitle = '修改话术'
                        this.editMode = true
                        this.showModal = true
                      }
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      }
                    }, '修改')
                  ]))
                }
              }
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
  },
  methods: {
    // 模态对话框显示状态改变时触发
    visibleChange (show) {
      if (show) {
        if (this.currentRow < 0) {
          this.Data_ = this.newRow
        } else {
          this.Data_ = this.rowList[this.currentRow]
        }
      } else if (this.editMode) {
        if (this.currentRow < 0) {
          this.newRow = this.Data_
        } else {
          this.rowList[this.currentRow] = this.Data_
        }
      }
    },
    // 点击模态对话框“确认”按钮时触发
    clickOk () {
      if (this.editMode) {
        this.$refs['Data_'].validate((valid) => {
          if (valid) {
            if (this.currentRow < 0) {
              this.addRow()
            } else {
              this.saveRow()
            }
          } else {
            this.$Message.error('数据校验有误，请修改后再保存！')
            setTimeout(() => {
              this.showModal = true
            }, 50)
          }
        })
      }
    },
    // 点击“新增话术”按钮时触发
    clickAdd () {
      if (this.editMode && this.currentRow >= 0) {
        this.$Modal.confirm({
          title: '确认放弃保存',
          content: '您修改的话术数据还未保存，您确认要放弃保存而去新建话术吗？',
          onOk: () => {
            this.modalTitle = '新建话术'
            this.currentRow = -1
            this.showModal = true
          }
        })
      } else {
        this.modalTitle = '新建话术'
        this.currentRow = -1
        this.editMode = true
        this.showModal = true
      }
    },
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
    // 保存修改数据，点击模态对话框“保存”按钮时触发
    saveRow () {
      this.$httpReq('/word/' + this.Data_.id, {rowData: this.Data_}, 'edit', (res) => {
        this.$Message.success('修改后话术数据已成功保存！')
        this.getData()
      })
    },
    // 删除数据，点击“删除”按钮时触发
    delRow (rowData) {
      this.$httpReq('/word/' + rowData.id, '', 'del', (res) => {
        this.$Message.success('所选话术已成功删除！')
        this.getData()
      })
    },
    // 新增数据，点击模态对话框“保存”按钮时触发
    addRow () {
      this.$httpReq('/word/0', {rowData: this.Data_}, 'add', (res) => {
        this.$Message.success('新话术已成功创建！')
        this.getData()
        this.newRow.descName = ''
        this.newRow.sceneTypeId = null
        this.newRow.prependword = ''
        this.newRow.content = ''
        this.newRow.appendWord = ''
        this.newRow.suitableChannel = null
        this.newRow.startTime = ''
        this.newRow.remark = ''
        this.newRow.endTime = ''
      })
    },
    // 设置话术开关状态
    setStatus (rowData) {
      this.$httpReq('/word/setStatus/' + rowData.id, {}, 'edit', (res) => {
        this.$Message.success('话术开关状态修改成功')
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
