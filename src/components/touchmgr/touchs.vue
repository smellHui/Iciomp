<template>
  <div class="wrapper">
    <Row>
     <i-col style="float: right">
       <Button icon="ios-add" type="primary" size="small" @click="showModal = true">新增触点
       </Button>
     </i-col>
   </Row>
    <Form>
      <div v-for='touch in rowList' :key="touch">
        <Divider class="title" orientation="left">{{touch.touchName}}</Divider>
        <Row>
          <i-col class="icol" span="6">
            <p class="label">触点编码</p>
            <Input v-model="touch.touchCode" placeholder="Enter something..." style="width: 200px" :disabled="!touch.edit"/>
          </i-col>
          <i-col class="icol" span="6">
            <p class="label">触点来源</p>
            <Input v-model="touch.touchSource" placeholder="Enter something..." style="width: 200px" :disabled="!touch.edit"/>
          </i-col>
          <i-col class="icol" span="6">
            <p class="label">接触时效</p>
            <Select v-model="touch.timesType" clearable style="width:200px;text-align: left" :disabled="!touch.edit">
              <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </i-col>
          <i-col class="icol" span="6">
            <p class="label">接触媒介</p>
            <Select v-model="touch.touchMedia" clearable style="width:200px;text-align: left" :disabled="!touch.edit">
              <Option v-for="item in mediaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </i-col>
          <i-col class="icol" span="6">
            <p class="label">月接触总阀值</p>
            <InputNumber :min="1" v-model="touch.monthThreshold" :disabled="!touch.edit"></InputNumber>
          </i-col>
          <i-col class="icol" span="6">
            <p class="label">开关</p>
            <i-switch v-model="touch.status" size="large" :true-value="1" :false-value="0" :disabled="!touch.edit">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </i-col>
        </Row>
        <Row class="code-row-bg">
          <Button type="primary" shape="circle" icon="ios-search" @click="editClick(touch)">{{touch.edit ? '保存' : '编辑'}}</Button>
          <Button type="primary" shape="circle" icon="ios-search" @click="routerToOperate(touch)" style="margin-left: 30px">运营位</Button>
        </Row>
      </div>
    </Form>
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
    <addTouchPop :touch='touch' :show="showModal" @saveInfo="saveInfo" @cancelInfo="showModal = false"></addTouchPop>
  </div>
</template>

<script>
import addTouchPop from './addTouchPop'
export default {
  name: 'products',
  components: {
    addTouchPop
  },
  data () {
    return {
      searchInfo: {
        touchCode: '',
        touchSource: '',
        monthThreshold: 0,
        touchMedia: 0,
        timesType: 0
      },
      // 分页组件数据绑定
      page: {
        totalRecord: 0,
        size: 10,
        currentNum: 1
      },
      // 分页组件每页数量
      pageOption: [5, 10, 20, 50, 100],
      showModal: false,
      touch: {},
      value1: 1,
      rowList: [],
      mediaList: [
        {
          value: 0,
          label: '文本'
        },
        {
          value: 1,
          label: '图片'
        },
        {
          value: 2,
          label: '语音'
        },
        {
          value: 3,
          label: '滚动图片'
        }
      ],
      timeList: [
        {
          value: 0,
          label: '实时'
        },
        {
          value: 1,
          label: '非实时'
        }
      ]
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 获取当前页列表数据
    getList () {
      this.$httpReq('/touch/getList', {page: this.page, search: this.searchInfo}, 'get', (res) => {
        this.rowList = res.data.data.dataList
        this.page = res.data.data.page
        this.events = res.data.data.events
        this.currentRow = -1
        this.editMode = false
      })
    },
    // 新增
    saveInfo () {
      this.$httpReq('/touch/add', this.touch, 'add', (res) => {
        this.$Message.success(res.data.msg)
        this.showModal = false
        this.getList()
      })
    },
    editInfo (item) {
      this.$httpReq('/touch/edit', item, 'add', (res) => {
        this.$Message.success(res.data.msg)
        this.showModal = false
        this.getList()
      })
    },
    editClick (item) {
      if (item.edit) {
        this.editInfo(item)
      } else {
        this.$set(item, 'edit', !item.edit)
      }
    },
    routerToOperate (item) {
      this.$router.push({name: 'operations', params: {touch: item}})
    },
    // 页码改变时触发
    pageChange (page) {
      this.page.currentNum = page
      this.getList()
    },
    // 每页显示条数改变时触发
    sizeChange (size) {
      this.page.size = size
      this.getList()
    },
    // 清空搜索表单数据
    clearSearchInfo () {
      this.searchInfo.proName = ''
      this.searchInfo.proMenu = ''
      this.searchInfo.proType = ''
      this.searchInfo.startTime = ''
      this.searchInfo.endTime = ''
    }
  }
}
</script>

<style scoped>
  .code-row-bg {
    margin-top: 30px;
  }
  .row {
    height: 32px;
    line-height: 32px;
    margin: 5px auto;
    text-align: left
  }
  .icol {
    display: flex;
    margin-top: 20px;
    margin-left: 30px;
    align-items: center;
  }
  .wrapper {
    background: #ffffff;
    padding: 30px 150px 40px;
  }
  .label {
    text-align: right;
    width: 100px;
    padding-right: 10px;
  }
  .title {
    font-size: 20px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bolder;
    margin-top: 30px;
    padding-left: 10px;
  }
</style>
