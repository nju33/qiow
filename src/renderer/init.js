import Rx from 'rxjs/Rx';
import camelcaseKeys from 'camelcase-keys';
import Street from './records/street';
import {loadConfig, loadData} from './storage';

export default (Vue) => {
  const config$ = Rx.Observable.fromPromise(loadConfig())
  const data$ = Rx.Observable.fromPromise(loadData());
  // const user$ = Rx.Observable.fromPromise(
  //   Vue.prototype.$http('https://qiita.com/api/v2/users/nju33')
  // )
  // .pluck('data')
  // .map(data => camelcaseKeys(data));

  // Rx.Observable.create(observer => {
  Rx.Observable.forkJoin(
    config$,
    data$,
    // user$
  )
  .switchMap(([config, data]) => {
    if (data && data.userId) {
      /**
       * 今は使ってないけど残しとく
       */
      const user$ = Rx.Observable.fromPromise(
        Vue.prototype.$http(`https://qiita.com/api/v2/users/${data.userId}`)
      )
        .pluck('data')
        .map(data => camelcaseKeys(data));

      return Rx.Observable.forkJoin(
        Rx.Observable.of(config),
        Rx.Observable.of(data),
        user$,
      );
    }
    return Rx.Observable.forkJoin(
      Rx.Observable.of(config),
      Rx.Observable.of(data),
    )
  })
  .subscribe(([config, data, user]) => {
    // console.log({config,data,user});
    data.streets = data.streets.map(s => {
      return new Street(s)
    });

    if (data && ({}).hasOwnProperty.call(data, 'userId')) {
      delete data.userId;
    }

    Vue.prototype.state$.next({
      fn(state) {
        return state.merge({config, ...data, user});
      }
    });
  });
  // }).subscribe();
}
