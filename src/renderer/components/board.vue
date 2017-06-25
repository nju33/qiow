<template>
  <div id="root" class="box">
    <StreetPlus/>
    <Separator/>
    <!-- <UserBoard :name="user.id" :profileImageUrl="user.profileImageUrl"/> -->
    <template v-for="tagId in followingTagIds">
      <Street :tagId="tagId" :key="tagId"/>
      <Separator/>
    </template>
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
        .map(idList => idList.toArray())
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
    display: flex;
    overflow-x: auto;
  }

  .box > * {
    flex: auto;
    max-width: 32em;
    min-width: 32em;
  }
</style>
