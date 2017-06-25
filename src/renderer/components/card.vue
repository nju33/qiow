<template>
  <div>
    <section class="card__box" :class="$theme.card">
      <div class="card__title">
        <a
          class="title"
          style="color:#005CAF"
          v-stream:click="{
            subject: showDetail$,
            data: item
          }"
        >{{item.title}}</a>
      </div>
      <div class="card__data">
        <div class="card__user">
          <a ref="tooltip" class="user__button">
            <img class="user__img" v-lazy="item.user.profileImageUrl"/>
            <span class="user__name">{{item.user.id}}</span>
          </a>
        </div>
        <div class="card__date">
          <span class="date__time">{{item.createdAt | timeago}}</span>
        </div>
      </div>
    </section>
    <UserTooltip
      :user="item.user"
    />
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import timeago from 'timeago.js';
import UserTooltip from './user-tooltip';

export default {
  name: 'card',
  components: {
    UserTooltip
  },
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
  filters: {
    timeago(date) {
      return timeago().format(date);
    }
  },
  mounted() {
    // console.log(this.item);
    console.log(this);
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
  .card__box {
    display: grid;
    grid-template-rows: 1fr 1.75em;
    grid-template-columns: 1fr;
    padding: .5em .75em;
    margin: .25em .5em;
  }
  .card__title {
    font-size: 1.2em;
    margin-bottom: .5em;
  }
  .card__data {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }
  .card__user,
  .user__button,
  .card__date {
    display: flex;
    align-items: center;
  }
  .date__time {
    width: 100%;
    text-align: right;
  }
  .user__button {
    cursor: pointer;
  }
  .user__img {
    height: 1.5em;
    width: 1.5em;
  }
  .user__name {
    margin-left: .5em;
  }
</style>
