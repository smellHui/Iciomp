<template>
  <div class="wrapper">
    <!-- 搜索表单 -->
    <Row class="row">
      <i-col span="3" class="label">资源标题</i-col>
      <i-col span="5"><Input type="text" clearable placeholder="请输入资源标题" v-model="searchInfo.title"/></i-col>
      <i-col span="3" class="label">菜单绑定</i-col>
      <i-col span="5">
        <Cascader clearable filterable placeholder="请选择绑定的菜单" :data="menus"
          @on-change="(value)=>searchInfo.menuId=value.toString()"
          :render-format="(label)=>label.join('-')">
        </Cascader>
      </i-col>
      <i-col span="3" class="label">访问级别</i-col>
      <i-col span="5">
        <Select clearable placeholder="请选择存取级别" v-model="searchInfo.accessLevel">
          <Option v-for="item in levels" :key="item.value" :value="item.value">{{item.label}}</Option>
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
      <i-col span="24">
        <div class="title"><Icon type="ios-list"/> 资源列表</div>
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
  </div>
</template>

<script>
export default {
  name: 'Resources',
  data () {
    return {
      // 搜索部分数据绑定
      searchInfo: {
        title: '',
        menuId: null,
        accessLevel: null
      },
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100],
      // 当前编辑行索引
      editRow: [],
      // 当前页数据项列表数据
      rowList: [],
      // 菜单列表
      menus: [],
      // 存取级别定义
      levels: [
        {value: 1, label: '查询'},
        {value: 2, label: '修改'},
        {value: 4, label: '删除'},
        {value: 8, label: '新建'},
        {value: 16, label: '审核'}
      ],
      // 数据列表栏目定义
      columns: [
        {title: '资源名称', key: 'name', sortable: true, align: 'center'},
        {title: '资源标题', key: 'title', sortable: true, align: 'center'},
        {
          title: '存取级别',
          key: 'accessLevel',
          sortable: true,
          align: 'center',
          width: 104,
          render: (h, params) => {
            return h('span', this.getLevel(params.row.accessLevel))
          }
        },
        {
          title: '菜单绑定',
          key: 'menuId',
          sortable: true,
          align: 'center',
          className: 'alignLeft',
          render: (h, params) => {
            if (this.$store.state.currentLevel & 2) {
              let cell = []
              if (this.editRow.indexOf(params.row.id) >= 0) {
                cell.push(h('Button', {
                  props: {
                    icon: 'md-checkmark',
                    type: 'text',
                    size: 'small'
                  },
                  style: {'box-shadow': 'none', color: '#ff9900', padding: '0 5px'},
                  on: {
                    click: () => {
                      this.saveResource(params.row)
                    }
                  }
                }))
                cell.push(h('Cascader', {
                  props: {
                    data: this.menus,
                    clearable: true,
                    filterable: true,
                    value: params.row.menuId !== null ? params.row.menuId.split(',') : [],
                    'render-format': (label) => label.join('-'),
                    placeholder: '请选择要绑定的菜单项'
                  },
                  style: {display: 'inline-block'},
                  on: {
                    'on-change': (value) => {
                      params.row.menuId = value.toString()
                    }
                  }
                }))
              } else {
                cell.push(h('Button', {
                  props: {
                    icon: 'md-create',
                    type: 'text',
                    size: 'small'
                  },
                  style: {'box-shadow': 'none', color: '#2d8cf0', padding: '0 5px'},
                  on: {
                    click: () => {
                      this.editRow.push(params.row.id)
                    }
                  }
                }))
                cell.push(h('span', this.getMenuName(params.row.menuId, this.menus)))
              }
              return h('div', cell)
            } else {
              return h('div', {style: {padding: '0 13px'}}, this.getMenuName(params.row.menuId, this.menus))
            }
          }
        },
        {title: '创建时间', key: 'createTime', sortable: true, align: 'center'},
        {title: '更新时间', key: 'updateTime', sortable: true, align: 'center'}
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取当前页列表数据
    getData () {
      this.$httpReq('/resource/all', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.menus = res.data.data.menus
      })
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.title = ''
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
    saveResource (rowData) {
      this.$httpReq('/resource/' + rowData.id, {
        id: rowData.id,
        menuId: rowData.menuId
      }, 'edit', (res) => {
        this.editRow.splice(this.editRow.indexOf(rowData.id), 1)
        this.$Message.success('绑定的菜单信息已成功保存！')
      })
    },
    // 获取菜单名称
    getMenuName (menuId, menus) {
      if (!menuId || !menus || menuId.length < 1 || menus.length < 1) {
        return ''
      }
      let ids = menuId.split(',')
      for (let i = 0, len = menus.length; i < len; i++) {
        if (menus[i].value === ids[0]) {
          if (ids.length > 1) {
            ids.shift()
            return menus[i].label + '-' + this.getMenuName(ids.toString(), menus[i].children)
          } else {
            return menus[i].label
          }
        }
      }
    },
    // 获取存取权限名称
    getLevel (value) {
      for (let i = 0, len = this.levels.length; i < len; i++) {
        if (this.levels[i].value === value) {
          return this.levels[i].label
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
<style>
.ivu-table-row .alignLeft>.ivu-table-cell {
  padding: 0 5px;
  text-align: left
}
</style>
