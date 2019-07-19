// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'babel-polyfill'
import echarts from 'echarts'
import Axios from 'axios'
Axios.defaults.withCredentials = true

Vue.use(Vuex)
Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$Axios = Axios
Vue.prototype.$httpReq = function (url, data, type, todo) {
  // this.$Loading.start()
  this.$Spin.show({
    render: (h) => {
      return h('div', [
        h('Icon', {
          props: {
            type: 'ios-loading',
            size: 48
          },
          style: {
            animation: 'ani-demo-spin 1s linear infinite'
          }
        }),
        h('div', {style: {fontSize: '20px'}}, '正在加载')
      ])
    }
  })
  let req = null
  switch (type.toUpperCase()) {
    case 'EDIT':
    case 'PUT':
      req = Axios.put(this.$store.state.serviceRoot + url, data)
      break
    case 'ADD':
    case 'POST':
      req = Axios.post(this.$store.state.serviceRoot + url, data)
      break
    case 'DEL':
    case 'DELETE':
      req = Axios.delete(this.$store.state.serviceRoot + url)
      break
    case 'LOGIN':
      req = Axios.post(this.$store.state.serviceRoot + url,
        'account=' + data.account + '&psd=' + data.psd + '&msgCode=' + data.msgCode)
      break
    case 'GET':
    default:
      req = Axios.get(this.$store.state.serviceRoot + url + '?r=' + Math.random(), {params: data})
  }
  req.then((res) => {
    this.$Spin.hide()
    // this.$Loading.finish()
    switch (res.data.code) {
      case 0: // 成功
        // this.$Message.success(res.data.msg)
        todo(res)
        break
      case 1001: // 验证码不正确
      case 1002: // 用户帐号不存在
      case 1003: // 登录密码不正确
      case 1004: // 预留的手机号不正确
        todo(res)
        break
      case 1100: // 当前登录已失效
        // this.$Message.error(res.data.msg)
        this.$store.commit('logout')
        break
      default:
        this.$Message.error({
          duration: 15,
          content: res.data.msg + '<br />' + res.data.data,
          closable: true
        })
    }
  }).catch((err) => {
    this.$Spin.hide()
    if (err.request.status === 403 && err.response.data.code === 1101) {
      this.$Modal.confirm({
        title: '更换用户登录',
        content: '当前登录的用户没有相关的操作权限！<br />您是否要换个用户试试？',
        onOk: () => {
          Axios.get(this.$store.state.serviceRoot + '/logout')
            .then((res) => {
              this.$store.commit('setCurrentUser', null)
              sessionStorage.setItem('currentUser', null)
              this.$store.commit('logout')
            })
        }
      })
    } else {
      this.$Message.error({
        duration: 60,
        content: err.toString(),
        closable: true
      })
    }
  })
}

const store = new Vuex.Store({
  state: {
    loginFlag: sessionStorage.getItem('isLogin') === 'true',
    // serviceRoot: 'http://localhost:8280',
    serviceRoot: '/iciomp',
    tags: ['home'],
    currentPage: 'home',
    openMenus: [],
    currentUser: JSON.parse(sessionStorage.getItem('currentUser')),
    currentLevel: 0
  },
  mutations: {
    login (state) {
      state.loginFlag = true
      sessionStorage.setItem('isLogin', true)
    },
    logout (state) {
      sessionStorage.setItem('isLogin', false)
      sessionStorage.setItem('currentUser', null)
      localStorage.setItem('ICIOMP.AutoLogin', false)
      state.loginFlag = false
    },
    setCurrentPage (state, page) {
      state.currentPage = page
      let t = page.split('-')
      if (t[0] !== 'home') {
        if (state.openMenus.indexOf(t[0]) < 0) {
          state.openMenus.push(t[0])
        }
      }
    },
    addTag (state, tag) {
      if (state.tags.indexOf(tag) < 0) {
        state.tags.push(tag)
      }
    },
    removeTag (state, tag) {
      let pos = state.tags.indexOf(tag)
      if (state.currentPage === tag) {
        if (pos < state.tags.length - 1) {
          state.currentPage = state.tags[pos + 1]
        } else {
          state.currentPage = state.tags[pos - 1]
        }
      }
      state.tags.splice(pos, 1)
    },
    setOpenMenus (state, names) {
      state.openMenus = names
    },
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    setCurrentLevel (state, level) {
      state.currentLevel = level
    },
    closeTags (state, opt) {
      state.tags = ['home']
      if (opt === 'closeAll') {
        state.currentPage = 'home'
        router.push('/')
      } else {
        state.tags.push(state.currentPage)
      }
    }
  }
})

/* eslint-disable no-extend-native */
Date.prototype.format = function (format) {
  let o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    'S': this.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
