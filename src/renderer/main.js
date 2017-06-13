import Vue from 'vue';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(VueRx, Rx);
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app');
