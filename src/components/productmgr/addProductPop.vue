<template>
  <div>
    <Modal
      v-model="show"
      :title="title"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="product" :rules="ruleValidate" :label-width="80">
        <Row>
          <i-col span="11">
            <FormItem label="产品名称">
              <Input v-model="product.proName" placeholder="产品名称"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="产品编码">
              <Input v-model="product.proCode" placeholder="产品编码"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="11">
            <FormItem label="目录">
              <Select v-model="product.proMenu" placeholder="目录">
                <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="产品类别">
              <Select v-model="product.proType" placeholder="产品类别">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="11">
            <FormItem label="定价ID">
              <Input v-model="product.priceId" placeholder="定价ID"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="短厅受理指令">
              <Input v-model="product.orderCode" placeholder="短厅受理指令"/>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="适用区域" prop="gender">
          <RadioGroup v-model="product.suitableCity">
            <Radio label="全省">全省</Radio>
            <Radio label="武汉">武汉</Radio>
            <Radio label="非武汉">非武汉</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="状态">
          <i-switch v-model="toggle" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <FormItem label="推广URL">
          <Input v-model="product.url">
            <span slot="prepend">http://</span>
            <span slot="append">.com</span>
          </Input>
        </FormItem>
        <FormItem label="产品描述" prop="desc">
          <Input v-model="product.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="产品描述"/>
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
    show: {
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
    }
  }
}
</script>
<style scoped>

</style>
