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
      <ul class="list">
        <li v-for="item in items" class="item">
          <Card :item="item"/>
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

export default {
  components: {
    Prdiv,
    Card
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
  subscriptions() {
    const {tagId} = this;
    const url = `https://qiita.com/api/v2/tags/${tagId}/items`;
    // const source$ = Rx.Observable.create(observer => {
    //   this.createItemsSource()
    //     .subscribe(({items, fn}) => {
    //       observer.next(items);
    //       this.state$.next({fn});
    //     });
    // });
    this.getItems$ = new Rx.Subject()
      .flatMap(({type}) => {
        return Rx.Observable.forkJoin(
          Rx.Observable.of(type),
          Rx.Observable
           .fromPromise(this.$http(url))
           .pluck('data')
           .do(data => console.log('get', tagId, data))
           .map(items => items.map(item => camelcaseKeys(item)))
        )
      })
      .map(([type, items]) => ({
        type,
        items,
        fn(state) {
          const newState = Object.assign({}, state);
          const idx = newState.streets.findIndex(s => s.tagId === tagId);
          if (idx > -1) {
            const target = newState.streets[idx];
            target.items = _.uniqBy(target.items.concat(items), item => {
              return item.id;
            });
          }
          return newState;
        }
      }));

    const source$ = Rx.Observable.create(observer => {
      this.getItems$
        .subscribe(({type, items, fn}) => {
          if (type === 'INIT') {
            observer.next(items);
            this.state$.next({fn});
          }
        });
      this.getItems$.next({type: 'INIT'});
    });

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
  .list {
    display: block;
    overflow: auto;
  }
</style>
