<template>
  <section class="street__box">
    <header class="street__header">
      <div class="header__left"></div>
      <h3 class="header__title">{{tagId}}</h3>
      <div class="header__right">
        <button
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
            <Card :item="item"/>
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
import Rx from 'rxjs/Rx';
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/x';
import _ from 'lodash';
import camelcaseKeys from 'camelcase-keys';
import Prdiv from 'vue-prdiv/components/Prdiv';
import Card from './card';
import Loading from './loading';

export default {
  components: {
    Octicon,
    Prdiv,
    Card,
    Loading
  },
  props: {
    tagId: {
      type: String,
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
  domStreams: ['scroll$', 'delete$'],
  subscriptions() {
    const self = this;
    this.subscriptions = [];

    this.getItems$ = new Rx.Subject()
      .do(() => console.log('Called: getItems$'))
      .switchMap(({type, ctx}) => {
        const page = (() => {
          if (type === 'NEXT') {
            return this.page;
          }
          return 1;
        })();
        const query = `?page=${page}`
        const url = `https://qiita.com/api/v2/tags/${self.tagId}/items${query}`;

        return Rx.Observable.forkJoin(
          Rx.Observable.of(type),
          Rx.Observable.of(ctx),
          Rx.Observable
           .fromPromise(this.$http(url))
           .pluck('data')
           .do(data => console.log('get', self.tagId, data))
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
            const streetIdx = state.findStreet(self.tagId);
            const street = state.streets.get(streetIdx);
            if (typeof street === 'undefined') {
              return state;
            }

            switch (type) {
              case 'INIT': {
                const nextStreet = street.addItems(items);
                return state.merge({
                  type,
                  streets: state.streets.set(streetIdx, nextStreet)
                });
              }
              case 'NEXT': {
                self.page++;
                const nextStreet = street.addItems(items);
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
          return {
            ...data,
            items: [...oldData.items, ...data.items]
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
            const nextState = Object.assign({}, state);
            const idx = nextState.streets.findIndex(s => s.tagId === self.tagId);

            if (idx === -1) {
              return state;
            }
            nextState.streets.splice(idx, 1);
            return nextState;
          }
          this.state$.next({fn});
        });
      this.subscriptions.push(subscription);
    })();

    (() => {
      const subscription = this.scroll$
        .throttleTime(50)
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
        .subscribe();
      this.subscriptions.push(subscription);
    })();

    return {
      items: source$,
    };
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
    text-align: center;
    padding: .5em;
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
