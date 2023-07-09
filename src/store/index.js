import Vue from 'vue'
import Vuex from 'vuex'
import cache from './../utils/cache'

Vue.use(Vuex)

/**
 * 
 * 
    time: '',
    user: '',
    type: '',
    code: '',
    result: '',
    showDetail: {
      'title': [],
      'value': []
    }
 */
function combineData (payload = []) {
  let flags = payload.filter(res => !!res.flag)
  let unflags = payload.filter(res => !res.flag)
  return flags.sort((a, b) => b.time - a.time).concat(unflags.sort((a, b) => b.time - a.time))
}
export default new Vuex.Store({
  state: {
    reload: false,
    userName: cache.get('userName') || '--',
    mysqlInfo: cache.get('mysqlInfo') || [],
    isAuthority: false
  },
  
  getters: {
    mysqlInfo: _ => cache.get('mysqlInfo') || [],
    userName: _ => cache.get('userName') || '--',
    isAuthority: _ => !!cache.get('userName')
  },

  mutations: {
    authority (state, payload) {
      state.isAuthority = payload
      if (!payload) {
        cache.set('userName', null)
      }
    },
    forseReload (state, payload) {
      state.reload = payload
    },
    cacheMysql (state, payload) {
      state.mysqlInfo.push(payload)
      let info = combineData(state.mysqlInfo)
      state.mysqlInfo = info
    },
    resetMysql (state, payload = []) {
      payload = combineData(payload)
      state.mysqlInfo = payload
    },
    setUserName (state, payload) {
      state.userName = payload
      cache.set('userName', payload)
    },
    addFlag (state, payload) {
      let info = state.mysqlInfo.filter(res => res.time === payload.time && res.user === payload.name)[0]
      if (!info) {
        return 
      }
      info.flag = !info.flag
      state.mysqlInfo = combineData(state.mysqlInfo)
    },
    clearStatus () {
      cache.clear()
    }
  },
  actions: {
    
  },
  modules: {
  }
})
