theme.get<template>
  <section
    class="street__box"
    :style="{
      minWidth: street.width + 'px',
      maxWidth: street.width + 'px'
  }">
    <header
      class="street__header"
      draggable="true"
      ref="header"
    >
      <div class="header__left"></div>
      <h3
        class="header__title"
        :class="theme && theme.get('headerTitle')"
        v-text="theme ? street.title : ''"
      />
      <div class="header__right">
        <button
          class="header__button" :class="theme && theme.get('headerButton')"
          v-stream:click="delete$"
        >
          <Octicon name="x"/>
        </button>
      </div>
    </header>
    <Prdiv
      :onRefresh="handleRefresh"
      :message="message"
      :messageStyle="messageStyle"
      :svgStyle="svgStyle"
    >
      <div
        class="list"
        v-stream:scroll="scroll$"
      >
        <transition-group
          appear
          tag="ul"
          name="item"
          class="list"
        >
          <li
            v-for="item in items"
            :key="item.id"
            class="item">
            <Card :theme="theme" :item="item"/>
          </li>
          <li
            :key="'loading'">
            <Loading :loading="loading"/>
          </li>
        </transition-group>
      </div>
    </Prdiv>
  </section>
</template>

<script>
import R from 'ramda';
import Rx from 'rxjs/Rx';
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/x';
import _ from 'lodash';
import camelcaseKeys from 'camelcase-keys';
import Prdiv from 'vue-prdiv/components/Prdiv';
import Street from '../records/street';
import Card from './card';
import Loading from './loading';

const uniqById = R.uniqBy(item => item.id);

export default {
  components: {
    Octicon,
    Prdiv,
    Card,
    Loading
  },
  props: {
    street: {
      required: true
    }
  },
  methods: {
    handleRefresh() {
      return new Promise(resolve => {
        this.getItems$.next({
          type: 'LOAD',
          ctx: {resolve}
        });
        const subscription = this.state$.subscribe(
          state => {
            if (state.type === 'LOAD') {
              resolve();
            }
          }
        )
      });
    }
  },
  data() {
    return {
      page: 1,
      loading: false,
      svgStyle: {
        stroke: '#2bc483'
      },
      message: 'Loading...',
      messageStyle: {
        color: '#2bc483'
      }
    }
  },
  watch: {
    street(street, oldStreet) {
      if (street.title !== oldStreet.title) {
        this.getItems$.next({
          type: 'CHANGE',
        });
      }
    }
  },
  domStreams: [/* 'scroll$' */, 'delete$'],
  subscriptions() {
    const self = this;
    this.subscriptions = [];

    this.getItems$ = new Rx.Subject()
      .do(() => console.log('Called: getItems$'))
      .switchMap(({type, ctx}) => {
        if (type === 'CHANGE') {
          return Rx.Observable.of([type, {}, this.street.items.toArray()]);
        }

        if (type === 'INIT' && this.street.items.size > 0) {
          return Rx.Observable.of([type, {}, this.street.items.toArray()]);
        }

        return Rx.Observable.forkJoin(
          Rx.Observable.of(type),
          Rx.Observable.of(ctx),
          Rx.Observable
           .fromPromise(this.$http((type => {
             if (type === 'LOAD') {
               return this.street.api.firstUrl;
             }
             return this.street.api.url;
           })(type)))
           .pluck('data')
           .do(data => console.log('get', self.title, data))
           .map(items => items.map(item => {
             const _item = camelcaseKeys(item)
             _item.user = camelcaseKeys(_item.user);
             return _item;
           }))
        )
      })
      .map(([type, ctx, items]) => {
        return {
          type,
          items: items,
          fn(state) {
            const streetIdx = state.findStreet(self.street);
            const street = state.streets.get(streetIdx);
            if (typeof street === 'undefined') {
              return state;
            }

            switch (type) {
              case 'CHANGE': {
                console.log(self.street);
                return state.merge({
                  type,
                  // streets: state.streets.set(streetIdx, self.street)
                });
              }
              case 'INIT': {
                const nextStreet = street
                  .addItems(items)
                  .pageIncrement();
                return state.merge({
                  type,
                  streets: state.streets.set(streetIdx, nextStreet)
                });
              }
              case 'NEXT': {
                const nextStreet = street
                  .addItems(items)
                  .pageIncrement();
                return state.merge({
                  type,
                  streets: state.streets.set(streetIdx, nextStreet)
                });
              }
              case 'LOAD': {
                if (!street.isChanged(items)) {
                  ctx.resolve();
                  return state;
                }

                new Notification(`Updated ${self.street.title}`, {
                  silent: true,
                });

                const nextStreet = street.addItemsIntoHead(items);
                return state.merge({
                  type,
                  streets: state.streets.set(streetIdx, nextStreet)
                });
              }
              default: {
                console.log(`Do not expect type: ${type}`);
                return state;
              }
            }
          }
        }
      })
      .do(() => self.loading = false);

    const source$ = Rx.Observable.create(observer => {
      const subscription = this.getItems$
        .scan((oldData, data) => {
          if (data.type === 'CHANGE') {
            return {
              ...data,
              items: data.items,
            };
          } else if (data.type === 'LOAD') {
            return {
              ...data,
              items: uniqById([...data.items, ...oldData.items]),
            }
          }

          return {
            ...data,
            items: uniqById([...oldData.items, ...data.items]),
          }
        }, {items: []})
        .subscribe(({type, items, fn}) => {
          observer.next(items);
          this.state$.next({fn});
        });
      this.subscriptions.push(subscription);
      this.getItems$.next({type: 'INIT'});
    });


    (() => {
      const subscription = this.delete$
        .subscribe(() => {
          const fn = state => {
            const idx = state.streets.findIndex(street => {
              switch (street.type) {
                case Street.types.TAG: {
                  const lens = R.lensPath(['context', 'tagId']);
                  const view = R.view(lens);
                  return view(street) === view(self.street);
                }
                case Street.types.SEARCH: {
                  const lens = R.lensPath(['context', 'searchText']);
                  const view = R.view(lens);
                  return view(street) === view(self.street);
                }
                default: {
                  debugger;
                  throw new Error('おかしい');
                }
              }
            });

            if (idx === -1) {
              return state;
            }

            return state.merge({
              streets: state.streets.delete(idx)
            });
          }
          this.state$.next({fn});
        });
      this.subscriptions.push(subscription);
    })();

    (() => {
      const intervalSubject$ = new Rx.Subject();

      console.log(this.intervalMinute, 'aslkdjfalsdf');

      const interval$ = new Rx.Observable(observer => {
        let tid = null;
        /**
         * 3分に一度データを取得する
         */
        const reserveLoad = () => {
          return setTimeout(() => {
            console.log('Try LOAD');
            this.getItems$.next({
              type: 'LOAD',
              ctx: {resolve() {}},
            });
            observer.next();
            tid = reserveLoad();
          }, 1000 * 60 * (this.intervalMinute || 3));
        }

        tid = reserveLoad();

        intervalSubject$
          .subscribe(next => {
            if (next.type !== 'LOAD') {
              clearTimeout(tid);
              tid = reserveLoad();
            }
          })
      });

      this.scroll$ = new Rx.Subject();
      const scroll$ = this.scroll$
        .throttleTime(50)
        .do(() => {
          intervalSubject$.next({type: 'NEXT'});
        })
        .debounceTime(50)
        .map(({event}) => {
          const {scrollHeight, scrollTop, clientHeight} = event.target;
          return {
            height: scrollHeight - clientHeight,
            top: scrollTop
          };
        })
        .pairwise()
        .map(([oldScroll, newScroll]) => {
          if (oldScroll.top >= newScroll.top) {
            return false;
          }

          const isAlmostBottom = (() => {
            const height = newScroll.height;
            return newScroll.top / height > 0.9;
          })();
          return isAlmostBottom;
        })
        .switchMap(bool => {
          if (bool) {
            self.loading = true;
            this.getItems$.next({type: 'NEXT'});
          }
          return Rx.Observable.never();
        })

      // const subscription = Rx.Observable.race(
      //   interval$,
      //   scroll$,
      // ).subscribe();
      // const
      this.subscriptions.push(interval$.subscribe());
      this.subscriptions.push(scroll$.subscribe());
    })();

    return {
      theme: this.state$.pluck('theme'),
      intervalMinute: this.state$.pluck('intervalMinute'),
      items: source$,
    };
  },
  mounted() {
    this.$refs.header.addEventListener('dragstart', ev => {
      this.state$.next({
        type: 'DRAGSTART',
        fn: state => {
          return state.merge({
            control: state.control.set('from', this.street)
          });
        }
      });
    })

    this.$refs.header.addEventListener('dragover', ev => {
      this.state$.next({
        type: 'DRAGOVER',
        fn: state => {
          if (state.control.get('to') === this.street) {
            return state;
          }

          return state.merge({
            control: state.control.set('to', this.street)
          });
        }
      });
    });

    this.$refs.header.addEventListener('dragend', ev => {
      this.state$.next({
        type: 'DRAGEND',
        fn: state => {
          const fromStreet = state.control.get('from');
          const toStreet = state.control.get('to');
          if (fromStreet === toStreet) {
            return state;
          }

          const fromStreetIdx = state.streets.findIndex(s => s === fromStreet);
          const toStreetIdx = state.streets.findIndex(s => s === toStreet);

          if (fromStreetIdx === -1 || toStreetIdx === -1) {
            return state;
          }

          return state.merge({
            streets: state.streets
              .update(fromStreetIdx, () => toStreet)
              .update(toStreetIdx, () => fromStreet),
            control: state.control.delete()
          });
        }
      });
    })
  },
  beforeDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
</script>

<style scoped>
  .street__box {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .street__header {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
  }
  .header__title {
    padding: .5em;
  }
  .header__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .header__button {
    border: none;
    background: transparent;
    margin-top: 5px;
    margin-right: .5em;
    cursor: pointer;
  }
  .prdiv-box {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .list {
    overflow: auto;
  }
  .item {
    opacity: 1;
    transition: opacity .5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .item-enter,
  .item-leave-to {
    will-change: opacity;
    opacity: 0;
  }
</style>
