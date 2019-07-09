<template>
  <div>
    <Modal
      v-model="show"
      :title="title"
      :okText="!editMode?'保存':'关闭'"
      width="680"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="formValidate" :label-width="100">
        <Row>
          <i-col span="11">
            <FormItem label="模板名称">
              <Input v-model="template.templateName" placeholder="模板名称" :disabled="editMode"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="适用场景">
              <Select v-model="template.suitableSence" placeholder="适用场景" filterable clearable :disabled="editMode">
                <Option v-for="item in sences" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="模板类型">
          <RadioGroup v-model="template.templateType" @on-change="changeTemplateType">
            <Radio v-for="item in typeList" :label="item.value" :key="item.value" :disabled="editMode">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <Row v-if="template.templateType === 1">
          <i-col span="11">
            <FormItem label="开始日期">
              <DatePicker type="date" v-model="template.startTime" placeholder="开始日期" :disabled="editMode"></DatePicker>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="失效日期">
              <DatePicker type="date" v-model="template.endTime" placeholder="失效日期" :disabled="editMode"></DatePicker>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="模板内容">
          <Input v-model="template.wordContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :disabled="editMode"
                 placeholder="模板内容"/>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="template.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :disabled="editMode"
                 placeholder="备注"/>
        </FormItem>
        <FormItem label="状态">
          <i-switch v-model="template.status" size="large" :true-value="1" :false-value="0" :disabled="editMode">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      startTime: '',
      endTime: '',
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
      typeList: [
        {
          label: '主话术',
          value: 0
        },
        {
          label: '营销后缀',
          value: 1
        }
      ],
      ruleValidate: {
        templateName: [
          {required: true, message: '模板名称不能为空', trigger: 'blur'}
        ],
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
    title: {
      type: String,
      default: '新增话术模板'
    },
    show: {
      type: Boolean,
      default: false
    },
    editMode: {
      type: Boolean,
      default: false
    },
    template: {
      type: Object
    },
    sences: {
      type: Array
    }
  },
  // created () {
  //   this.startTime = this.template.startTime
  //   this.endTime = this.template.endTime
  // },
  // watch: {
  //   'startTime': function (newVal) {
  //     this.template.startTime = this.formatDate(newVal[0])
  //   },
  //   'endTime': function (newVal) {
  //     this.template.endTime = this.formatDate(newVal[0])
  //   }
  // },
  methods: {
    ok () {
      this.$emit('saveInfo')
    },
    cancel () {
      this.$emit('cancelInfo')
    },
    formatDate (time) {
      console.log('formatDate---->' + time)
      return moment(time).format('YYYY-MM-DD')
    },
    changeTemplateType () {
      console.log(this.template.templateType)
      // 置空所选时间
      this.startTime = ''
      this.endTime = ''
      this.template.startTime = ''
      this.template.endTime = ''
    }
  }
}
</script>
<style scoped>

</style>
