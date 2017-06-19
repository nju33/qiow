<template>
  <div id="root" class="box">
    <UserBoard :name="user.id" :profileImageUrl="user.profileImageUrl"/>
    <template v-for="tagId in followingTagIds">
      <Street :tagId="tagId" :key="tagId"/>
      <Separator/>
    </template>
    <StreetPlus/>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import UserBoard from './user-board';
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
    UserBoard,
    Street,
    StreetPlus,
    Separator
  },
  subscriptions() {
    return {
      user: this.state$.pluck('user'),
      followingTagIds: this.state$
        .pluck('streets')
        .map(streets => streets.map(street => street.tagId))
    }
  },
  methods: {
  },
  mounted() {
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
