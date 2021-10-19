import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import configUrl from './config/index.js'
import $ from 'jquery'
import Vuex from  'vuex'
import store from  './vuex/store'
import codemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import Cookies from 'js-cookie'


Vue.config.productionTip = false
Vue.prototype.axios = axios;
Vue.prototype.config = configUrl;
Vue.use(Element)
Vue.use(Vuex)
Vue.use(Cookies);
Vue.use(codemirror)
Vue.prototype.userInfo=''


var userJsonStr = sessionStorage.getItem('sessionData');
var userEntity = JSON.parse(userJsonStr);
userEntity={
  token:'bb475b3e3c05267426e38ab1d4b844ca',
  cstnetId :'cclhyt@163.com',
  trueName :'王东阳',
}

if(userEntity){
    Vue.prototype.token = userEntity.token;
    Vue.prototype.userInfo = userEntity.trueName;
    Vue.prototype.userId = userEntity.cstnetId;
}


console.log("userEntity", userEntity); // => tom

new Vue({
  router,
    store,
  render: h => h(App),
}).$mount('#app')
