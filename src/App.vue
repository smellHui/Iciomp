<template>
  <div id="app">
   <Main v-if="isLogon"></Main>
   <Login v-else></Login>
  </div>
</template>

<script>
import Login from '@/components/Login'
import Main from '@/components/Main'
export default {
  name: 'App',
  data () {
    return {}
  },
  computed: {
    isLogon () {
      return this.$store.state.loginFlag
    }
  },
  mounted () {
    window.onpopstate = () => {
      history.pushState(null, null, location.href)
      history.go(1)
    }
  },
  components: {
    Login,
    Main
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
