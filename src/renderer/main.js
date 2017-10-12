import 'intersection-observer';
import smoothscroll from 'smoothscroll-polyfill';
import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import {List} from 'immutable';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import axios from 'axios';
import App from './App';
import router from './router';
import store from './store';
import {loadData, saveData} from './storage';
import State from './records/state';
import Street from './records/street';
import themes from './themes';
import init from './init';

smoothscroll.polyfill();

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
  }, null)
  .pairwise()
  .switchMap(([prevState, state]) => {
    console.log(prevState === state);
    if (prevState === state) {
      return Rx.Observable.never();
    }
    return Rx.Observable.of(state);
  });
Vue.prototype.state$ = storeSubject$.share();


if (process.env.NODE_ENV !== 'production') {
  Vue.prototype.state$
    .do(state => console.log('Next: ', state))
    .subscribe(state => {
      this.$store = state;
      saveData(state.export());
    })
}

Vue.prototype.state$.next({
  fn() {
    return new State({
      // streets: new List([
      //   new Street({
      //     type: 'TAG',
      //     context: {tagId: 'nodejs'}
      //   }),
      //   new Street({
      //     type: 'TAG',
      //     context: {tagId: 'javascript'}
      //   }),
      //   new Street({
      //     type: 'SEARCH',
      //     context: {searchText: 'aws'}
      //   })
      // ])
    });
  }
});

init(Vue);

Vue.prototype.$themename = 'light';
Vue.prototype.$theme = (() => {
  const {classes} = themes.light.attach();
  return classes;
})();

Vue.use(VueRx, Rx);
Vue.use(VueLazyload);
new Vue({
  components: {App},
  router,
  // store,
  template: '<App/>'
}).$mount('#app');
