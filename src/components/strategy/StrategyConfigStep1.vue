<template>
  <div class="wrapper">
    <Divider />
    <Form :label-width="120" ref="baseInfo" :rules="rules" :model="strategyBase">
      <FormItem label="策略名称" :label-width="90" prop="strategyName">
        <Input type="text" placeholder="请输入策略名称" v-model="strategyBase.strategyName" style="maxWidth:300px" :disabled="!editMode" />
      </FormItem>
      <FormItem label="选择营销事件" :label-width="113" prop="marketingEventId">
        <Cascader  placeholder="请选择营销事件" style="width:40%" transfer trigger="hover" filterable
          :data="marketingEvents" v-model="marketingEvent" :disabled="!editMode"
          @on-change="(val)=>strategyBase.marketingEventId=val.length>0?val[1]:''" />
      </FormItem>
      <FormItem label="有效时间" :label-width="90" prop="effectTime">
        <DatePicker type="datetime" placeholder="请选择生效日期和时间" :value="strategyBase.effectTime" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>strategyBase.effectTime=val" :disabled="!editMode"/>
        &emsp;—&emsp;<DatePicker type="datetime" placeholder="请选择失效日期和时间" :value="strategyBase.expireTime" format="yyyy-MM-dd HH:mm:ss" @on-change="(val)=>strategyBase.expireTime=val" :disabled="!editMode"/>
      </FormItem>
      <div style="padding-left:20px">当月执行日期（如不选择则默认全月）&emsp;<Checkbox :indeterminate="indeterminate.day" v-model="checkAll.day" @on-change="daysCheckAllChange" :disabled="!editMode">全选</Checkbox></div>
      <FormItem :label-width="20">
        <CheckboxGroup v-model="strategyBase.limitDays">
          <Checkbox v-for="day in 31" :key="day" :label="day + ''" :disabled="!editMode">{{day}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <div style="padding-left:20px">适用区域（如不选择则默认全省）&emsp;<Checkbox :indeterminate="indeterminate.area" v-model="checkAll.area" @on-change="areasCheckAllChange" :disabled="!editMode">全选</Checkbox></div>
      <FormItem :label-width="20">
        <CheckboxGroup v-model="strategyBase.suitableCity">
          <Checkbox v-for="item in areas" :key="item.key" :label="item" :disabled="!editMode">{{item}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="策略优先级" :label-width="102" prop="priority">
        <Slider show-input :max="20" :min="1" :step="1" v-model="strategyBase.priority" :disabled="!editMode" style="width:60%" />
      </FormItem>
      <FormItem label="黑名单适用规则" :label-width="127" required prop="suitableBlackType">
        <RadioGroup v-model="strategyBase.suitableBlackType">
          <Radio :label="10" :disabled="!editMode">全部</Radio>
          <Radio :label="11" :disabled="!editMode">客户端</Radio>
          <Radio :label="12" :disabled="!editMode">存费缴费</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label-width="258" label="超出运营位日限制时间是否支持次日补发" required prop="reissueFlag">
        <i-switch v-model="strategyBase.reissueFlag" :true-value="1" :false-value="0" :disabled="!editMode">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'StrategyConfigStep1',
  props: {
    strategyBase: {
      type: Object,
      default () {
        return {
          suitableCity: [],
          limitDays: []
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
      // 区域数组
      areas: ['武汉', '襄阳', '黄冈', '宜昌', '孝感', '鄂州', '咸宁', '十堰',
        '荆门', '黄石', '随州', '恩施', '仙桃', '天门', '潜江', '神农架', '荆州'
      ],
      marketingEvents: [],
      marketingEvent: [],
      rules: {
        strategyName: [{required: true, message: '策略名称不能为空！', trigger: ['blur', 'change']}],
        marketingEventId: [{required: true, message: '营销事件不能为空！', trigger: ['blur', 'change']}],
        priority: [{required: true, type: 'number', min: 1, max: 20, message: '优先级必须为1至20的整数！', trigger: ['blur', 'change']}],
        effectTime: [{required: true, message: '生效时间不能为空！', trigger: ['blur', 'change']},
          {trigger: ['blur', 'change'],
            validator: (rule, value, callback) => {
              let expire = this.strategyBase.expireTime
              if (expire === null || expire === '') {
                callback(new Error('失效时间不能为空！'))
              }
              if (expire < value) {
                callback(new Error('失效时间不能小于生效时间！'))
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    indeterminate () {
      let obj = {}
      if (!this.strategyBase.suitableCity || this.strategyBase.suitableCity.length < 1 || this.strategyBase.suitableCity.length >= this.areas.length) {
        obj.area = false
      } else {
        obj.area = true
      }
      if (!this.strategyBase.limitDays || this.strategyBase.limitDays.length < 1 || this.strategyBase.limitDays.length >= 31) {
        obj.day = false
      } else {
        obj.day = true
      }
      return obj
    },
    checkAll () {
      let obj = {}
      if (this.strategyBase.suitableCity && this.strategyBase.suitableCity.length >= this.areas.length) {
        obj.area = true
      } else {
        obj.area = false
      }
      if (this.strategyBase.limitDays && this.strategyBase.limitDays.length >= 31) {
        obj.day = true
      } else {
        obj.day = false
      }
      return obj
    }
  },
  mounted () {
    this.$httpReq('/common/listMarketingEvents', null, 'GET', (res) => {
      this.marketingEvents = []
      let temp = ''
      let obj = null
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].id === this.strategyBase.marketingEventId) {
          this.marketingEvent = [res.data.data[i].type, res.data.data[i].id]
        }
        if (res.data.data[i].type !== temp) {
          temp = res.data.data[i].type
          obj = {value: temp, label: temp, children: []}
          this.marketingEvents.push(obj)
        }
        obj.children.push({value: res.data.data[i].id, label: res.data.data[i].name})
      }
    })
  },
  methods: {
    daysCheckAllChange (val) {
      let obj = []
      if (val) {
        for (let i = 1; i < 32; i++) {
          obj.push(i + '')
        }
      }
      this.strategyBase.limitDays = obj
    },
    areasCheckAllChange (val) {
      let obj = []
      if (val) {
        for (let i = 0; i < this.areas.length; i++) {
          obj.push(this.areas[i])
        }
      }
      this.strategyBase.suitableCity = obj
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper {
  background: #ffffff;
  text-align: left;
}
</style>
