import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import vueLazyload from 'vue-lazyload'

// 样式
import 'common/stylus/index.styl'

// fastclick(解决移动端300ms点击延迟)
fastclick.attach(document.body)

// 图片懒加载
Vue.use(vueLazyload, {
  loading: require('common/image/default.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
