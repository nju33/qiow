<template>
  <div id="root" class="box">
    <div class="scroller" :style="{
      width: width + 'px'
    }">
      <StreetPlus :user="user"/>
      <!-- <template v-for="tagId in followingTagIds"> -->
      <template v-for="(street, idx) in streets">
        <Separator :street="streets[idx]"/>
        <Street :street="street"/>
      </template>

      <!-- <UserBoard :name="user.id" :profileImageUrl="user.profileImageUrl"/> -->
    </div>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import {List} from 'immutable';
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
</style>
