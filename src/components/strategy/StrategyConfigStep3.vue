<template>
  <div class="wrapper">
    <Divider orientation="left">请选择绑定营销产品&ensp;
      <Button type="info" ghost size="small" @click.native="getProductsList" :disabled="!editMode">请选择...</Button>
    </Divider>
    <div style="padding:0 20px 0 10px;line-height:30px;min-height:80px">
      <Tag v-for="(val,key) in tags" :key="key" :name="key"
        type="border" :closable="editMode" :color="editMode?'success':'info'" @on-close="closeTag"
        style="margin:0 10px">{{val}}
      </Tag>
    </div>
    <Divider orientation="left">话术编辑</Divider>
    <div style="padding:0 20px">
      <WordEditor v-model="productsAndWords.words" :disabled="!editMode"></WordEditor>
    </div>
    <Drawer title="选择营销产品" width="60" v-model="open" @on-close="getProductNames">
      <Row class="row">
        <i-col span="3" class="label">产品名称</i-col>
        <i-col span="5"><Input type="text" clearable placeholder="请输入产品名称" v-model="searchInfo.proName"/></i-col>
        <i-col span="3" class="label">产品目录</i-col>
        <i-col span="5">
          <Select v-model="searchInfo.productCatalog" clearable placeholder="请选择产品目录">
            <Option v-for="(item,index) in productCatalogs" :key="index" :value="item">{{item}}</Option>
          </Select>
        </i-col>
        <i-col span="3" class="label">产品类别</i-col>
        <i-col span="5">
          <Select v-model="searchInfo.proType" clearable placeholder="请选择产品类别">
            <Option v-for="(item,index) in productTypes" :key="index" :value="item">{{item}}</Option>
          </Select>
        </i-col>
      </Row>
      <Row class="row">
        <i-col span="3" class="label">创建日期</i-col>
        <i-col span="21">
          <DatePicker type="date" placeholder="请选择开始日期" transfer format="yyyy-MM-dd" :value="searchInfo.startDate" @on-change="(val)=>this.searchInfo.startDate=val"/>&emsp;—&emsp;
          <DatePicker type="date" placeholder="请选择结束日期" transfer format="yyyy-MM-dd" :value="searchInfo.endDate" @on-change="(val)=>this.searchInfo.endDate=val"/>
        </i-col>
      </Row>
      <Row class="row">
        <i-col span="24" style="text-align:center">
          <Button icon="ios-search" type="primary" shape="circle" size="small" @click.native="getProductsList">搜&emsp;索</Button>&emsp;&emsp;&emsp;&emsp;
          <Button icon="ios-refresh" type="primary" shape="circle" size="small" @click.native="clearSearchInfo">重&emsp;置</Button>
        </i-col>
      </Row>
      <Table :data="productsData" :columns="columns" style="margin: 10px auto"
        @on-selection-change="handleSelectionChange" />
      <Page :total="page.totalRecord"
        :page-size="page.size"
        :current="page.currentNum"
        @on-change="pageChange"
        @on-page-size-change="sizeChange"
        show-sizer show-elevator/>
    </Drawer>
  </div>
</template>

<script>
import WordEditor from './WordEditor'
export default {
  name: 'StrategyConfigStep3',
  components: {
    WordEditor
  },
  props: {
    productsAndWords: {
      type: Object,
      default () {
        return {
          products: [],
          words: {}
        }
      }
    },
    editMode: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      open: false,
      searchInfo: {
        proName: '',
        productCatalog: '',
        proType: '',
        startDate: '',
        endDate: ''
      },
      productCatalogs: [],
      productTypes: [],
      tags: {},
      productsData: [],
      columns: [
        {type: 'selection', width: 60, align: 'center'},
        {title: '产品名称', key: 'proName', align: 'center'},
        {title: '产品编码', key: 'proCode', align: 'center'},
        {title: '定价ID', key: 'priceId', align: 'center'},
        {title: '适用地市', key: 'suitableCity', align: 'center'},
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.status ? '开启' : '关闭')
          }
        }
      ]
    }
  },
  mounted () {
    this.getProductCatalogsAndTypes()
    this.getProductNames()
  },
  methods: {
    // 页码改变时触发
    pageChange (page) {
      this.page.currentNum = page
      this.getProductsList()
    },
    // 每页显示条数改变时触发
    sizeChange (size) {
      this.page.size = size
      this.getProductsList()
    },
    closeTag (event, name) {
      delete this.tags[name]
      let n = this.productsAndWords.products.indexOf(name)
      if (n >= 0) {
        this.productsAndWords.products.splice(n, 1)
      }
      this.tags = Object.assign({}, this.tags)
    },
    getProductCatalogsAndTypes () {
      this.$httpReq('/common/product/catalogsAndTypes', null, 'get', (res) => {
        this.productCatalogs = res.data.data.productCatalogs
        this.productTypes = res.data.data.productTypes
      })
    },
    getProductsList () {
      this.$httpReq('/common/product/list', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        let data = res.data.data.dataList
        for (let i in data) {
          if (this.productsAndWords.products.indexOf(data[i].id) >= 0) {
            data[i]._checked = true
          }
        }
        this.productsData = data
        this.page = res.data.data.page
        this.open = true
      })
    },
    clearSearchInfo () {
      this.searchInfo.proName = ''
      this.searchInfo.proType = ''
      this.searchInfo.productCatalog = ''
      this.searchInfo.startDate = ''
      this.searchInfo.endDate = ''
    },
    handleSelectionChange (sel) {
      let val = this.productsAndWords.products
      for (let i in this.productsData) {
        let productId = this.productsData[i].id
        let flag = false
        for (let j in sel) {
          if (productId === sel[j].id) {
            flag = true
            break
          }
        }
        let n = val.indexOf(productId)
        if (flag) {
          if (n < 0) {
            val.push(productId)
          }
        } else {
          if (n >= 0) {
            val.splice(n, 1)
          }
        }
      }
    },
    getProductNames () {
      if (this.productsAndWords.products) {
        this.$httpReq('/common/product/getNameByIds', this.productsAndWords.products, 'post', (res) => {
          this.tags = {}
          for (let i in res.data.data) {
            this.tags[res.data.data[i].id] = res.data.data[i].proName
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  background: #ffffff;
  margin: 5px;
  padding: 5px;
  text-align: left;
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
</style>
