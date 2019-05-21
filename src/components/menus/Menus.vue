<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">父菜单标题</i-col>
      <i-col span="5">
        <Select clearable filterable placeholder="请选择父菜单标题" v-model="searchInfo.parentID">
          <Option v-for="item in parentIds" :key="item" :value="item">{{getMenuTitle(item)}}</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">菜单标题</i-col>
      <i-col span="5"><Input type="text" clearable placeholder="请输入菜单标题" v-model="searchInfo.menuName"/></i-col>
      <i-col span="3" class="label">组件名称</i-col>
      <i-col span="5"><Input type="text" clearable placeholder="请输入组件名称" v-model="searchInfo.action"/></i-col>
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
        <div class="title"><Icon type="ios-list"/> 菜单列表</div>
      </i-col>
      <i-col span="4" style="text-align:right;padding-right:10px">
        <Button v-if="this.$store.state.currentLevel&8" icon="ios-add" type="primary" size="small" @click="showModal=true">新增菜单</Button>
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
    <Modal v-if="this.$store.state.currentLevel&8" v-model="showModal" title="新增菜单" okText="保存" cancelText="取消" :styles="{top: 0}" @on-ok="addRow">
      <Form ref="newRow" :label-width="100" :rules="rules" :model="newRow">
        <FormItem label="父菜单标题" prop="parentID">
          <Select placeholder="请选择父菜单标题" v-model="newRow.parentID" filterable>
            <Option v-for="item in menuNames" :key="item.menuID" :value="item.menuID">{{item.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="菜单标题" prop="title">
          <Input type="text" v-model="newRow.title" placeholder="请输入菜单标题" clearable/>
        </FormItem>
        <FormItem label="菜单图标">
          <i-input type="text" v-model="newRow.icon" placeholder="请定义菜单图标" clearable>
            <Icon :type="newRow.icon" slot="append" size="22" style="width:50px"/>
          </i-input>
        </FormItem>
        <FormItem label="组件名称">
          <Input type="text" v-model="newRow.action" placeholder="请输入菜单的组件名称" clearable/>
        </FormItem>
        <FormItem label="排序标志" prop="order">
          <Input type="text" v-model="newRow.order" placeholder="请定义菜单的排列顺序" clearable/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Expand from './Expand'
export default {
  name: 'Menus',
  components: {
    Expand
  },
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        parentID: null,
        menuName: '',
        action: ''
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
      // 新增数据项数据绑定
      newRow: {
        parentID: 10000000,
        title: '',
        icon: '',
        action: '',
        order: 0
      },
      // 新增数据表单验证规则
      rules: {
        parentID: [
          {required: true, pattern: /^[1-9][0-9]{7}$/, message: '父菜单标题不能为空！', triggle: 'blur, change'}
        ],
        title: [
          {required: true, message: '菜单标题不能为空！', trigger: 'blur, change'}
        ],
        order: [
          {required: true, pattern: /^[0-9]{1,4}$/, message: '排序标志必须为长度小于4的数字！', trigger: 'blur, change'}
        ]
      },
      // 当前编辑行索引
      editRow: -1,
      // 当前页数据项列表数据
      rowList: [],
      // 当前所有菜单“ID--标题”映射数组
      menuNames: [],
      // 当前所有父菜单ID数组
      parentIds: [],
      // 数据列表栏目定义
      columns: [
        {
          type: 'expand',
          width: 30,
          align: 'center',
          renderHeader: (h, params) => {
            return h('Icon', {props: {type: 'ios-eye', size: 24}, style: {marginLeft: '-12px'}})
          },
          render: (h, params) => {
            return h(Expand, {
              props: {
                rowData: params.row,
                editMode: this.editRow === params.index,
                menuNames: this.menuNames
              }
            })
          }
        },
        // {title: '序号', type: 'index', align: 'center', width: 65},
        {
          title: '父菜单标题',
          key: 'parentID',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h('div', this.getMenuTitle(params.row.parentID))
          }
        },
        {
          title: '菜单图标',
          key: 'icon',
          align: 'center',
          render: (h, params) => {
            return h('Icon', {
              props: {
                type: params.row.icon,
                size: 32
              }
            })
          }
        },
        {title: '菜单标题', key: 'title', sortable: true, align: 'center'},
        {title: '组件名称', key: 'action', sortable: true, align: 'center'},
        {title: '排序标志', key: 'order', sortable: true, align: 'center'},
        // 定义操作按钮列（开始）
        {
          title: '操作',
          align: 'center',
          width: 125,
          render: (h, params) => {
            let btns = []
            if (this.$store.state.currentLevel & 2) {
              if (params.index === this.editRow) {
                btns.push(h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.saveRow(params.row)
                    }
                  }
                }, '保存'))
              } else {
                if (this.editRow < 0) {
                  btns.push(h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.editRow = params.index
                        // this.$refs['tabDataList'].toggleExpand(this.editRow)
                        this.$refs['tabDataList'].objData[this.editRow]._isExpanded = true
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
                        this.$refs['tabDataList'].objData[this.editRow]._isExpanded = false
                        this.editRow = params.index
                        this.$refs['tabDataList'].objData[this.editRow]._isExpanded = true
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
  mounted () {
    this.getData()
  },
  methods: {
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/menu/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.parentIds = res.data.data.parentIds
        this.menuNames = res.data.data.menuNames
        this.menuNames.unshift({menuID: 10000000, title: '无父菜单'})
        this.editRow = -1
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.menuName = ''
      this.searchInfo.action = ''
      this.searchInfo.parentIds = ''
    },
    // 获取菜单标题
    getMenuTitle (id) {
      for (let i = 0, l = this.menuNames.length; i < l; i++) {
        if (this.menuNames[i].menuID === id) {
          return this.menuNames[i].title
        }
      }
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
    // 保存修改数据，点击“保存”按钮时触发
    saveRow (rowData) {
      this.$httpReq('/menu/' + rowData.menuID, {
        page: this.page,
        rowData
      }, 'edit', (res) => {
        this.$refs['tabDataList'].objData[this.editRow]._isExpanded = false
        this.editRow = -1
        this.$Message.success('菜单项所作修改已成功保存！')
        this.getData()
      })
    },
    // 删除数据，点击“删除”按钮时触发
    delRow (rowData) {
      this.$httpReq('/menu/' + rowData.menuID, '', 'del', (res) => {
        this.$Message.success('所选菜单项已成功删除！')
        this.getData()
      })
    },
    // 新增数据，点击新增模态对话框“确认”按钮时触发
    addRow () {
      this.$refs['newRow'].validate((valid) => {
        if (valid) {
          this.$httpReq('/menu/0', {rowData: this.newRow}, 'add', (res) => {
            this.getData()
            this.$Message.success('菜单项已成功新增！')
            this.newRow.parentID = 10000000
            this.newRow.title = ''
            this.newRow.icon = ''
            this.newRow.action = ''
            this.newRow.order = 0
          })
        } else {
          this.$Message.error('新增菜单项数据校验有误，请修改后再新增！')
          setTimeout(() => {
            this.showModal = true
          }, 300)
        }
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
