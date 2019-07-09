<template>
  <div>
    <Modal
      v-model="show"
      :title="title"
      width="680"
      :okText="!editMode?'保存':'关闭'"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="product" :label-width="100">
        <Row>
          <i-col span="12">
            <FormItem label="产品名称" prop="proName">
              <Input v-model="product.proName" placeholder="产品名称" :disabled="editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="产品编码" prop="proCode">
              <Input v-model="product.proCode" placeholder="产品编码" :disabled="editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="目录">
              <Select v-model="product.proMenu" placeholder="目录" filterable clearable :disabled="editMode">
                <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="产品类别">
              <Select v-model="product.proType" placeholder="产品类别" filterable clearable :disabled="editMode">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="12">
            <FormItem label="定价ID">
              <Input v-model="product.priceId" placeholder="定价ID" :disabled="editMode"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem label="短厅受理指令">
              <Input v-model="product.orderCode" placeholder="短厅受理指令" :disabled="editMode"/>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="适用区域" prop="gender">
          <RadioGroup v-model="product.suitableCity">
            <Radio label="全省" :disabled="editMode">全省</Radio>
            <Radio label="武汉" :disabled="editMode">武汉</Radio>
            <Radio label="非武汉" :disabled="editMode">非武汉</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="状态">
          <i-switch size="large" :true-value="1" :false-value="0" v-model="product.status" :disabled="editMode">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
        <FormItem label="推广URL">
          <Input v-model="product.url" :disabled="editMode">
            <span slot="prepend">http://</span>
          </Input>
        </FormItem>
        <FormItem label="产品描述" prop="desc">
          <Input v-model="product.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :disabled="editMode"
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
        proName: [
          {required: true, message: '产品名称必填', trigger: 'blur'}
        ],
        proCode: [
          {required: true, message: '产品编码必填', trigger: 'blur'}
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
    }
  }
}
</script>
<style scoped>

</style>
