<template>
  <div class="wrapper">
    <Row style="height:40px;line-height:40px">
      <i-col span="4" style="text-align:left;padding-left:20px">
        <Button type="warning" size="small" @click.native="retBack" title="返回时不会自动保存数据哦！"><Icon type="ios-exit" size="24" style="margin-left:-5px" />返回</Button>
      </i-col>
      <i-col span="16" class="title">策略配置信息</i-col>
      <i-col span="4">&emsp;</i-col>
    </Row>
    <div class="step">
      <Steps :current="currentStep" status="process">
        <Step v-for="(item,index) in stepItems" :key="index" :title="item.title" :content="item.content" @click.native="currentStep=index"/>
      </Steps>
    </div>
    <div>
      <StrategyConfigStep1 v-if="currentStep===0" :strategyBase="strategyInfo.baseInfo" :editMode="editMode" />
      <StrategyConfigStep2 v-if="currentStep===1" :commonLabels="strategyInfo.commonLabels" :libLabels="strategyInfo.libLabels" :editMode="editMode" />
      <StrategyConfigStep3 v-if="currentStep===2" :productsAndWords="strategyInfo.productsAndWords" :editMode="editMode" />
      <StrategyConfigStep4 v-if="currentStep===3" :editMode="editMode" v-model="strategyInfo.baseInfo.positionId" />
    </div>
    <div class="bottom">
      <Button v-if="currentStep>0" type="primary" size="small" @click.native="currentStep--"><Icon type="ios-arrow-back" size="24" style="margin-left:-8px" />上一步</Button>
      <Button v-if="currentStep<3" type="primary" size="small" @click.native="currentStep++" style="margin-left:30px">下一步<Icon type="ios-arrow-forward" style="margin-right:-8px" size="24" /></Button>
      <Button v-if="currentStep===3" type="primary" size="small" :disabled="!editMode" @click.native="saveData" style="margin-left:30px"><Icon type="ios-done-all" style="margin-left:-8px" size="24" />保&emsp;存</Button>
    </div>
  </div>
</template>

<script>
import StrategyConfigStep1 from './StrategyConfigStep1'
import StrategyConfigStep2 from './StrategyConfigStep2'
import StrategyConfigStep3 from './StrategyConfigStep3'
import StrategyConfigStep4 from './StrategyConfigStep4'
export default {
  name: 'StrategyConfig',
  components: {
    StrategyConfigStep1,
    StrategyConfigStep2,
    StrategyConfigStep3,
    StrategyConfigStep4
  },
  data () {
    return {
      editMode: false,
      currentStep: 0,
      stepItems: [
        {title: '基本信息', content: '策略基本信息配置'},
        {title: '目标客户群', content: '选择目标客户群'},
        {title: '产品和话术', content: '编辑营销产品及话术'},
        {title: '触点及运营位', content: '选择触点及运营位'}
      ],
      strategyInfo: {
        id: '',
        // 基本信息
        baseInfo: {
          strategyName: '',
          marketingEventId: '',
          effectTime: '',
          expireTime: '',
          limitDays: [],
          suitableCity: [],
          priority: 1,
          suitableBlackType: '',
          reissueFlag: 0,
          // 运营位
          positionId: []
        },
        // 通用标签
        commonLabels: {},
        // 策略库标签
        libLabels: {},
        // 产品和话术
        productsAndWords: {
          products: [],
          words: {
            mainWordId: '',
            mainWordContent: '',
            suffixWordId: '',
            suffixWordContent: ''
          }
        }
      }
    }
  },
  mounted () {
    this.editMode = this.$route.query.editMode
    this.strategyInfo.id = this.$route.query.id
    if (this.strategyInfo.id) {
      this.$httpReq('/strategy/' + this.strategyInfo.id, null, 'get', (res) => {
        this.strategyInfo = res.data.data
      })
    }
  },
  methods: {
    retBack () {
      this.$router.push('/strategy/strategy')
    },
    saveData () {
      if (!this.checkData()) {
        return false
      }
      let url = this.strategyInfo.id ? ('/strategy/' + this.strategyInfo.id) : '/strategy/add'
      let method = this.strategyInfo.id ? 'put' : 'post'
      this.$httpReq(url, this.strategyInfo, method, (res) => {
        this.$Message.success('策略配置成功！')
        this.retBack()
      })
    },
    checkData () {
      let o = this.strategyInfo.baseInfo.strategyName
      if (o === null || o === '') {
        this.currentStep = 0
        this.$Notice.error({duration: 10, title: '数据校验错误', desc: '策略名称不能为空！'})
        return false
      }
      o = this.strategyInfo.baseInfo.marketingEventId
      if (o === null || o.length !== 32) {
        this.currentStep = 0
        this.$Notice.error({duration: 10, title: '数据校验错误', desc: '营销事件名称不能为空！请正确选择营销事件。'})
        return false
      }
      o = this.strategyInfo.baseInfo.effectTime
      if (o === null || o === '') {
        this.currentStep = 0
        this.$Notice.error({duration: 10, title: '数据校验错误', desc: '生效时间不能为空！'})
        return false
      }
      let o1 = this.strategyInfo.baseInfo.expireTime
      if (o1 === null || o1 === '') {
        this.currentStep = 0
        this.$Notice.error({duration: 10, title: '数据校验错误', desc: '失效时间不能为空！'})
        return false
      }
      if (o1 < o) {
        this.currentStep = 0
        this.$Notice.error({duration: 10, title: '数据校验错误', desc: '失效时间不能小于生效时间！请正确选择生效时间和失效时间。'})
        return false
      }
      o = this.strategyInfo.baseInfo.suitableBlackType
      if (o === null || o === '') {
        this.currentStep = 0
        this.$Notice.error({duration: 10, title: '数据校验错误', desc: '请选择黑名单适用规则！'})
        return false
      }
      o = this.strategyInfo.productsAndWords.products
      if (o === null || o.length < 1) {
        this.currentStep = 2
        this.$Notice.error({duration: 10, title: '数据校验错误', desc: '绑定的营销产品不能为空！请正确选择营销产品。'})
        return false
      }
      o = this.strategyInfo.productsAndWords.words.mainWordId
      if (o === null || o.length < 32) {
        this.currentStep = 2
        this.$Notice.error({duration: 10, title: '数据校验错误', desc: '主话术不能为空！请选择主话术模板后进行个性化编辑。'})
        return false
      }
      o = this.strategyInfo.baseInfo.positionId
      if (o === null || o.length < 1) {
        this.currentStep = 3
        this.$Notice.error({title: '数据校验错误', desc: '运营位不能为空！请正确选择运营位。'})
        return false
      }
      return true
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
.step {
  height: 70px;
  text-align: left;
  padding: 10px 20px;
  cursor: default;
}
.title {
  font-size: 20px;
  font-weight: bolder;
  text-align: center;
}
.bottom {
  height: 40px;
  text-align: right;
  padding-right:60px;
  margin-top: 20px;
}
</style>
