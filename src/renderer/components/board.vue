<template>
  <div id="root" class="box">

    <template v-if="mounted && token === undefined">
      <form class="user-form" v-stream:submit="setToken$">
        <div class="user-form-inner" style="position:relative;padding-top:8em">
          <img src="static/logo.svg" style="width: 120px;position:absolute;top:-6em;right:48%;transform:translateX(50%)"/>
          <label class="user-label"><div style="margin-left: 10px;margin-bottom: 5px;">AccessToken:</div><input class="user-input" :class="theme && theme.get('input')" style="width: 400px"/></label>
          <button class="user-submit" type="submit" :class="theme && theme.get('accentButton')">Done</button>
        </div>
      </form>
    </template>

    <div v-else-if="mounted" class="scroller" :style="{
      width: width + 'px'
    }">
      <!-- <StreetPlus :user="user"/> -->
      <StreetPlus/>

      <!-- <form v-if="!user" class="user-form" v-stream:submit="submit$">
        <div class="user-form-inner">
          <label class="user-label">User ID: <input class="user-input" :class="theme && theme.get('input')" /></label>
          <button class="user-submit" type="submit" :class="theme && theme.get('accentButton')">Done</button>
        </div>
      </form> -->

      <div
        v-if="streets && streets.length === 0"
        class="placeholder"
      >
        <div class="placeholder__inner">
          <div class="placeholder__content--first">
            <div :class="theme && theme.get('placeholderText')"> 右にある </div>
            <Octicon name="tag" scale="1.3" :class="theme && theme.get('placeholderIcon')"/>
      	    <div :class="theme && theme.get('placeholderText')">や</div>
      	    <Octicon name="search" scale="1.3" :class="theme && theme.get('placeholderIcon')"/>
          </div>
          <div :class="theme && theme.get('placeholderText')">から興味のあるタグやテキストを追加できます。</div>
        </div>
      </div>

      <template
        v-else-if="streets && streets.length > 0"
        v-for="(street, idx) in streets"
      >
        <Separator :street="streets[idx]"/>
        <Street :street="street"/>
      </template>

      <!-- <UserBoard :name="user.id" :profileImageUrl="user.profileImageUrl"/> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import Rx from 'rxjs/Rx';
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/tag';
import 'vue-octicon/icons/search';
import {Map, List} from 'immutable';
import UserBoard from './user-board';
import Street from './street';
import StreetPlus from './street-plus';
import Separator from './separator';
import camelcaseKeys from 'camelcase-keys';
// import {getTagItemsUrl} from '@/helpers';

export default {
  // props: {
  //   token: String,
  // },
  name: 'board',
  components: {
    Octicon,
    UserBoard,
    Street,
    StreetPlus,
    Separator
  },
  data() {
    return {
      mounted: false,
    };
  },
  // domStreams: ['submit$'],
  domStreams: ['setToken$'],
  subscriptions() {
    // this.submit$
    //   .do(({event}) => {event.preventDefault()})
    //   .switchMap(({event}) => {
    //     const input = event.target[0];
    //     if (input.value === '') {
    //       return Rx.Observable.never();
    //     }
    //     return Rx.Observable.of(input.value);
    //   })
    //   .switchMap(userId => {
    //     return Rx.Observable
    //      .fromPromise(this.$http(`https://qiita.com/api/v2/users/${userId}`))
    //   })
    //   .pluck('data')
    //   .subscribe(
    //     user => {
    //       this.state$.next({
    //         type: 'SET_USER_ID',
    //         fn: state => state.setUser(Map(camelcaseKeys(user))),
    //       });
    //     }
    //   );

    this.setToken$
      .do(({event}) => {event.preventDefault()})
      .switchMap(({event}) => {
        const input = event.target[0];
        if (input.value === '') {
          return Rx.Observable.never();
        }
        return Rx.Observable.of(input.value);
      })
      .subscribe(
        token => {
          this.state$.next({
            type: 'TOKEN',
            fn: state => state.setToken(token),
          });

          Vue.http = Vue.prototype.$http = axios.create({
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      );

    this.state$.next({
      fn: state => {
        return state.forceUpdate();
      }
    });

    return {
      // user: this.state$.pluck('user'),
      token: this.state$.pluck('token'),
      streets: this.state$
        .pluck('streets')
        .map(streets => streets.toArray()),
      width: this.state$
        .pluck('streets')
        .map(streets => streets.reduce((acc, street) => {
          acc += street.width;
          return acc;
        }, 0)),
      theme: this.state$.pluck('theme') ,
    }
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true;
    }, 500);
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

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: calc(100vw - 69px);
  min-width: calc(100vw - 69px);
}

.placeholder__inner {
  text-align: center;
  font-size: 1.5em;
}

.placeholder__content--first {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: .5em 0;
}

.octicon {
  padding: .5em;
  margin: 0 .5em;
  border-radius: 50%;
}
</style>
