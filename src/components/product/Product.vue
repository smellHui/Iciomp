<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">产品名称</i-col>
      <i-col span="5"><Input type="text" placeholder="请输入产品名称" v-model="searchInfo.name"/></i-col>
      <i-col span="3" class="label">产品状态</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.status" clearable placeholder="请选择审核状态" style="width:auto">
          <Option value="0">关闭</Option>
          <Option value="1">开启</Option>
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
      <i-col span="3" class="label">产品类型</i-col>
      <i-col span="5">
        <Select v-model="searchInfo.typeId" clearable placeholder="请选择产品类型">
          <Option v-for="(item,key) in productTypes" :key="key" :value="key">{{item}}</Option>
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
      <i-col span="20">
        <div class="title"><Icon type="ios-list"/> 产品列表</div>
      </i-col>
      <i-col span="4" style="text-align:right;padding-right:10px">
        <Button icon="ios-plus-empty" type="primary" size="small" @click="clickAdd">新增产品</Button>
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
        <div class="title">基础配置</div>
        <Row>
          <i-col span="12">
            <FormItem label="产品名称" prop="name">
              <Input placeholder="请输入产品名称" v-model="Data_.name" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="产品类型">
              <Select v-model="Data_.typeId" placeholder="请选择产品类型" clearable :disabled="!editMode">
                <Option v-for="(item,key) in productTypes" :key="key" :value="key">{{item}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="订购代码">
              <Input placeholder="请输入产品订购代码" v-model="Data_.orderCode" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="推广URL">
              <Input placeholder="请输入产品推广URL" v-model="Data_.url" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="营销周期">
              <InputNumber placeholder="请填写产品营销周期" :max="10" :min="0" v-model="Data_.marketingCycle" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="最大营销次数">
              <InputNumber placeholder="请填写周期内产品最大营销次数" :max="10" :min="0" v-model="Data_.limitCycle" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="描述参数">
              <Input placeholder="请输入产品的描述参数" v-model="Data_.descParams" :disabled="!editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <label class="label1">定价ID</label>
            <Input placeholder="请输入产品的定价ID" v-model="Data_.priceId" :disabled="!editMode" style="width:auto"/>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="开始时间" prop="startTime">
              <DatePicker type="datetime" :disabled="!editMode" :value="Data_.startTime" placeholder="请选择开始日期和时间" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.Data_.startTime=val"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="结束时间" prop="endTime">
              <DatePicker type="datetime" :disabled="!editMode" :value="Data_.endTime" placeholder="请选择开始日期和时间" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>this.Data_.endTime=val"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <FormItem label="产品描述语">
              <Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入产品的描述语" v-model="Data_.desc" :disabled="!editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <div class="title">适用性配置</div>
        <div style="line-height:30px">
          <Row>
            <i-col span="24">
              <CheckboxGroup v-model="Data_.suitableCustomer">
                <label class="label1">用户类型</label>
                <Checkbox v-for="(item,index) in customerTypes" :key="index" :label="item" :disabled="!editMode">{{item}}</Checkbox>
              </CheckboxGroup>
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <RadioGroup v-model="Data_.suitableChannel">
                <label class="label1">适用渠道</label>
                <Radio v-for="(item,key) in channels" :key="key" :label="key" :disabled="!editMode">{{item}}</Radio>
              </RadioGroup>
            </i-col>
          </Row>
          <Row>
            <i-col span="24">
              <label class="label1">适用地市</label>
              <Checkbox :indeterminate="indeterminate" v-model="checkAll" :disabled="!editMode" @on-change="checkAllChange">全选</Checkbox>
              <CheckboxGroup style="margin-left:98px" v-model="Data_.suitableCity">
                <Checkbox v-for="(item,index) in areas" :key="index" :label="item" :disabled="!editMode">{{item}}</Checkbox>
              </CheckboxGroup>
            </i-col>
          </Row>
        </div>
        <div class="title" style="margin-top:5px;margin-bottom:5px">备注</div>
        <Input type="textarea" :disabled="!editMode" :autosize="{minRows: 3,maxRows: 5}" placeholder="请在此输入产品备注" v-model="Data_.remark"/>
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
  name: 'Product',
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        name: '',
        startTime: '',
        endTime: '',
        status: null,
        typeId: null,
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
        name: '',
        typeId: null,
        desc: '',
        orderCode: '',
        url: '',
        descParams: '',
        suitableCity: [],
        suitableCustomer: [],
        suitableChannel: null,
        marketingCycle: 0,
        limitCycle: 0,
        priceId: '',
        startTime: null,
        endTime: null,
        remark: ''
      },
      Data_: {
        name: '',
        typeId: null,
        desc: '',
        orderCode: '',
        url: '',
        descParams: '',
        suitableCity: [],
        suitableCustomer: [],
        suitableChannel: null,
        marketingCycle: 0,
        limitCycle: 0,
        priceId: '',
        startTime: null,
        endTime: null,
        remark: ''
      },
      // 新增数据表单验证规则
      rules: {
        name: [{required: true, message: '产品名称不能为空！', trigger: 'blur, change'}],
        startTime: [{required: true, message: '开始时间不能为空！', trigger: 'blur, change'}],
        endTime: [{required: true, message: '结束时间不能为空！', trigger: 'blur, change'}]
      },
      // 当前编辑行索引
      currentRow: -1,
      // 对话框标题
      modalTitle: '新增产品',
      // 当前页数据项列表数据
      rowList: [],
      // 编辑模式
      editMode: false,
      // 事件选项
      events: {},
      // 产品类型选项
      productTypes: {'10': '产品类别一', '11': '产品类别二', '12': '产品类别三', '13': '产品类别四'},
      // 用户类型数组
      customerTypes: ['移动', '宽带', '宽带融合', 'ITV'],
      // 付费类型数组
      channels: {'10': '开放渠道', '11': '电子渠道'},
      // 区域数组
      areas: ['武汉', '襄阳', '黄冈', '宜昌', '孝感', '鄂州', '咸宁', '十堰',
        '荆门', '黄石', '随州', '恩施', '仙桃', '天门', '潜江', '神农架', '荆州'
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
                    this.modalTitle = '查看产品详情'
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
                    this.modalTitle = '查看产品详情'
                    this.currentRow = params.index
                    this.editMode = false
                    this.showModal = true
                  }
                }
              }, icon)
            }
          }
        },
        {title: '产品名称', key: 'name', sortable: true},
        {
          title: '产品类型',
          key: 'typeId',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h('div', this.productTypes[params.row.typeId])
          }
        },
        {
          title: '订购代码',
          key: 'orderCode',
          sortable: true,
          align: 'center'
        },
        {
          title: '定价ID',
          key: 'priceId',
          sortable: true,
          align: 'center'
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
            return h('div', params.row.verify > 0 ? '已审核' : '待审核')
          }
        },
        // 定义操作按钮列（开始）
        {
          title: '操作',
          align: 'center',
          width: 125,
          render: (h, params) => {
            let btns = []
            if (this.$store.state.currentLevel & 2) {
              if (this.editMode && params.index === this.currentRow) {
                btns.push(h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.modalTitle = '保存营销机会信息'
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
                        this.modalTitle = '修改营销机会'
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
                        this.modalTitle = '修改营销机会'
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
            if (this.$store.state.currentLevel & 4) {
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
    indeterminate () {
      if (!this.Data_.suitableCity || this.Data_.suitableCity.length === 0 || this.Data_.suitableCity.length === this.areas.length) {
        return false
      } else {
        return true
      }
    },
    checkAll: {
      get () {
        if (this.indeterminate || !this.Data_.suitableCity) {
          return false
        } else if (this.Data_.suitableCity.length === this.areas.length) {
          return true
        } else {
          return false
        }
      },
      set () {}
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
        if (!this.Data_.suitableCity) {
          this.Data_.suitableCity = []
        }
        if (!this.Data_.suitableCustomer) {
          this.Data_.suitableCustomer = []
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
    // 点击“新增营销机会”按钮时触发
    clickAdd () {
      if (this.editMode && this.currentRow >= 0) {
        this.$Modal.confirm({
          title: '确认放弃保存',
          content: '您修改的产品信息数据还未保存，您确认要放弃保存而去新增产品吗？',
          onOk: () => {
            this.modalTitle = '新增产品'
            this.currentRow = -1
            this.showModal = true
          }
        })
      } else {
        this.modalTitle = '新增产品'
        this.currentRow = -1
        this.editMode = true
        this.showModal = true
      }
    },
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/product/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.events = res.data.data.events
        this.currentRow = -1
        this.editMode = false
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.chanceName = ''
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
      this.searchInfo.typeId = ''
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
    // 保存修改数据，点击模态对话框“保存”按钮时触发
    saveRow () {
      this.$httpReq('/product/' + this.Data_.id, {rowData: this.Data_}, 'edit', (res) => {
        this.$Message.success('修改后产品信息数据已成功保存！')
        this.getData()
      })
    },
    // 删除数据，点击“删除”按钮时触发
    delRow (rowData) {
      this.$httpReq('/product/' + rowData.id, '', 'del', (res) => {
        this.$Message.success('所选产品已成功删除！')
        this.getData()
      })
    },
    // 新增数据，点击模态对话框“保存”按钮时触发
    addRow () {
      this.$httpReq('/product/0', {rowData: this.Data_}, 'add', (res) => {
        this.$Message.success('产品已成功新增！')
        this.getData()
        this.newRow.name = ''
        this.newRow.typeId = null
        this.newRow.desc = ''
        this.newRow.url = ''
        this.newRow.descParams = ''
        this.newRow.orederCode = ''
        this.newRow.suitableCity = []
        this.newRow.suitableCustomer = []
        this.newRow.suitableChannel = null
        this.newRow.marketingCycle = 0
        this.newRow.limitCycle = 0
        this.newRow.priceId = ''
        this.newRow.startTime = null
        this.newRow.endTime = null
        this.newRow.remark = ''
      })
    },
    // 区域全选复选框状态改变时触发
    checkAllChange (val) {
      this.Data_.suitableCity = val ? this.areas : []
    },
    // 设置营销机会开关状态
    setStatus (rowData) {
      this.$httpReq('/product/setStatus/' + rowData.id, {}, 'edit', (res) => {
        this.$Message.success('产品状态修改成功')
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
