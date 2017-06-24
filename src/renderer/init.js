import Rx from 'rxjs/Rx';
import camelcaseKeys from 'camelcase-keys';
import {getConfig} from './storage';

export default (Vue) => {
  const config$ = Rx.Observable.fromPromise(getConfig());
  const user$ = Rx.Observable.fromPromise(
    Vue.prototype.$http('https://qiita.com/api/v2/users/nju33')
  )
  .pluck('data')
  .map(data => camelcaseKeys(data));

  Rx.Observable.create(observer => {
    Rx.Observable.forkJoin(
      config$,
      user$
    )
    .subscribe(([config, user]) => {
      Vue.prototype.state$.next({
        fn(state) {
          return state.merge({config, user});
        }
      });
    });
  }).subscribe();
}
