<template>
  <section class="box">
    <header>
      <h3 class="tag-id">{{tagId}}</h3>
    </header>
    <Prdiv
      :onRefresh="handleRefresh"
      :message="'Loading...'"
      :messageStyle="{
        color: '#2bc483'
      }"
      :svgStyle="{
        stroke: '#2bc483'
      }"
    >
      <ul
        class="list"
        v-stream:scroll="scroll$"
      >
        <li v-for="item in items" class="item">
          <Card :item="item"/>
        </li>
        <li>
          <Loading :loading="loading"/>
        </li>
      </ul>

    </Prdiv>
  </section>
</template>

<script>
import Rx from 'rxjs/Rx';
import _ from 'lodash';
import camelcaseKeys from 'camelcase-keys';
import Prdiv from 'vue-prdiv/components/Prdiv';
import Card from './card';
import Loading from './loading';

export default {
  components: {
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
        // const source$ = Rx.Observable.create(observer => {
        this.getItems$.next({type: 'LOAD'});
          // this.createItemsSource()
            // .subscribe(({items, fn}) => {
            //   console.log(999);
            //   observer.next(items);
            //   this.state$.next({fn});
            //   resolve();
            // });
        // });
      });
    },
    // createItemsSource() {
    //   const {tagId} = this;
    //   const url = `https://qiita.com/api/v2/tags/${tagId}/items`;
    //
    //   return Rx.Observable.fromPromise(this.$http(url))
    //     .pluck('data')
    //     .do(data => console.log('get', tagId, data))
    //     .map(items => items.map(item => camelcaseKeys(item)))
    //     .map(items => ({
    //       items,
    //       fn(state) {
    //         const newState = Object.assign({}, state);
    //         const idx = newState.streets.findIndex(s => s.tagId === tagId);
    //         if (idx > -1) {
    //           const target = newState.streets[idx];
    //           target.items = _.uniqBy(target.items.concat(items), item => {
    //             return item.id;
    //           });
    //         }
    //         return newState;
    //       }
    //     }));
    // }
  },
  data() {
    return {
      page: 1,
      loading: false
    }
  },
  domStreams: ['scroll$'],
  subscriptions() {
    const self = this;

    this.getItems$ = new Rx.Subject()
      .do(() => console.log('Called: getItems$'))
      .switchMap(({type}) => {
        const query = `?page=${this.page}`
        const url = `https://qiita.com/api/v2/tags/${self.tagId}/items${query}`;
        return Rx.Observable.forkJoin(
          Rx.Observable.of(type),
          Rx.Observable
           .fromPromise(this.$http(url))
           .pluck('data')
           .do(data => console.log('get', self.tagId, data))
           .map(items => items.map(item => camelcaseKeys(item)))
        )
      })
      .do(() => this.page++)
      .map(([type, items]) => {
        return {
          type,
          items: items,
          fn(state) {
            const nextState = Object.assign({}, state);
            const idx = nextState.streets.findIndex(s => {
              return s.tagId === self.tagId;
            });
            if (idx === -1) {
              return nextState;
            }

            const target = nextState.streets[idx];

            switch (type) {
              case 'INIT': {
                const nextItems = _.uniqBy(target.items.concat(items), item => {
                  return item.id;
                });
                target.items = nextItems;
              }
              case 'NEXT': {
                const nextItems = _.uniqBy(target.items.concat(items), item => {
                  return item.id;
                });
                target.items = nextItems;
              }
              default: {
                console.log(`Do not expect type: ${type}`);
              }
            }

            self.loading = false;
            return nextState;
          }
        }
      })
      .do(() => console.log(123123))
      .do(() => self.loading = false);

    const source$ = Rx.Observable.create(observer => {
      this.getItems$
        .scan((oldData, data) => {
          return {
            ...data,
            items: [...oldData.items, ...data.items]
          }
        }, {items: []})
        .subscribe(({type, items, fn}) => {
          console.log(items);
          observer.next(items);
          this.state$.next({fn});
        });
      this.getItems$.next({type: 'INIT'});
    });

    this.scroll$
      .throttleTime(150)
      .map(({event}) => {
        const {scrollHeight, scrollTop, clientHeight} = event.currentTarget;
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
          return newScroll.top / height > 0.85;
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

    return {
      items: source$
    };
  },
  mounted() {
  }
}
</script>

<style scoped>
  .box {
    height: 100vh;
    /*box-sizing: border-box;*/
    /*border: solid #ccc;*/
    /*border-width: 0 1px;*/
    display: flex;
    flex-direction: column;
  }
  .tag-id {
    text-align: center;
  }
  .prdiv-box {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .list {
    display: block;
    overflow: auto;
  }
</style>
