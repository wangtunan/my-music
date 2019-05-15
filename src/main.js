import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

// 样式
import 'common/stylus/index.styl'

// fastclick(解决移动端300ms点击延迟)
import fastclick from 'fastclick'
fastclick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
