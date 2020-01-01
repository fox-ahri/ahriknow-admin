import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import { url, upload } from './assets/url'
import VueClipboard from 'vue-clipboard2'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
Vue.use(VueClipboard)
Vue.use(ElementUI)
Vue.use(Vueaxios, axios)
Vue.prototype.url = url
Vue.prototype.upload = upload

Vue.config.productionTip = false

Vue.directive('focus', function(el, option) {
    var defClass = 'el-input',
        defTag = 'input';
    var value = option.value || true;
    if (typeof value === 'boolean')
        value = { cls: defClass, tag: defTag, foc: value };
    else
        value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false };
    if (el.classList.contains(value.cls) && value.foc)
        el.getElementsByTagName(value.tag)[0].focus();
})

const i18n = new VueI18n({
    locale: '中文简体',
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
      '中文简体': require('./assets/lang/zh'),
      'English': require('./assets/lang/en')
    }
})

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')