<template>
  <div class="box">
    <Street v-for="tagId in followingTagIds" :tagId="tagId" :key="tagId"/>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import Street from './street';

export default {
  props: {
    themes: Object
  },
  name: 'board',
  components: {
    Street
  },
  data() {
    return {
      followingTagIds: ['nodejs', 'javascript']
    };
  },
  subscriptions() {
    return {
      msg: Rx.Observable.create(function (observer) {
        console.log(observer);
        observer.next(42);
        observer.complete();

        // Note that this is optional, you do not have to return this if you require no cleanup
        return function () {
            console.log('disposed');
        };
      }),
      // street: Rx.Observable.fromPromise(this.$http('https://qiita.com/api/v2//tags/nodejs/items'))
        // .pluck('data')
        // .scan(())
    };
  },
  methods: {
    // open (link) {
    //   this.$electron.shell.openExternal(link)
    // }
  },
  mounted() {
    this.$observables.msg.subscribe(msg => console.log(msg))
    // this.$observables.street.subscribe(s => console.log(s))
  }
}
</script>

<style>
  body {
    font: 12.5px / 1.5 -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", sans-serif;
    margin: 0;
    max-height: 100vh;
    overflow: hidden;
  }
  h3 {
    margin: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>

<style scoped>
  .box {
    display: flex;
  }

  .box > * {
    flex: auto;
    max-width: 32em;
    min-width: 32em;
  }
</style>
