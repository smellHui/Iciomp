<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">营销事件名称</i-col>
      <i-col span="5"><Input type="text" placeholder="请输入营销事件名称" v-model="searchInfo.marketingName"/></i-col>
      <i-col span="3" class="label">营销事件类型</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.marketingType" clearable placeholder="请选择营销事件类型" style="width:auto">
          <Option v-for="(item,key) in marketingTypes" :key="key" :value="key">{{item}}</Option>
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
      <i-col span="3" class="label">原始事件名称</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.oreventId" clearable placeholder="请选择原始事件名称">
          <Option v-for="(item,key) in events" :key="key" :value="key">{{item}}</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">创建时间</i-col>
      <i-col span="13">
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
      <i-col span="24">
        <div class="title"><Icon type="ios-list"/> 营销事件列表</div>
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
      @on-visible-change="visibleChange">
      <Form ref="Data_" :label-width="110" :rules="rules" :model="Data_">
        <div class="title">基础配置</div>
        <Row>
          <i-col span="12">
            <FormItem label="营销事件名称" prop="marketingName">
              <Input placeholder="请输入营销事件名称" v-model="Data_.marketingName" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12" style="padding-left:30px">
            <FormItem label="营销事件编码" prop="marketingCode">
              <Input placeholder="请输入营销事件编码" v-model="Data_.marketingCode" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="营销事件类型" prop="marketingType">
              <AutoComplete v-model="Data_.marketingType" placeholder="请输入营销事件类型" :disabled="!editMode" clearable>
                <Option v-for="(item,key) in marketingTypes" :key="key" :value="item">{{item}}</Option>
              </AutoComplete>
            </FormItem>
          </i-col>
          <i-col span="12" style="padding-left:30px">
            <FormItem label="营销事件优先级" prop="priority">
              <InputNumber v-model="Data_.priority" :disabled="!editMode" :max="20" :min="1" :step="1"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="原始事件名称" prop="oreventId">
              <Select v-model="Data_.oreventId" placeholder="请选择原始事件名称" clearable :disabled="!editMode">
                <Option v-for="(item,key) in events" :key="key" :value="key">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <div class="title">事件生成限制日期配置</div>
        <Row style="margin:10px">
          <i-col span="24" style="line-height:25px">
            <Checkbox :indeterminate="indeterminate" :value="checkAll" :disabled="!editMode" @click.prevent.native="handleCheckAll">全选</Checkbox>
            <CheckboxGroup v-model="Data_.limitDays">
              <Checkbox v-for="item in 31" :key="item" :label="''+item" :disabled="!editMode">{{item}}</Checkbox>
            </CheckboxGroup>
          </i-col>
        </Row>
        <div class="title">事件生成频次配置</div>
        <Row style="margin-top:10px">
          <i-col span="8">
            <FormItem label="营销事件生成周期">
              <InputNumber v-model="Data_.limitCycle" :disabled="!editMode" :max="99" :min="0" :step="1"/>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="生成频次单位">
              <Select v-model="Data_.limitUnit" clearable :disabled="!editMode" style="width:auto" placeholder="选择单位">
                <Option value="D">D--天</Option>
                <Option value="M">M--月</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="生成频次值">
              <InputNumber v-model="Data_.limitNum" :disabled="!editMode" :max="99" :min="0" :step="1"/>
            </FormItem>
          </i-col>
        </Row>
        <div class="title">通用条件配置</div>
        <Collapse v-model="conditions" simple>
          <Panel v-for="(item,index) in commonCondition" :key="index" :name="item.labelType">
            <b>{{item.labelType}}</b>
            <div slot="content">
              <Row v-for="(condition,index) in item.data" :key="index"  style="margin:0 0 8px 0">
                <i-col span="5">{{condition.labelName}}</i-col>
                <i-col span="19">
                  <CheckboxGroup v-model="Data_.settings[condition.labelCode]">
                    <Checkbox v-for="(attribute,index) in condition.data" :key="index" :label="attribute.attValue" :disabled="!editMode">{{attribute.attName}}</Checkbox>
                  </CheckboxGroup>
                </i-col>
              </Row>
            </div>
          </Panel>
        </Collapse>
        <div class="title" style="margin-bottom:5px">事件维度筛选</div>
        <Table :columns="dimensionCols" :data="Data_.filters" border></Table>
        <div class="title" style="margin-top:5px;margin-bottom:5px">备注</div>
        <Input type="textarea" :disabled="!editMode" :autosize="{minRows: 3,maxRows: 5}" placeholder="请在此输入营销事件备注" v-model="Data_.remark"/>
        <template v-if="!editMode">
          <div class="title" style="margin-top:5px;margin-bottom:5px">其他</div>
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
export default {
  name: 'Opportunity',
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        marketingName: '',
        startTime: '',
        endTime: '',
        oreventId: null,
        marketingType: null,
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
        marketingName: '',
        marketingCode: '',
        marketingType: '',
        oreventId: null,
        priority: 1,
        limitDays: [],
        limitCycle: 0,
        limitUnit: null,
        limitNum: 0,
        remark: '',
        filters: [],
        settings: {}
      },
      // 数据项绑定
      Data_: {
        marketingName: '',
        marketingCode: '',
        marketingType: '',
        oreventId: null,
        priority: 1,
        limitDays: [],
        limitCycle: 0,
        limitUnit: null,
        limitNum: 0,
        remark: '',
        filters: [],
        settings: {}
      },
      // 通用条件数据
      commonCondition: [],
      // 通用条件展开面板
      conditions: [],
      // 新增数据表单验证规则
      rules: {
        marketingName: [{required: true, message: '营销事件名称不能为空！', trigger: 'blur, change'}],
        marketingCode: [{required: true, message: '营销事件编码不能为空！', trigger: 'blur, change'}],
        marketingType: [{required: true, message: '营销事件类型不能为空！', trigger: 'blur, change'}],
        oreventId: [{required: true, message: '原始事件名称不能为空！', trigger: 'blur, change'}],
        priority: [{required: true, type: 'number', message: '优先级应为1到20之间的整数！', trigger: 'blur, change'}]
      },
      // 当前编辑行索引
      currentRow: -1,
      // 对话框标题
      modalTitle: '新增营销事件',
      // 当前页数据项列表数据
      rowList: [],
      // 编辑模式
      editMode: false,
      // 原始事件选项
      events: {},
      // 事件维度选项
      eventDimenions: [],
      // 表达式类型选项
      expTypes: {'10': '等于', '11': '不等于', '12': '大于', '13': '大于等于', '14': '小于', '15': '小于等于', '16': '包含', '17': '不包含'},
      // 营销事件类型选项
      marketingTypes: [],
      // 事件维度列表栏目定义
      dimensionCols: [
        {
          title: '事件维度',
          key: 'filteName',
          align: 'center',
          className: 'padding8cell',
          width: 175,
          render: (h, params) => {
            let retCont = []
            if (params.index < this.Data_.filters.length - 1) {
              retCont.push(h('Button', {
                props: {icon: 'ios-remove', size: 'small', disabled: !this.editMode},
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '删除行确认',
                      content: '您确认要删除它吗？',
                      onOk: () => {
                        this.Data_.filters.splice(params.index, 1)
                      }
                    })
                  }
                }
              }))
              let opts = []
              for (let key in this.eventDimenions) {
                opts.push(h('Option', {props: {value: key}}, this.eventDimenions[key]))
              }
              retCont.push(h('Select', {
                props: {
                  size: 'small',
                  placeholder: '请选择事件维度',
                  disabled: !this.editMode,
                  value: params.row.dimensionId
                },
                style: {
                  display: 'inline-block',
                  width: 'auto',
                  marginLeft: '8px'
                },
                on: {
                  'on-change': (val) => {
                    params.row.dimensionId = val
                    params.row.dimensionName = this.eventDimenions[val]
                    this.Data_.filters[params.index] = params.row
                  }
                }
              }, opts))
            } else {
              retCont.push(h('Button', {
                props: {icon: 'ios-add', size: 'small', disabled: !this.editMode},
                on: {
                  click: () => {
                    if (params.index === 0 || this.Data_.filters[params.index - 1].expressValue !== '') {
                      this.Data_.filters.push({dimensionId: '', dimensionName: '', expressType: '', expressValue: ''})
                    } else {
                      this.$Message.error('上一行值为空，不能添加新行！')
                    }
                  }
                }
              }))
            }
            return h('div', {style: {textAlign: 'left'}}, retCont)
          }
        },
        {
          title: '表达式',
          key: 'expressType',
          align: 'center',
          width: 115,
          className: 'padding8cell',
          render: (h, params) => {
            if (params.index < this.Data_.filters.length - 1) {
              let opts = []
              for (let key in this.expTypes) {
                opts.push(h('Option', {props: {value: key}}, this.expTypes[key]))
              }
              return h('Select', {
                props: {
                  size: 'small',
                  placeholder: '请选择',
                  disabled: !this.editMode,
                  value: params.row.expressType,
                  transfer: true
                },
                on: {
                  'on-change': (val) => {
                    params.row.expressType = val
                    this.Data_.filters[params.index] = params.row
                  }
                }
              }, opts)
            } else {
              return h('span', '')
            }
          }
        },
        {
          title: '值',
          key: 'value',
          align: 'center',
          className: 'padding8cell',
          render: (h, params) => {
            if (params.index < this.Data_.filters.length - 1) {
              return h('Input', {
                props: {
                  type: 'text',
                  size: 'small',
                  placeholder: '输入筛选值',
                  disabled: !this.editMode,
                  value: params.row.expressValue
                },
                on: {
                  'on-change': (ev) => {
                    params.row.expressValue = ev.target.value
                    this.Data_.filters[params.index] = params.row
                  }
                }
              })
            } else {
              return h('span', '')
            }
          }
        }
      ],
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
                  this.modalTitle = '查看营销事件详情'
                  this.currentRow = params.index
                  this.showModal = true
                }
              }
            }, icon)
          }
        },
        {title: '营销事件名称', key: 'marketingName', sortable: true},
        {title: '营销事件编码', key: 'marketingCode', sortable: true, align: 'center'},
        {title: '营销事件类型', key: 'marketingType', sortable: true, align: 'center'},
        {
          title: '原始事件名称',
          key: 'oreventId',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h('div', this.events[params.row.oreventId])
          }
        },
        {title: '优先级', key: 'priority', sortable: true, align: 'center', width: 91},
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
      ]
    }
  },
  mounted () {
    this.getData()
    this.getConditionData()
  },
  computed: {
    indeterminate () {
      if (this.Data_.limitDays.length >= 31 || this.Data_.limitDays.length < 1) {
        return false
      } else {
        return true
      }
    },
    checkAll () {
      if (this.Data_.limitDays.length >= 31) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    // 模态对话框显示状态改变时触发
    visibleChange (show) {
      if (show) {
        this.Data_ = this.rowList[this.currentRow]
        this.getDimensionNames(this.Data_.oreventId)
        let blankLine = {dimensionId: '', dimensionName: '', expressType: '', expressValue: ''}
        if (this.Data_.filters.length < 1) {
          this.Data_.filters = [blankLine]
        } else {
          let lastLine = this.Data_.filters[this.Data_.filters.length - 1]
          if (lastLine.dimensionId !== blankLine.dimensionId ||
            lastLine.expressType !== blankLine.expressType ||
            lastLine.expressValue !== blankLine.expressValue) {
            this.Data_.filters.push(blankLine)
          }
        }
        if (!this.Data_.settings) {
          this.Data_.settings = {}
        }
        if (!this.Data_.limitDays) {
          this.Data_.limitDays = []
        }
      }
    },
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/marketingEvent/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.events = res.data.data.events
        this.marketingTypes = res.data.data.marketingTypes
        this.currentRow = -1
        this.editMode = false
      })
    },
    // 获取通用条件数据
    getConditionData () {
      this.$httpReq('/common/dataTags', {}, 'get', (res) => {
        this.commonCondition = res.data.data
      })
    },
    // 获取原始事件关联的维度名称列表
    getDimensionNames (eventId) {
      if (eventId === null || eventId.length !== 32) {
        this.eventDimenions = {}
      } else {
        this.$httpReq('/common/dimensions/' + eventId, {}, 'get', (res) => {
          this.eventDimenions = res.data.data
        })
      }
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.marketingName = ''
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
      this.searchInfo.marketingType = ''
      this.searchInfo.oreventId = ''
      this.searchInfo.verify = ''
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
    // 审核操作
    audit (rowData) {
      this.$httpReq('/marketingEvent/audit/' + rowData.id, {}, 'edit', (res) => {
        this.$Message.success('营销机会审核操作成功')
        this.getData()
      })
    },
    handleCheckAll () {
      if (!this.editMode) {
        return
      }
      if (this.Data_.limitDays.length >= 31) {
        this.Data_.limitDays = []
      } else {
        let checks = []
        for (let i = 1; i <= 31; i++) {
          checks.push('' + i)
        }
        this.Data_.limitDays = checks
      }
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
