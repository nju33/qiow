<template lang="html">
  <div class="box">
    <template v-for="item in items">
      <div class="item">
        <div class="user">
          <img :src="item.user.profile_image_url" class="user-icon"/>
          <span class="user-name">{{item.user.id}}</span>
        </div>
        <div v-html="item.rendered_body" id="qCo" class="content"></div>
      </div>
    </template>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';

export default {
  name: 'modal',
  props: {
    items: {
      required: true,
      type: Array,
    }
  },
}
</script>

<style scoped>
.box {
  margin: 3em 0 1em;
  background: #f8f8f8;
  /*border-left: 1px solid;*/
  box-sizing: border-box;
  padding: 1em 0;
}

.item {
  /*background: #fff;*/
  /*border-left: 1px solid;*/
  /*margin: .5em;*/
}

.user {
  box-sizing: border-box;
  padding: 1em 1em 0;
  display: flex;
  align-items: center;
  user-select: none;
}

.user-icon {
  width: 2.5em;
  margin-right: .5em;
}

.user-name {
  font-size: 1em;
}

.content {
  box-sizing: border-box;
  padding: 0 1em 1em 1em;
}
</style>

<style>
#qCo pre {
  overflow: auto;
  padding: .5em;
}
</style>
