<template>
  <section class="box">
    <header>
      <h3 class="tag-id">{{tagId}}</h3>
    </header>
    <ul class="list">
      <li v-for="item in items" class="item">
        <Card :item="item"></Card>
      </li>
    </ul>
  </section>
</template>

<script>

import Rx from 'rxjs/Rx';
import Card from './card';

export default {
  components: {
    Card
  },
  props: {
    tagId: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    }
  },
  subscriptions() {
    const url = `https://qiita.com/api/v2/tags/${this.tagId}/items`;
    return {
      items: Rx.Observable.fromPromise(this.$http(url))
        .pluck('data')
    };
  },
  mounted() {
    this.$observables.items.subscribe(
      items => console.log(items)
    );
  }
}
</script>

<style scoped>
  .box {
    height: 100vh;
    box-sizing: border-box;
    border: solid #ccc;
    border-width: 0 1px;
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
