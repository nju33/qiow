import Vue from 'vue';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';
import themes from './themes';
import init from './init';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
const token = 'f7856900d72be64a29742bf5fc278ba11ad8ac2c';
const http = axios.create({
  headers: {
    Authorization: `Bearer ${token}`
  }
})
Vue.http = Vue.prototype.$http = http;
Vue.config.productionTip = false;

const storeSubject$ = new Rx.ReplaySubject(1)
  .scan(function (state, {fn}) {
    return fn(state);
  }, null);
Vue.prototype.state$ = storeSubject$.share();


if (process.env.NODE_ENV !== 'production') {
  Vue.prototype.state$
    .do(state => console.log('Next: ', state))
    .subscribe(state => {
      this.$store = state;
    })
}

Vue.prototype.state$.next({
  fn(state) {
    return {
      streets: [
        {
          tagId: 'nodejs',
          items: []
        },
        {
          tagId: 'javascript',
          items: []
        },
      ],
      detail: null,
      route: 'list'
    };
  }
});

init(Vue);

Vue.prototype.$themename = 'light';
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
