<template>
  <div>
    <Modal
      v-model="show"
      title="新增触点"
      width="680"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="touch" :label-width="100">
        <Row>
          <i-col span="11">
            <FormItem label="触点名称" prop="name">
              <Input v-model="touch.touchName" placeholder="触点名称"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="触点编码" prop="name">
              <Input v-model="touch.touchCode" placeholder="触点编码"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="11">
            <FormItem label="触点来源" prop="name">
              <Input v-model="touch.touchSource" placeholder="触点来源"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="接触时效" prop="name">
              <Select v-model="touch.timesType" placeholder="接触时效">
                <Option value="0">实时</Option>
                <Option value="1">非实时</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="11">
            <FormItem label="接触媒介" prop="name">
              <Select v-model="touch.touchMedia" placeholder="接触媒介">
                <Option value="0">文本</Option>
                <Option value="1">图片</Option>
                <Option value="2">语音</Option>
                <Option value="3">图文混合</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="月接触总阀值" prop="name">
              <InputNumber :max="10" :min="1" v-model="touch.monthThreshold"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="状态">
          <i-switch size="large" :true-value="1" :false-value="0" v-model="touch.status">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
        <FormItem label="触点描述" prop="desc">
          <Input v-model="touch.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="触点描述"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>export default {
  data () {
    return {
      toggle: true,
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        name: [
          {required: true, message: 'The name cannot be empty', trigger: 'blur'}
        ],
        mail: [
          {required: true, message: 'Mailbox cannot be empty', trigger: 'blur'},
          {type: 'email', message: 'Incorrect email format', trigger: 'blur'}
        ],
        city: [
          {required: true, message: 'Please select the city', trigger: 'change'}
        ],
        gender: [
          {required: true, message: 'Please select gender', trigger: 'change'}
        ],
        interest: [
          {required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change'},
          {type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change'}
        ],
        date: [
          {required: true, type: 'date', message: 'Please select the date', trigger: 'change'}
        ],
        time: [
          {required: true, type: 'string', message: 'Please select time', trigger: 'change'}
        ],
        desc: [
          {required: false, message: 'Please enter a personal introduction', trigger: 'blur'},
          {type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    touch: {
      type: Object
    }
  },
  methods: {
    ok () {
      this.$emit('saveInfo')
    },
    cancel () {
      this.$emit('cancelInfo')
    }
  }
}
</script>
<style scoped>

</style>
