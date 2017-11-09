<template>
  <div>
    <section class="card__box" :class="theme && theme.get('card')">
      <div class="card__title">
        <a
          class="title"
          v-stream:click="{
            subject: showDetail$,
            data: item
          }"
        >{{item.title}}</a>
      </div>
      <div class="card__data">
        <ul class="card__tags">
          <li class="card__tag" :class="theme && theme.get('cardTag')" v-for="tag in item.tags" v-stream:click="{
            subject: addStreet$,
            data: tag
          }">
            {{tag.name}}
          </li>
        </ul>
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
import Street from '../records/street';
import timeago from 'timeago.js';
import UserTooltip from './user-tooltip';

export default {
  name: 'card',
  components: {
    UserTooltip
  },
  props: {
    theme: Object,
    item: {
      type: Object,
      required: true
    }
  },
  domStreams: ['showDetail$', 'addStreet$'],
  subscriptions() {
    this.showDetail$
      .pluck('data')
      .do(data => console.log('Detail:', data))
      .switchMap(data => {
        return Rx.Observable
         .fromPromise(this.$http(`https://qiita.com/api/v2/items/${data.id}/comments`))
         .pluck('data')
         .do(data => console.log('get comments', data))
         .map(comments => {
           data.comments = comments;
           return data;
         });
      })
      .map(data => ({
        type: this.showDetail$,
        fn: state => state.setDetail(data)
      }))
      .subscribe(this.state$);

    this.addStreet$
      .pluck('data')
      .map(tag => {
        const street = new Street({
          type: 'TAG',
          context: {
            tagId: tag.name
          }
        });
        return {
          fn: state => {
            return state.addStreet(street);
          }
        };
      })
      .subscribe(this.state$);

    return {};
  },
  filters: {
    timeago(date) {
      return timeago().format(date);
    }
  },
}
</script>

<style scoped>
  .card__box {
    display: grid;
    grid-template-rows: 1fr 4.25em;
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
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
  }
  .card__tags {
    grid-row: 1;
    grid-column-start: 1;
    grid-column-end: 3;
    display: flex;
    font-size: .85em;
    overflow: auto;
  }
  .card__tag {
    margin: .3em;
    padding: .15em .5em;
    line-height: 15px;
    border-radius: 10px;
    cursor: pointer;
  }
  .card__tag:first-child {
    margin-left: 0;
  }
  .card__user {
    grid-row: 2;
    grid-column: 1;
    padding-left: 3px;
  }
  .card__date {
    grid-row: 2;
    grid-column: 2;
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
