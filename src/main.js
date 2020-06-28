import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'bootstrap'
// import $ from 'jquery'  
// window.$ = $
// window.jQuery = $
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import './assets/js/scrolloverflow'
import fullPage from 'vue-fullpage';

Vue.use(fullPage);

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(codemirror)
// import './assets/css/test.css'

import iView from 'iview'
import 'iview/dist/styles/iview.css'  
// console.log(this.$Notice)
Vue.use(iView)
// console.log(this.$Notice)
import './assets/css/fullpage.min.css'
import './assets/css/owl.carousel.css'
import './assets/css/animate.css'
import './assets/css/templatemo-style.css'
import './assets/css/responsive.css'

import { Notice } from 'iview'
import './permission'

Vue.prototype.$Notice = Notice
Vue.prototype.$Message.config({
  top: 100,
  duration: 3
});
Vue.prototype.$Notice.config({
  top: 70,
  duration: 3
});
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
