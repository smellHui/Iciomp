<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">所属省市</i-col>
      <i-col span="5">
        <Select clearable filterable placeholder="请选择所属省市" v-model="searchInfo.provinceCode" @on-change="getCitys">
          <Option v-for="item in provinces" :key="item.code" :value="item.code">{{item.name}}</Option>
        </Select>
      </i-col>
      <i-col span="3" class="label">所属县市</i-col>
      <i-col span="5">
        <Cascader clearable filterable placeholder="请选择所属县市" :data="citys" :disabled="!canSelectCity" :render-format="(label)=>label.join('.')" @on-change="changeCityCode"></Cascader>
      </i-col>
      <i-col span="3" class="label">用户角色</i-col>
      <i-col span="5">
        <Select clearable filterable placeholder="请选择用户角色" v-model="searchInfo.role">
          <Option v-for="item in userRoles" :key="item.title" :value="item.value">{{item.title}}</Option>
        </Select>
      </i-col>
    </Row>
    <Row class="row">
      <i-col span="3" class="label">用户昵称</i-col>
      <i-col span="5"><Input type="text" clearable placeholder="请输入用户昵称" v-model="searchInfo.nickName"/></i-col>
      <i-col span="3" class="label">登录帐号</i-col>
      <i-col span="5"><Input type="text" clearable placeholder="请输入登录帐号" v-model="searchInfo.account"/></i-col>
      <i-col span="3" class="label">手机号码</i-col>
      <i-col span="5"><Input type="text" clearable placeholder="请输入手机号码" v-model="searchInfo.mobile"/></i-col>
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
        <div class="title"><Icon type="ios-list"/> 用户列表</div>
      </i-col>
      <i-col span="4" style="text-align:right;padding-right:10px">
        <Button v-if="this.$store.state.currentLevel&8" icon="ios-add" type="primary" size="small" @click="showModal=true">新增用户</Button>
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
    <Modal v-if="this.$store.state.currentLevel&8" v-model="showModal" title="新增用户" okText="保存" cancelText="取消" :styles="{top: 0}" @on-ok="addRow">
      <Form ref="newRow" :label-width="100" :rules="rules" :model="newRow">
        <FormItem label="登录帐号" prop="account">
          <Input type="text" v-model="newRow.account" placeholder="请输入登录帐号" clearable/>
        </FormItem>
        <FormItem label="登录密码" prop="password">
          <Input type="password" v-model="newRow.password" placeholder="请输入登录密码" clearable/>
        </FormItem>
        <FormItem label="重复密码" prop="repeatPsd">
          <Input type="password" v-model="newRow.repeatPsd" placeholder="请再次输入登录密码" clearable/>
        </FormItem>
        <FormItem label="用户昵称" prop="nickName">
          <Input type="text" v-model="newRow.nickName" placeholder="请输入用户昵称" clearable/>
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input type="text" v-model="newRow.mobile" placeholder="请输入用户昵称" clearable/>
        </FormItem>
        <FormItem label="所属省市" prop="provinceCode">
          <Select clearable filterable placeholder="请选择所属省市" v-model="newRow.provinceCode" @on-change="getCitys1">
            <Option v-for="item in provinces" :key="item.code" :value="item.code">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属县市" prop="cityCode">
          <Cascader clearable filterable placeholder="请选择所属县市" :data="citys1" v-model="newRow.cityCode" :disabled="!canSelectCity1" :render-format="(label)=>label.join('.')"></Cascader>
        </FormItem>
        <FormItem label="用户角色" prop="role">
          <Select clearable filterable placeholder="请选择用户角色" v-model="newRow.role">
            <Option v-for="item in userRoles" :key="item.title" :value="item.value">{{item.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="用户头像">
          <i-input type="text" v-model="newRow.avatar" placeholder="请定义用户头像" clearable>
            <Avatar v-if="newRow.avatar===null" icon="md-person" size="small" slot="append"/>
            <Avatar v-else :src="newRow.avatar" size="small" slot="append"/>
          </i-input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Expand from './Expand'
export default {
  name: 'Users',
  components: {
    Expand
  },
  data () {
    const checkPassword = (rule, value, callback) => {
      if (value !== this.newRow.password) {
        callback(new Error('两次输入的密码不一样！'))
      } else {
        callback()
      }
    }
    return {
      // 搜索部分数据绑定
      searchInfo: {
        provinceCode: null,
        cityCode: null,
        role: null,
        nickName: '',
        account: '',
        mobile: ''
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
        account: '',
        nickName: '',
        password: '',
        repeatPsd: '',
        provinceCode: null,
        cityCode: [],
        role: '',
        mobile: '',
        avatar: null
      },
      // 新增数据表单验证规则
      rules: {
        account: [{required: true, type: 'string', min: 5, message: '登录帐号长度不能小于5位！', triggler: 'blur, change'}],
        mobile: [{pattern: /^1[35789][0-9]{9}$/, message: '请输入正确的手机号码！', triggle: 'blur, change'}],
        password: [{required: true, type: 'string', min: 6, message: '登录密码长度不能小于6位！', trigger: 'blur, change'}],
        repeatPsd: [{required: true, type: 'string', min: 6, message: '重复密码长度不能小于6位！', trigger: 'blur, change'}, {validator: checkPassword, trigger: 'blur'}]
      },
      // 是否可以选择市县
      canSelectCity: false,
      canSelectCity1: false,
      // 当前编辑行索引
      editRow: -1,
      // 当前页数据项列表数据
      rowList: [],
      // 省份列表
      provinces: [],
      // 市县列表
      citys: [],
      citys1: [],
      // 用户角色定义
      userRoles: [
        {title: '默认', value: 'Default'},
        {title: '超级用户', value: 'Admin'}
      ],
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
                provinces: this.provinces
              }
            })
          }
        },
        // {title: '序号', type: 'index', align: 'center', width: 65},
        {
          title: '头像',
          key: 'avatar',
          align: 'center',
          width: 70,
          render: (h, params) => {
            if (params.row.avatar === null) {
              return h('Avatar', {props: {icon: 'md-person'}})
            } else {
              return h('Avatar', {props: {src: params.row.avatar}})
            }
          }
        },
        {title: '登录帐号', key: 'account', sortable: true, align: 'center'},
        {title: '用户昵称', key: 'nickName', sortable: true, align: 'center'},
        {
          title: '所属省市',
          key: 'provinceCode',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h('span', this.getProvinceName(params.row.provinceCode))
          }
        },
        {
          title: '所属市县',
          key: 'cityName',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.cityName ? params.row.cityName.join('.') : null)
          }
        },
        {title: '手机号码', key: 'mobile', sortable: true, align: 'center'},
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
                        if (!params.row.cityCode) {
                          params.row.cityCode = []
                        }
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
                        if (!params.row.cityCode) {
                          params.row.cityCode = []
                        }
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
      this.$httpReq('/user/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.provinces = res.data.data.provinces
        this.editRow = -1
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.account = ''
      this.searchInfo.nickName = ''
      this.searchInfo.mobile = ''
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
      this.$httpReq('/user/' + rowData.userId, {
        page: this.page,
        rowData
      }, 'edit', (res) => {
        this.$refs['tabDataList'].objData[this.editRow]._isExpanded = false
        this.editRow = -1
        this.$Message.success('修改的用户信息已成功保存！')
        this.getData()
      })
    },
    // 删除数据，点击“删除”按钮时触发
    delRow (rowData) {
      this.$httpReq('/user/' + rowData.userId, '', 'del', (res) => {
        this.$Message.success('所选用户已成功删除！')
        this.getData()
      })
    },
    // 新增数据，点击新增模态对话框“确认”按钮时触发
    addRow () {
      this.$refs['newRow'].validate((valid) => {
        if (valid) {
          this.$httpReq('/user/0', {rowData: this.newRow}, 'add', (res) => {
            this.getData()
            this.$Message.success('用户已成功新增！')
            this.newRow.account = ''
            this.newRow.nickName = ''
            this.newRow.role = null
            this.newRow.bobile = ''
            this.newRow.password = ''
            this.newRow.repeatPsd = ''
            this.newRow.provinceCode = null
            this.newRow.cityCode = null
            this.newRow.avatar = null
            this.canSelectCity1 = false
            this.citys1 = []
          })
        } else {
          this.$Message.error('新增用户数据校验有误，请修改后再新增！')
          setTimeout(() => {
            this.showModal = true
          }, 300)
        }
      })
    },
    // 获取县市列表数据(搜索区)
    getCitys (provinceCode) {
      if (provinceCode >= 110000) {
        this.$httpReq('/common/citys', {province: provinceCode}, 'get', (res) => {
          this.canSelectCity = true
          this.citys = res.data.data
        })
      }
    },
    // 县市列表数据改变时触发(搜索区)
    changeCityCode (value) {
      this.searchInfo.cityCode = value.toString()
    },
    // 获取县市列表数据(新增用户)
    getCitys1 (provinceCode) {
      if (provinceCode >= 110000) {
        this.$httpReq('/common/citys', {province: provinceCode}, 'get', (res) => {
          this.canSelectCity1 = true
          this.citys1 = res.data.data
        })
      }
    },
    // 获取省市名称
    getProvinceName (province) {
      for (let i = 0, len = this.provinces.length; i < len; i++) {
        if (this.provinces[i].code === province) {
          return this.provinces[i].name
        }
      }
      return null
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
