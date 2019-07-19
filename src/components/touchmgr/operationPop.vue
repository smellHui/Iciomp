<template>
  <div>
    <Modal
      v-model="show"
      :title="title"
      width="680"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="product" :rules="ruleValidate" :label-width="100">
        <Row>
          <i-col span="12">
            <FormItem label="运营位名称">
              <Input v-model="product.positionName" placeholder="运营位名称" :disabled="editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="编码">
              <Input v-model="product.positionCode" placeholder="编码" :disabled="editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="关联触点">
              <Input v-model="touchName" placeholder="关联触点" disabled="false"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="日营销时间">
               <TimePicker confirm type="timerange" v-model="product.marketTime" placement="bottom-end" placeholder="日营销时间" style="width: 180px" :disabled="editMode"></TimePicker>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="20">
            <FormItem label="用户日接触频次">
              <InputNumber style="width: 100px" :min="0" v-model="product.touchLimitCycle" :disabled="editMode"></InputNumber>
              &#12288;天&#12288;
              <InputNumber style="width: 100px" :min="0" v-model="product.touchLimitNum" :disabled="editMode"></InputNumber>
              &#12288;次&#12288;
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="月次接触阀值">
              <InputNumber style="width: 200px" :min="0" v-model="product.monthLimitCount" :disabled="editMode"></InputNumber>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="状态">
          <i-switch v-model="product.status" size="large" :true-value="1" :false-value="0" :disabled="editMode">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <OtherView :editMode='editMode' :createTime="formatDate(product.createTime)" :updateTime="formatDate(product.updateTime)"></OtherView>
      </Form>
    </Modal>
  </div>
</template>
<script>
import moment from 'moment'
import OtherView from '.././charts/OtherView'
export default {
  components: {
    OtherView
  },
  data () {
    return {
      marketTime: [],
      value11: '',
      toggle: true,
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
    menuList: {
      type: Array
    },
    typeList: {
      type: Array
    },
    title: {
      type: String,
      default: '新增产品'
    },
    touchName: {
      type: String
    },
    show: {
      type: Boolean,
      default: false
    },
    editMode: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object
    }
  },
  methods: {
    ok () {
      this.$emit('saveInfo')
    },
    cancel () {
      this.$emit('cancelInfo')
    },
    formatDate (time) {
      if (time === null || time === undefined) {
        return ''
      }
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style scoped>

</style>
