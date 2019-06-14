<template>
  <div>
    <Modal
      v-model="show"
      title="新增触点"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="touch" :rules="ruleValidate" :label-width="80">
        <Row>
          <i-col span="11">
            <FormItem label="触点名称" prop="name">
              <Input v-model="touch.touchName" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="触点编码" prop="name">
              <Input v-model="touch.touchCode" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="11">
            <FormItem label="触点来源" prop="name">
              <Input v-model="touch.touchSource" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="接触时效" prop="name">
              <Select placeholder="Select your city">
                <Option value="实时">实时</Option>
                <Option value="延迟">延迟</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="11">
            <FormItem label="接触媒介" prop="name">
              <Select placeholder="Select your city">
                <Option value="文本">文本</Option>
                <Option value="语音">语音</Option>
                <Option value="滚动图片">滚动图片</Option>
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
          <i-switch size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <FormItem label="触点描述" prop="desc">
          <Input v-model="touch.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="Enter something..."/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>export default {
  data () {
    return {
      value11: '',
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
