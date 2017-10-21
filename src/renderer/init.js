import Rx from 'rxjs/Rx';
import camelcaseKeys from 'camelcase-keys';
import Street from './records/street';
import {loadData} from './storage';
import themes from './themes';

export default (Vue) => {
  // const config$ = Rx.Observable.fromPromise(loadConfig())
  const data$ = Rx.Observable.fromPromise(loadData());
  // const user$ = Rx.Observable.fromPromise(
  //   Vue.prototype.$http('https://qiita.com/api/v2/users/nju33')
  // )
  // .pluck('data')
  // .map(data => camelcaseKeys(data));

  // Rx.Observable.create(observer => {
  Rx.Observable.forkJoin(
    data$,
    // user$
  )
  .switchMap(([data]) => {
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
        Rx.Observable.of(data),
        user$,
      );
    }
    return Rx.Observable.forkJoin(
      Rx.Observable.of(data),
    )
  })
  .subscribe(([data, user]) => {
    // console.log({config,data,user});
    data.streets = data.streets.map(s => {
      return new Street(s)
    });

    const {classes: theme} = themes[data.themename || 'light'].attach();
    data.theme = theme;

    data.intervalMinute = data.intervalMinute || 3;

    if (data && ({}).hasOwnProperty.call(data, 'userId')) {
      delete data.userId;
    }

    Vue.prototype.state$.next({
      fn(state) {
        return state.merge({...data, user});
      }
    });
  });
  // }).subscribe();
}
