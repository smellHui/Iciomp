<template>
  <div>
    <Modal
      v-model="show"
      title="新增产品"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <i-col span="11">
            <FormItem label="产品名称" prop="name">
              <Input v-model="formValidate.name" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="产品编码" prop="name">
              <Input v-model="formValidate.name" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="11">
            <FormItem label="目录" prop="name">
              <Select v-model="formValidate.city" placeholder="Select your city">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="产品类别" prop="name">
              <Select v-model="formValidate.city" placeholder="Select your city">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row>
          <i-col span="11">
            <FormItem label="定价ID" prop="name">
              <Input v-model="formValidate.name" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
          <i-col span="13">
            <FormItem label="短厅受理指令" prop="name">
              <Input v-model="formValidate.name" placeholder="Enter your name"/>
            </FormItem>
          </i-col>
        </Row>
        <FormItem label="适用区域" prop="gender">
          <RadioGroup v-model="formValidate.gender">
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
           <Input v-model="value11">
             <span slot="prepend">http://</span>
             <span slot="append">.com</span>
           </Input>
        </FormItem>
        <FormItem label="产品描述" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
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
    }
  },
  methods: {
    ok () {
      this.$Message.info('Clicked ok')
      this.noticeParentDismissView()
    },
    cancel () {
      this.$Message.info('Clicked cancel')
      this.noticeParentDismissView()
    },
    // 通知父组件关闭创建商品弹窗
    noticeParentDismissView () {
      this.$emit('dismissAddProductView')
    }
  }
}
</script>
<style scoped>

</style>
