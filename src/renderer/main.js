import Vue from 'vue';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';
import themes from './themes';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
const token = 'f7856900d72be64a29742bf5fc278ba11ad8ac2c';
const http = axios.create({
  headers: {
    Authorization: `Bearer ${token}`
  }
})
Vue.http = Vue.prototype.$http = http;
Vue.config.productionTip = false;

const storeSubject$ = new Rx.Subject()
  .scan(function (state, {fn}) {
    return fn(state);
  }, null);
Vue.prototype.state$ = storeSubject$.share();


Vue.prototype.$theme = (() => {
  const {classes} = themes.light.attach();
  return classes;
})();

Vue.use(VueRx, Rx);
new Vue({
  components: {App},
  router,
  // store,
  template: '<App/>'
}).$mount('#app');
