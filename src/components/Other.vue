<template>
<div style="text-align:center">
<div style="width:500px;height:500px;border:solid 1px #ddd;margin:0 auto">
  <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
    <FormItem label="Password" prop="passwd">
      <i-input type="password" v-model="formCustom.passwd">
        <Icon slot="prepend" type="ios-locked" size="22"></Icon>
      </i-input>
    </FormItem>
    <FormItem label="Confirm" prop="passwdCheck">
      <i-input type="password" v-model="formCustom.passwdCheck"></i-input>
    </FormItem>
    <FormItem label="Age" prop="age">
      <i-input type="text" v-model="formCustom.age" number/>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formCustom')">Submit</Button>
      <Button type="ghost" @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
    </FormItem>
  </i-form>
</div>
</div>
</template>
<script>
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password'))
      } else {
        if (this.formCustom.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'))
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('The two input passwords do not match!'))
      } else {
        callback()
      }
    }
    const validateAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Age cannot be empty'))
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('Please enter a numeric value'))
        } else {
          if (value < 18) {
            callback(new Error('Must be over 18 years of age'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      formCustom: {
        passwd: 'aaaaaaa',
        passwdCheck: '',
        age: ''
      },
      ruleCustom: {
        passwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        age: [
          { validator: validateAge, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
