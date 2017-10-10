<template>
  <div id="root" class="box">
    <div class="scroller" :style="{
      width: width + 'px'
    }">
      <StreetPlus :user="user"/>

      <form v-if="!user" class="user-form" v-stream:submit="submit$">
        <div class="user-form-inner">
          <label class="user-label">User ID: <input class="user-input" :class="$theme.input" /></label>
          <button class="user-submit" type="submit" :class="$theme.accentButton">Done</button>
        </div>
      </form>

      <!-- <template v-for="tagId in followingTagIds"> -->
      <template v-else v-for="(street, idx) in streets">
        <Separator :street="streets[idx]"/>
        <Street :street="street"/>
      </template>

      <!-- <UserBoard :name="user.id" :profileImageUrl="user.profileImageUrl"/> -->
    </div>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import {Map, List} from 'immutable';
import UserBoard from './user-board';
import Street from './street';
import StreetPlus from './street-plus';
import Separator from './separator';
import camelcaseKeys from 'camelcase-keys';
// import {getTagItemsUrl} from '@/helpers';

export default {
  props: {
    themes: Object
  },
  name: 'board',
  components: {
    UserBoard,
    Street,
    StreetPlus,
    Separator
  },
  domStreams: ['submit$'],
  subscriptions() {
    this.submit$
      .do(({event}) => {event.preventDefault()})
      .switchMap(({event}) => {
        const input = event.target[0];
        if (input.value === '') {
          return Rx.Observable.never();
        }
        return Rx.Observable.of(input.value);
      })
      .switchMap(userId => {
        return Rx.Observable
         .fromPromise(this.$http(`https://qiita.com/api/v2/users/${userId}`))
      })
      .pluck('data')
      .subscribe(
        user => {
          this.state$.next({
            type: 'SET_USER_ID',
            fn: state => state.setUser(Map(camelcaseKeys(user))),
          });
        }
      );

    return {
      user: this.state$.pluck('user'),
      streets: this.state$
        .pluck('streets')
        .map(streets => streets.toArray()),
      width: this.state$
        .pluck('streets')
        .map(streets => streets.reduce((acc, street) => {
          acc += street.width;
          return acc;
        }, 0))
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style scoped>
.box {
  width: 100vw;
  overflow-x: auto;
}

.scroller {
  display: flex;
  justify-content: flex-end;
  flex-direction: row-reverse;
  padding-left: 69px;
  box-sizing: border-box;
  width: 100vw;
}

.scroller > * {
  flex: auto;
  max-width: 32em;
  min-width: 32em;
}

.user-form {
  max-width: calc(100vw - 69px);
  min-width: calc(100vw - 69px);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-form-inner {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.user-label {
  font-size: 1.3em;
}

.user-input {
  margin-left: .5em;
  padding: .75em .5em;
  font-size: 1em;
}

.user-submit {
  padding: .75em .5em;
  width: 5em;
  margin-top: .75em;
  margin-left: auto;
  font-size: 1em;
  cursor: pointer;
}
</style>
