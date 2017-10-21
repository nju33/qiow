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
import {
  loadData,
  saveData,
  loadToken,
  saveToken,
  // loadTheme,
  // saveTheme,
} from './storage';
import State from './records/state';
import Street from './records/street';
import themes from './themes';
import init from './init';

smoothscroll.polyfill();

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
runApp();

async function runApp() {
  const token = await loadToken();
  // const token = 'f7856900d72be64a29742bf5fc278ba11ad8ac2c';
  // const themename = await loadTheme();
  // Vue.prototype.$themename = themename;
  // Vue.prototype.$theme = (() => {
  //   console.log(Vue.prototype.$themename)
  //   const {classes} = themes[Vue.prototype.$themename].attach();
  //   return classes;
  // })();

  if (token !== undefined) {
    Vue.http = Vue.prototype.$http = axios.create({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    Vue.http = Vue.prototype.$http = axios.create();
  }
  Vue.config.productionTip = false;

  const storeSubject$ = new Rx.ReplaySubject(1)
    .scan(function (state, {type, fn}) {
      console.log(state)
      try {
        const nextState = fn(state);
        if (type === 'TOKEN') {
          saveToken(nextState.token);
        }
        // else if (type === 'THEME') {
        //   console.log(nextState.toJS())
        //   saveTheme(nextState.theme);
        // }
        return nextState;
      } catch (err) {
        console.error(err)
        return state;
      }
    }, new State({token}))
    .pairwise()
    .switchMap(([prevState, state]) => {
      if (prevState === state) {
        return Rx.Observable.never();
      }
      return Rx.Observable.of(state);
    })
    .do(state => {console.log('state', state)});
  Vue.prototype.state$ = storeSubject$.share();


  Vue.prototype.state$
    .do(state => console.log('Next: ', state))
    .subscribe(state => {
      if (this) {
        this.$store = state;
      }
      saveData(state.export());
    })

  // Vue.prototype.state$.next({
  //   token,
  //   // fn() {
  //   //   return new State({
  //   //     streets: new List([
  //   //       new Street({
  //   //         type: 'TAG',
  //   //         context: {tagId: 'nodejs'}
  //   //       }),
  //   //       new Street({
  //   //         type: 'TAG',
  //   //         context: {tagId: 'javascript'}
  //   //       }),
  //   //       new Street({
  //   //         type: 'SEARCH',
  //   //         context: {searchText: 'aws'}
  //   //       })
  //   //     ])
  //   //   });
  //   // }
  // });

  init(Vue);

  Vue.use(VueRx, Rx);
  Vue.use(VueLazyload);
  // console.log('a', token)
  new Vue({
    // data() {
    //   console.log({token});
    //   return {token};
    // },
    components: {App},
    router,
    // store,
    template: '<App/>'
  }).$mount('#app');
}
