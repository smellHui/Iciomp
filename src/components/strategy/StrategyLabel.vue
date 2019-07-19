<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="2" class="label">标签目录</i-col>
      <i-col span="4"><Input type="text" placeholder="请输入策略标签目录" clearable v-model="searchInfo.strategyLabelMenu"/></i-col>
      <i-col span="2" class="label">标签名称</i-col>
      <i-col span="4"><Input type="text" placeholder="请输入策略标签名称" clearable v-model="searchInfo.strategyLabelName"/></i-col>
      <i-col span="2" class="label">创建时间</i-col>
      <i-col span="10">
        <DatePicker type="datetime" placeholder="请选择开始日期和时间" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.searchInfo.startTime=val"/>
        &emsp;—&emsp;<DatePicker type="datetime" placeholder="请选择结束日期和时间" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.searchInfo.endTime=val"/>
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
        <div class="title"><Icon type="ios-list"/> 策略标签列表</div>
      </i-col>
      <i-col span="4" style="text-align:right;padding-right:10px">
        <Button v-if="this.$store.state.currentLevel&8" icon="ios-add" type="primary" size="small" @click="clickAdd">新增策略标签</Button>
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
    <Modal v-model="showModal" :title="modalTitle" width="680"
      :okText="editMode?'保存':'关闭'"
      cancelText="取消" :styles="{top: 0}"
      @on-visible-change="visibleChange"
      @on-ok="clickOk">
      <Form ref="Data_" :label-width="100" :rules="rules" :model="Data_">
        <Row>
          <i-col span="24">
            <FormItem label="策略标签目录" prop="strategyLabelMenu">
              <Input placeholder="请输入策略标签目录" v-model="Data_.strategyLabelMenu" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem label="策略标签名称" prop="strategyLabelName">
              <Input type="text" placeholder="请输入策略标签名称" v-model="Data_.strategyLabelName" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem label="接口地址" prop="urlAddress">
              <Input type="url" placeholder="请输入策略标签接口地址" v-model="Data_.urlAddress" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem label="服务名" prop="serviceName">
              <Input type="text" placeholder="请输入策略标签服务名" v-model="Data_.serviceName" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem label="绑定参数">
              <Input type="textarea" :disabled="!editMode" :autosize="{minRows: 3,maxRows: 5}" placeholder="请在此输入策略标签绑定的参数" v-model="Data_.labelParams"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem label="描述">
              <Input type="textarea" :disabled="!editMode" :autosize="{minRows: 3,maxRows: 5}" placeholder="请在此输入策略标签的描述信息" v-model="Data_.remark"/>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'StrategyLabel',
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        strategyLabelMenu: '',
        strategyLabelName: '',
        startTime: '',
        endTime: ''
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
        strategyLabelMenu: '',
        strategyLabelName: '',
        urlAddress: '',
        serviceName: '',
        labelParams: '',
        remark: ''
      },
      // 数据项绑定
      Data_: {
        strategyLabelMenu: '',
        strategyLabelName: '',
        urlAddress: '',
        serviceName: '',
        labelParams: '',
        remark: ''
      },
      // 新增数据表单验证规则
      rules: {
        strategyLabelMenu: [
          {required: true, message: '策略标签目录不能为空！', trigger: 'blur, change'}
        ],
        strategyLabelName: [
          {required: true, message: '策略标签名称不能为空！', trigger: 'blur, change'}
        ],
        urlAddress: [
          {required: true, message: '接口地址不能为空！', trigger: 'blur, change'}
        ]
      },
      // 当前编辑行索引
      currentRow: -1,
      // 对话框标题
      modalTitle: '新增策略标签',
      // 编辑模式
      editMode: false,
      // 当前页数据项列表数据
      rowList: [],
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
                    this.modalTitle = '查看策略标签详情'
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
                    this.modalTitle = '查看策略标签详情'
                    this.currentRow = params.index
                    this.editMode = false
                    this.showModal = true
                  }
                }
              }, icon)
            }
          }
        },
        {title: '策略标签目录', key: 'strategyLabelMenu', sortable: true, align: 'center'},
        {title: '策略标签名称', key: 'strategyLabelName', sortable: true, align: 'center'},
        {title: '服务地址', key: 'urlAddress', sortable: true, align: 'center'},
        {title: '服务名', key: 'serviceName', sortable: true, align: 'center'},
        {title: '参数', key: 'labelParams', sortable: true, align: 'center'},
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
                      this.modalTitle = '保存策略标签信息'
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
                        this.modalTitle = '修改策略标签'
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
                        this.modalTitle = '修改策略标签'
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
    // 点击“新增事件”按钮时触发
    clickAdd () {
      if (this.editMode && this.currentRow >= 0) {
        this.$Modal.confirm({
          title: '确认放弃保存',
          content: '您修改的策略标签数据还未保存，您确认要放弃保存而去新建策略标签吗？',
          onOk: () => {
            this.modalTitle = '新增策略标签'
            this.currentRow = -1
            this.showModal = true
          }
        })
      } else {
        this.modalTitle = '新增策略标签'
        this.currentRow = -1
        this.editMode = true
        this.showModal = true
      }
    },
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/strategyLabel/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.currentRow = -1
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.strategyLabelMenu = ''
      this.searchInfo.strategyLabelName = ''
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
    // 保存修改数据，点击模态对话框“保存”按钮时触发
    saveRow () {
      this.$httpReq('/strategyLabel/' + this.Data_.id, {rowData: this.Data_}, 'edit', (res) => {
        this.$Message.success('修改后策略标签数据已成功保存！')
        this.getData()
      })
    },
    // 删除数据，点击“删除”按钮时触发
    delRow (rowData) {
      this.$httpReq('/strategyLabel/' + rowData.id, '', 'del', (res) => {
        this.$Message.success('所选策略标签已成功删除！')
        this.getData()
      })
    },
    // 新增数据，点击新增模态对话框“确认”按钮时触发
    addRow () {
      this.$httpReq('/strategyLabel/0', {rowData: this.Data_}, 'add', (res) => {
        this.$Message.success('策略标签已成功新增！')
        this.getData()
        this.newRow.strategyLabelMenu = ''
        this.newRow.strategyLabelName = ''
        this.newRow.urlAddress = ''
        this.newRow.serviceName = ''
        this.newRow.labelParams = ''
        this.newRow.remark = ''
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
