import Vue from 'vue'
import demo from './demo/demo.vue'
import imageEditor from "./install.js"

Vue.config.productionTip = false

Vue.use(imageEditor, {
  sizeView: 'lg'
})

new Vue({
  render: h => h(demo),
}).$mount('#app')
