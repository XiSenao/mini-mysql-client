<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import cache from './utils/cache'
  import { mapState } from 'vuex'
  export default {
  　name: 'App',
    created () {
      // 在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
      } 

      // 在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
        cache.set('mysqlInfo', this.mysqlInfo)
      })
    },
    computed: {
      ...mapState(['mysqlInfo'])
    }
  }
</script>

<style>
  #nprogress .bar {
    background: #ffeb3b !important; 
  }
</style>
