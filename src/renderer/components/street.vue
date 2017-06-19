<template>
  <section class="box">
    <header>
      <h3 class="tag-id">{{tagId}}</h3>
    </header>
    <ul class="list">
      <li v-for="item in items" class="item">
        <Card :item="item"/>
      </li>
    </ul>
  </section>
</template>

<script>
import Rx from 'rxjs/Rx';
import _ from 'lodash';
import camelcaseKeys from 'camelcase-keys';
import Card from './card';

export default {
  components: {
    Card
  },
  props: {
    tagId: {
      type: String,
      required: true
    }
  },
  subscriptions() {
    const {tagId} = this;

    const source$ = Rx.Observable.create(observer => {
      const url = `https://qiita.com/api/v2/tags/${tagId}/items`;
      Rx.Observable.fromPromise(this.$http(url))
        .pluck('data')
        .do(data => console.log('get', tagId, data))
        .map(items => items.map(item => camelcaseKeys(item)))
        .map(items => ({
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
        }))
        .subscribe(({items, fn}) => {
          observer.next(items);
          this.state$.next({fn});
        });
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
