// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
require('./scss/global') // 这里用require如果用import那么就必须放在router下，因为import运行是调用，require是编译时调用
import router from './router'
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.use(VueResource) // 添加到Vue方法里去
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
