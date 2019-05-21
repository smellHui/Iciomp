<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">作业名称</i-col>
      <i-col span="5"><Input type="text" placeholder="请输入作业名称" v-model="searchInfo.jobName"/></i-col>
      <i-col span="3" class="label">作业分组</i-col>
      <i-col span="5"><Input type="text" placeholder="请输入作业分组" v-model="searchInfo.jobGroup"/></i-col>
      <i-col span="3" class="label">作业状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.jobStatus" clearable placeholder="请选择作业状态" style="width:auto">
          <Option value="NORMAL">正常</Option>
          <Option value="PAUSED">暂停</Option>
        </Select>
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
      <i-col span="12">
        <div class="title"><Icon type="ios-list"/> 作业任务列表</div>
      </i-col>
      <i-col span="12" style="text-align:right;padding-right:10px">
        <Button v-if="this.$store.state.currentLevel&8" icon="ios-add" type="primary" size="small" @click="clickAdd">新增任务</Button>
        <Button v-if="this.$store.state.currentLevel&2" icon="ios-pause" type="warning" size="small" @click="pauseAll">全部暂停</Button>
        <Button v-if="this.$store.state.currentLevel&2" icon="ios-play" type="warning" size="small" @click="resumeAll">全部恢复</Button>
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
          <i-col span="12">
            <FormItem label="作业名称" prop="jobName">
              <Input placeholder="请输入作业名称" v-model="Data_.jobName" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="作业分组" prop="jobGroup">
              <Input placeholder="请输入作业分组" v-model="Data_.jobGroup" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem label="调用目标类" prop="clazz">
              <Input type="text" placeholder="请输入调用目标类全名" v-model="Data_.clazz" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="作业类型">
              <Select v-model="Data_.jobType" clearable placeholder="请选择作业类型" :disabled="!editMode">
                <Option value="simpleTrigger">SimpleTrigger</Option>
                <Option value="cronTrigger">CronTrigger</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row v-if="Data_.jobType==='cronTrigger'">
          <i-col span="12">
            <FormItem label="表达式">
              <Input type="text" placeholder="请输入CRON表达式" v-model="Data_.cronExpression" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12" style="padding-left:30px;line-height:30px;">
            <a href="http://cron.qqe2.com/" target="_blank">在线生成表达式</a>
          </i-col>
        </Row>
        <Row v-else>
          <i-col span="12">
            <FormItem label="间隔时间">
              <InputNumber type="text" :max="maxValue" :min="minValue" placeholder="输入数值" v-model="Data_.timeValue" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="时间类型">
              <Select v-model="Data_.timeType" clearable placeholder="请选择时间类型" style="width:auto" :disabled="!editMode">
                <Option value="秒">秒</Option>
                <Option value="分">分</Option>
                <Option value="时">时</Option>
                <Option value="天">天</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem label="描述" prop="topic">
              <Input type="textarea" :disabled="!editMode" :autosize="{minRows: 4,maxRows: 6}" placeholder="请在此输入作业描述信息" v-model="Data_.jobDesc"/>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'Jobs',
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        jobName: '',
        jobGroup: '',
        jobStatus: null
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
        jobName: '',
        jobGroup: '',
        clazz: '',
        jobStatus: 0,
        jobType: null,
        cronExpression: '',
        timeType: '',
        timeValue: 0,
        jobDesc: ''
      },
      // 数据项绑定
      Data_: {
        jobName: '',
        jobGroup: '',
        clazz: '',
        jobStatus: 0,
        jobType: null,
        cronExpression: '',
        timeType: '',
        timeValue: 0,
        jobDesc: ''
      },
      // 新增数据表单验证规则
      rules: {
        jobName: [
          {required: true, message: '作业名称不能为空！', trigger: 'blur, change'}
        ],
        jobGroup: [
          {required: true, message: '作业分组不能为空！', trigger: 'blur, change'}
        ],
        clazz: [
          {required: true, message: '调用目标类全名不能为空！', trigger: 'blur, change'}
        ]
      },
      // 当前编辑行索引
      currentRow: -1,
      // 对话框标题
      modalTitle: '新增作业任务',
      // 编辑模式
      editMode: false,
      // 当前页数据项列表数据
      rowList: [],
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
                    this.modalTitle = '查看作业任务详情'
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
                    this.modalTitle = '查看作业任务详情'
                    this.currentRow = params.index
                    this.editMode = false
                    this.showModal = true
                  }
                }
              }, icon)
            }
          }
        },
        {title: '作业名称', key: 'jobName', sortable: true, align: 'center'},
        {title: '作业分组', key: 'jobGroup', sortable: true, align: 'center'},
        {title: '调用目标类', key: 'clazz', sortable: true, align: 'center'},
        {title: '任务类型', key: 'jobType', sortable: true, align: 'center'},
        {
          title: '状态',
          key: 'jobStatus',
          align: 'center',
          sortable: true,
          width: 105,
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: this.rowList[params.index].jobStatus,
                trueValue: 'NORMAL',
                falseValue: 'PAUSED',
                disabled: (this.$store.state.currentLevel & 2) === 0,
                size: 'large'
              },
              on: {
                'on-change': (val) => {
                  this.rowList[params.index].jobStatus = val
                  params.row.status = val
                  this.setStatus(params.row)
                }
              }
            }, [
              h('span', {slot: 'open'}, '正常'),
              h('span', {slot: 'close'}, '暂停')
            ])
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
                      this.modalTitle = '保存作业任务信息'
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
                        this.modalTitle = '修改作业任务'
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
                        this.modalTitle = '修改作业任务'
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
  computed: {
    minValue () {
      if (this.Data_.timeType === '天') {
        return 1
      } else {
        return 0
      }
    },
    maxValue () {
      if (this.Data_.timeType === '天') {
        return 31
      } else if (this.Data_.timeType === '时') {
        return 23
      } else {
        return 59
      }
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
          content: '您修改的作业任务数据还未保存，您确认要放弃保存而去新建作业任务吗？',
          onOk: () => {
            this.modalTitle = '新增作业任务'
            this.currentRow = -1
            this.showModal = true
          }
        })
      } else {
        this.modalTitle = '新增作业任务'
        this.currentRow = -1
        this.editMode = true
        this.showModal = true
      }
    },
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/job/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.currentRow = -1
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.jobName = ''
      this.searchInfo.jobGroup = ''
      this.searchInfo.jobStatus = null
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
      this.$httpReq('/job/' + this.Data_.id, {rowData: this.Data_}, 'edit', (res) => {
        this.$Message.success('修改后作业任务数据已成功保存！')
        this.getData()
      })
    },
    // 删除数据，点击“删除”按钮时触发
    delRow (rowData) {
      this.$httpReq('/job/' + rowData.id, '', 'del', (res) => {
        this.$Message.success('所选作业任务已成功删除！')
        this.getData()
      })
    },
    // 新增数据，点击新增模态对话框“确认”按钮时触发
    addRow () {
      this.$httpReq('/job/0', {rowData: this.Data_}, 'add', (res) => {
        this.$Message.success('作业任务已成功新增！')
        this.getData()
        this.newRow.jonName = ''
        this.newRow.jobGroup = ''
        this.newRow.clazz = ''
        this.newRow.cronExpression = ''
        this.newRow.jobType = null
        this.newRow.timeType = null
        this.newRow.timeValue = 0
        this.newRow.jobDesc = ''
      })
    },
    // 暂停、恢复作业任务
    setStatus (rowData) {
      let url = '/job/' + (rowData.jobStatus === 'NORMAL' ? 'pause/' : 'resume/') + rowData.id
      this.$httpReq(url, {}, 'edit', (res) => {
        this.$Message.success(res.data.msg)
        this.getData()
      })
    },
    // 暂停所有作业任务
    pauseAll () {
      this.$httpReq('/job/pauseAll', {}, 'edit', (res) => {
        this.$Message.success(res.data.msg)
        this.getData()
      })
    },
    // 恢复所有作业任务
    resumeAll () {
      this.$httpReq('/job/resumeAll', {}, 'edit', (res) => {
        this.$Message.success(res.data.msg)
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
