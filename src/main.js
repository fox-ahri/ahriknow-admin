import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import url from './assets/url'

Vue.use(ElementUI);
Vue.use(Vueaxios, axios)
Vue.prototype.url = url

Vue.config.productionTip = false

Vue.directive('focus', function (el, option) {
  var defClass = 'el-input', defTag = 'input';
  var value = option.value || true;
  if (typeof value === 'boolean')
    value = { cls: defClass, tag: defTag, foc: value };
  else
    value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false };
  if (el.classList.contains(value.cls) && value.foc)
    el.getElementsByTagName(value.tag)[0].focus();
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
