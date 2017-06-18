<template>
  <div id="root" class="box">
    <template v-for="tagId in followingTagIds">
      <Street :tagId="tagId" :key="tagId"/>
      <Separator/>
    </template>
    <StreetPlus/>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import Street from './street';
import StreetPlus from './street-plus';
import Separator from './separator';
// import {getTagItemsUrl} from '@/helpers';

export default {
  props: {
    themes: Object
  },
  name: 'board',
  components: {
    Street,
    StreetPlus,
    Separator
  },
  // data() {
    // return {
    //   followingTagIds: ['nodejs', 'javascript']
    // };
  // },
  subscriptions() {
    // this.state$.subscribe(
    //   this.followingTagIds:
    // )
    // this.state$.next({
    //   fn(state) {
    //     return state;
    //   }
    // })
    return {
      followingTagIds: this.state$
        .pluck('streets')
        .map(streets => streets.map(street => street.tagId))
    }
  },
    // const {tagId} = this;
    // const url = `https://qiita.com/api/v2/tags/${tagId}/items`;

    // console.log(99);
    // this.$http(url)
    // Rx.Observable.merge(
    //   this.followingTagIds.map(tagId => (
    //     Rx.Observable.fromPromise(this.$http(getTagItemsUrl(tagId)))
    //   ))
    // )
    //   .pluck('data')
    //   .map(items => ({
    //     fn(state) {
    //       const newState = Object.assign({}, state);
    //       newState.streets.push({tagId, items});
    //       return newState;
    //     }
    //   }))
    //   .subscribe(this.state$);
    // return {
      // msg: Rx.Observable.create(function (observer) {
      //   console.log(observer);
      //   observer.next(42);
      //   observer.complete();
      //
      //   // Note that this is optional, you do not have to return this if you require no cleanup
      //   return function () {
      //       console.log('disposed');
      //   };
      // }),
      // street: Rx.Observable.fromPromise(this.$http('https://qiita.com/api/v2//tags/nodejs/items'))
        // .pluck('data')
        // .scan(())
    // };
  // },
  methods: {
    // open (link) {
    //   this.$electron.shell.openExternal(link)
    // }
  },
  mounted() {

    if (process.env.NODE_ENV !== 'production') {
      this.state$
        .do(state => console.log('Next: ', state))
        .subscribe(state => {
          this.$store = state;
        }
      );
    }

    this.state$.next({
      fn(state) {
        return {
          streets: [
            {
              tagId: 'nodejs',
              items: []
            },
            {
              tagId: 'javascript',
              items: []
            },
          ],
          detail: null,
          route: 'list'
        };
      }
    });
    // console.log(this.state$);
    // this.$observables.msg.subscribe(msg => console.log(msg))
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
  a {
    color: inherit;
    text-decoration: none;
  }
  input,
  textarea,
  button {
    box-sizing: border-box;
    font-size: inherit;
    outline: none;
  }
</style>

<style scoped>
  .box {
    display: flex;
    overflow-x: auto;
  }

  .box > * {
    flex: auto;
    max-width: 32em;
    min-width: 32em;
  }
</style>
