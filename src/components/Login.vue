<template>
  <div class="bg">
    <div class="sys-title">湖北电信互联网触点智慧运营平台</div>
    <i-form ref="formUser" :model="formUser" :rules="ruleUser" class="login-box">
      <form-item prop="account">
        <i-input type="text" v-model="formUser.account" clearable placeholder="请输入用户登录帐号" size="large" @on-blur="loadPassword">
          <Icon slot="prepend" type="ios-person" size="22"></Icon>
        </i-input>
      </form-item>
      <form-item prop="psd">
        <i-input type="password" v-model="formUser.psd" clearable placeholder="请输入用户登录密码" size="large">
          <Icon slot="prepend" type="ios-lock" size="22"></Icon>
        </i-input>
      </form-item>
      <!-- <form-item prop="vcode">
        <i-input type="text" v-model="formUser.vcode" placeholder="请输入验证码" size="large">
          <Icon slot="prepend" type="ios-eye" size="22"></Icon>
          <span slot="append"><img :src="vCodeUrl" @click="getCode" style="height:20px;" /></span>
        </i-input>
      </form-item> -->
      <form-item prop="msgCode">
        <i-input type="text" v-model="formUser.msgCode" placeholder="输入短信验证码" size="large">
          <Icon slot="prepend" type="ios-eye" size="22"></Icon>
          <span slot="append"><i-button type="text" size="small" :disabled="count>0" @click="sendMsg">{{msgText}}</i-button></span>
        </i-input>
      </form-item>
      <form-item>
        <i-button type="primary" @click="login('formUser')" style="width:60%">进入平台</i-button>
      </form-item>
      <form-item>
        <Checkbox v-model="formUser.isSavePsd">记住密码</Checkbox>
        <Checkbox v-model="formUser.autoLogin" style="margin-left:40px">自动登录</Checkbox>
      </form-item>
    </i-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      vCodeUrl: this.$store.state.serviceRoot + '/common/verifycode',
      msgText: '获取短信验证码',
      count: 0,
      formUser: {
        account: localStorage.getItem('ICIOMP.User'),
        psd: localStorage.getItem('ICIOMP.SavePsd') ? localStorage.getItem('ICIOMP.' + localStorage.getItem('ICIOMP.User') + '.Password') : '',
        msgCode: '',
        // vcode: '',
        isSavePsd: localStorage.getItem('ICIOMP.SavePsd') === 'true',
        autoLogin: localStorage.getItem('ICIOMP.AutoLogin') === 'true'
      },
      ruleUser: {
        account: [
          {required: true, message: '登录帐号不能为空！', trigger: 'blur'},
          {type: 'string', min: 5, message: '登录帐号长度不能小于5位！', trigger: 'change'}
        ],
        psd: [
          {required: true, message: '登录密码不能为空！', trigger: 'blur'},
          {type: 'string', min: 6, message: '登录密码长度不能小于6位！', trigger: 'change'}
        ],
        // vcode: [
        //   {required: true, message: '验证码不能为空！', trigger: 'blur'},
        //   {type: 'string', len: 4, message: '验证码长度必须为4位！', trigger: 'change'}
        // ],
        msgCode: [
          {required: true, message: '短信验证码不能为空！', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    sendMsg () {
      this.$httpReq('/common/sendCode', this.formUser, 'get', (res) => {
        switch (res.data.code) {
          case 0:
            this.count = 120
            this.countdown()
            break
          case 1002: // 用户名不存在
          case 1004: // 预留手机号码不正确
            this.$Message.error(res.data.msg)
            break
          default:
        }
      })
    },
    countdown () {
      if (this.count < 1) {
        this.msgText = '重新获取验证码'
      } else {
        this.msgText = '(' + this.count + ')验证码已发送'
        setTimeout(this.countdown, 1000)
        this.count--
      }
    },
    loadPassword () {
      if (this.formUser.isSavePsd) {
        this.formUser.psd = localStorage.getItem('ICIOMP.' + this.formUser.account + '.Password')
      }
    },
    getCode () {
      this.vCodeUrl = this.$store.state.serviceRoot + '/common/verifycode?r=' + Math.random()
    },
    login (name) {
      localStorage.setItem('ICIOMP.User', this.formUser.account)
      localStorage.setItem('ICIOMP.SavePsd', this.formUser.isSavePsd)
      localStorage.setItem('ICIOMP.AutoLogin', this.formUser.autoLogin)
      if (this.formUser.isSavePsd) {
        localStorage.setItem('ICIOMP.' + this.formUser.account + '.Password', this.formUser.psd)
      } else {
        localStorage.removeItem('ICIOMP.' + this.formUser.account + '.Password')
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$httpReq('/login', this.formUser, 'login', (res) => {
            switch (res.data.code) {
              case 0:
                this.$store.commit('setCurrentUser', res.data.data)
                sessionStorage.setItem('currentUser', JSON.stringify(res.data.data))
                this.$store.commit('login')
                break
              case 1001: // 验证码不正确
              case 1002: // 用户帐号不存在
              case 1003: // 登录密码不正确
                this.getCode()
                this.$Message.error(res.data.msg)
                this.formUser.autoLogin = false
                this.$store.commit('setCurrentUser', null)
                sessionStorage.setItem('currentUser', null)
                this.$store.commit('logout')
                break
              default:
            }
          })
        } else {
          this.$Message.error('信息填写有误！')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bg {
    background: url(../assets/loginBg.jpg);
    background-size: cover;
    height: 100vh;
    padding-right: 10%;
    padding-top: 8%;
  }
  .sys-title {
    font-size: 24px;
    color: #ffffff;
    height: 100px;
    line-height: 100px;
    text-align:right;
  }
  .login-box {
    background: #ffffff;
    height: 300px;
    width: 300px;
    border: solid 1px #808695;
    box-shadow: 1px 1px 5px;
    padding: 15px;
    margin-right: 28px;
    opacity: 0.75;
    float: right;
  }
</style>
