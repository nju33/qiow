<template>
  <div>
    <section class="box">
      <div>
        <span class="user">{{item.user.id}}</span>
        <em
          class="title"
          style="color:#005CAF"
          v-stream:click="{
            subject: showDetail$,
            data: item
          }"><a>{{item.title}}</a></em>
      </div>
    </section>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  // data() {
  //   return {
  //     showDetailSubscription: this.state$.subscribe(a => console.log(a))
  //   };
  // },
  domStreams: ['showDetail$'],
  subscriptions() {
    // console.log(9); // this.showDetail$ = new Rx.Subject();
    // const a = (ew Rx.Subject()).map(() => {route: 'detail'});

    this.showDetail$
      .pluck('data')
      .map(data => ({
        type: this.showDetail$,
        fn: state => {
          console.log(data);
          return Object.assign({}, state, {
            route: 'detail',
            detail: data
          });
        }
      }))
      .subscribe(this.state$);

    return {
    };
  },
  mounted() {
    // console.log(this.item);
    // this.showDetail$
    //   .map(() => ({
    //     type: this.showDetail$,
    //     fn: state => Object.assign({}, state, {route: 'detail'})
    //   }))
    //   .subscribe(this.state$);
    // this.state$.subscribe(a => console.log(a))
    // console.log(this.showDetail$);
  }
}
</script>

<style scoped>
  .box {
    padding: .5em 1em;
    /*box-sizing: border-box;
    border: solid #ccc;
    border-width: 0 1px;*/
  }
  .user:after {
    content: '/';
    margin: 0 .25em;
  }
</style>
