import Vue from 'vue'
import App from './App'
import router from './router'
// 依赖axios
import axios from './http'
// 依赖全局样式
import './assets/css/global.css'
// 依赖字体图标css
import './assets/fonts/iconfont.css'
// 依赖element-ui
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(elementui, {size: 'small'})
Vue.config.productionTip = false

// 利用原型实现全局使用axios
Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
