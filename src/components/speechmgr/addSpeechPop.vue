<template>
  <div>
    <Modal
      v-model="show"
      :title="title"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <i-col span="11">
            <FormItem label="模板名称" prop="name">
              <Input v-model="template.templateName" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="适用场景" prop="name">
              <Input v-model="template.suitableSence" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="模板类型" prop="gender">
          <RadioGroup v-model="template.type">
            <Radio v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Radio>
          </RadioGroup>
        </FormItem>
        <Row>
          <i-col span="11">
            <FormItem label="开始日期" prop="name">
              <DatePicker type="date" placeholder="Select date"></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="失效日期" prop="name">
              <DatePicker type="date" placeholder="Select date"></DatePicker>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="模板内容" prop="desc">
          <Input v-model="template.wordContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="Enter something..."/>
        </FormItem>
        <FormItem label="备注" prop="desc">
          <Input v-model="template.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="Enter something..."/>
        </FormItem>
        <FormItem label="状态">
          <i-switch v-model="template.status" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
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
    typeList: {
      type: Array
    },
    title: {
      type: String,
      default: '新增话术模板'
    },
    show: {
      type: Boolean,
      default: false
    },
    template: {
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
