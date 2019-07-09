<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">事件名称</i-col>
      <i-col span="5"><Input type="text" placeholder="请输入原始事件名称" v-model="searchInfo.eventName"/></i-col>
      <i-col span="3" class="label">事件状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.status" clearable placeholder="请选择事件状态" style="width:auto">
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
      <i-col span="3" class="label">归属协议</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.protocol" clearable placeholder="请选择事件归属协议">
          <Option v-for="(item,index) in protocols" :key="index" :value="item">{{item}}</Option>
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
        <div class="title"><Icon type="ios-list"/> 原始事件列表</div>
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
      <Form ref="Data_" :label-width="100" :rules="rules" :model="Data_">
        <div class="title">基础配置</div>
        <Row>
          <i-col span="13">
            <FormItem label="事件名称" prop="eventName">
              <Input placeholder="请输入原始事件名称" v-model="Data_.eventName" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="11">
            <FormItem label="归属协议" prop="protocol">
              <Select placeholder="请选择事件的归属协议" v-model="Data_.protocol" clearable :disabled="!editMode">
                <Option v-for="(item,index) in protocols" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="13">
            <FormItem label="Topic" prop="topic">
              <Input type="text" placeholder="请输入事件的Topic" v-model="Data_.topic" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="11">
            <FormItem label="事件开关状态">
              <i-switch size="large" v-model="Data_.status" :true-value="1" :false-value="0" :disabled="!editMode">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </FormItem>
          </i-col>
        </Row>
        <div class="title" style="margin-bottom:5px">维度配置</div>
        <Table :columns="dimensionCols" :data="Data_.dimensions" border></Table>
        <div class="title" style="margin-top:5px;margin-bottom:5px">备注</div>
        <Input type="textarea" :disabled="!editMode" :autosize="{minRows: 3,maxRows: 5}" placeholder="请在此输入原始事件备注" v-model="Data_.remark"/>
        <template v-if="!editMode">
          <div class="title" style="margin-top:5px;margin-bottom:5px">其他信息</div>
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
  name: 'EventsAudit',
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        eventName: '',
        startTime: '',
        endTime: '',
        protocol: null,
        status: null,
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
      // 数据项绑定
      Data_: {
        eventName: '',
        topic: '',
        protocol: null,
        status: 0,
        remark: '',
        dimensions: []
      },
      // 新增数据表单验证规则
      rules: {
        eventName: [
          {required: true, message: '事件名称不能为空！', trigger: 'blur, change'}
        ],
        topic: [
          {required: true, message: 'Topic不能为空！', trigger: 'blur, change'}
        ],
        protocol: [
          {required: true, message: '归属协议不能为空！', trigger: 'blur, change'}
        ]
      },
      // 当前编辑行索引
      currentRow: -1,
      // 对话框标题
      modalTitle: '查看原始事件详情',
      // 编辑模式
      editMode: false,
      // 当前页数据项列表数据
      rowList: [],
      // 协议选项数组
      protocols: ['Table', 'WebService', 'Queue'],
      // 维度值类型选项
      valueTypes: {'0': '整形数值(int)', '1': '浮点型(double)', '2': '字符型(String)', '3': '数组型(Array)', '4': '布尔型(Boolean)'},
      // 事件维度列表栏目定义
      dimensionCols: [
        {
          title: '维度名称',
          key: 'dimensionName',
          align: 'center',
          className: 'padding8cell',
          width: 270,
          render: (h, params) => {
            let retCont = []
            if (params.index < this.Data_.dimensions.length - 1) {
              retCont.push(h('Button', {
                props: {icon: 'ios-remove', size: 'small', disabled: !this.editMode},
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '删除行确认',
                      content: '您确认要删除它吗？',
                      onOk: () => {
                        this.Data_.dimensions.splice(params.index, 1)
                      }
                    })
                  }
                }
              }))
              retCont.push(h('Input', {
                props: {
                  type: 'text',
                  size: 'small',
                  placeholder: '请输入维度名称',
                  disabled: !this.editMode,
                  value: params.row.dimensionName
                },
                style: {
                  width: '215px',
                  marginLeft: '8px'
                },
                on: {
                  'on-change': (ev) => {
                    params.row.dimensionName = ev.target.value
                    this.Data_.dimensions[params.index] = params.row
                  }
                }
              }))
            } else {
              retCont.push(h('Button', {
                props: {icon: 'ios-add', size: 'small', disabled: !this.editMode},
                on: {
                  click: () => {
                    if (params.index === 0 || (
                      this.Data_.dimensions[params.index - 1].dimensionName !== '' &&
                      this.Data_.dimensions[params.index - 1].dimensionCode !== '' &&
                      this.Data_.dimensions[params.index - 1].dimensionValueType !== '')) {
                      this.Data_.dimensions.push({dimensionName: '', dimensionCode: '', dimensionValueType: ''})
                    } else {
                      this.$Message.error('上一行为空，不能添加新行！')
                    }
                  }
                }
              }))
            }
            return h('div', {style: {textAlign: 'left'}}, retCont)
          }
        },
        {
          title: '维度编码',
          key: 'dimensionCode',
          align: 'center',
          className: 'padding8cell',
          render: (h, params) => {
            if (params.index < this.Data_.dimensions.length - 1) {
              return h('Input', {
                props: {
                  type: 'text',
                  size: 'small',
                  placeholder: '请输入维度编码',
                  disabled: !this.editMode,
                  value: params.row.dimensionCode
                },
                on: {
                  'on-change': (ev) => {
                    params.row.dimensionCode = ev.target.value
                    this.Data_.dimensions[params.index] = params.row
                  }
                }
              })
            } else {
              return h('span', '')
            }
          }
        },
        {
          title: '维度值类型',
          key: 'dimensionValueType',
          align: 'center',
          className: 'padding8cell',
          render: (h, params) => {
            if (params.index < this.Data_.dimensions.length - 1) {
              let opts = []
              for (let key in this.valueTypes) {
                opts.push(h('Option', {props: {value: key}}, this.valueTypes[key]))
              }
              return h('Select', {
                props: {
                  size: 'small',
                  placeholder: '请选择维度值类型',
                  disabled: !this.editMode,
                  value: params.row.dimensionValueType,
                  transfer: true
                },
                on: {
                  'on-change': (val) => {
                    params.row.dimensionValueType = val
                    this.Data_.dimensions[params.index] = params.row
                  }
                }
              }, opts)
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
                  this.modalTitle = '查看原始事件详情'
                  this.currentRow = params.index
                  this.showModal = true
                }
              }
            }, icon)
          }
        },
        {title: '事件名称', key: 'eventName', sortable: true, align: 'center'},
        {title: 'Topic', key: 'topic', sortable: true, align: 'center'},
        {title: '归属协议', key: 'protocol', sortable: true, align: 'center'},
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
          key: 'verify',
          sortable: true,
          align: 'center',
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
  },
  methods: {
    // 模态对话框显示状态改变时触发
    visibleChange (show) {
      if (show) {
        this.Data_ = this.rowList[this.currentRow]
        let blankLine = {dimensionName: '', dimensionCode: '', dimensionValueType: ''}
        if (this.Data_.dimensions.length < 1) {
          this.Data_.dimensions = [blankLine]
        } else {
          let lastLine = this.Data_.dimensions[this.Data_.dimensions.length - 1]
          if (lastLine.dimensionName !== blankLine.dimensionName ||
            lastLine.dimensionCode !== blankLine.dimensionCode ||
            lastLine.dimensionValueType !== blankLine.dimensionValueType) {
            this.Data_.dimensions.push(blankLine)
          }
        }
      }
    },
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/event/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.editRow = -1
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.eventName = ''
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
      this.searchInfo.protocol = ''
      this.searchInfo.status = ''
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
      this.$httpReq('/event/audit/' + rowData.id, {}, 'edit', (res) => {
        this.$Message.success('原始事件审核操作成功')
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
  padding: 5px;
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
