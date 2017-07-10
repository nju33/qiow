<template>
  <div class="modal-menu__box">
    <div class="modal-menu__group">
      <ul class="breadclumb__list">
        <template  v-for="(item, idx) in breadclumb">
        <li
          class="breadclumb__item"
          :class="idx === 0 && $theme.breadclumbItemFirst"
        >{{item}}</li>
        <span class="breadclumb__separator" v-if="idx < breadclumb.length - 1">
          <Octicon name="chevron-right"/>
        </span>
        </template>
      </ul>
    </div>
    <div class="modal-menu__group--right">
      <button v-stream:click="close$">
        <Octicon name="x"/>
      </button>
    </div>
  </div>
</template>

<script>
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/x';
import 'vue-octicon/icons/chevron-right';
export default {
  name: 'modal-menu',
  components: {Octicon},
  props: {
    breadclumb: {
      type: Array,
      required: true
    },
    close$: {
      required: true
    }
  },
  // domStreams: ['close$'],
  subscriptions() {},
  mounted() {
    console.log(this);
    // debugger;
  }
}
</script>

<style>
.modal-menu__box {
  flex: 0 0 2em;
  display: flex;
  justify-content: space-between;
  padding-bottom: .5em;
  /*background: #333;*/
}

.modal-menu__box button {
  background: transparent;
  border: none;
  cursor: pointer;
}

.modal-menu__box button svg {
  /*fill: #fff;*/
}

.modal-menu__group,
.modal-menu__group--right {
  display: flex;
}

.modal-menu__group--right {
  flex-direction: row-reverse;
}

.breadclumb__list {
  display: flex;
  align-items: center;
  padding: .25em .5em;
  max-width: calc(100vw - 5em);
}

.breadclumb__item {
  /*flex: 1 0 auto;*/
  /*max-width: 30em;*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
}

.breadclumb__separator {
  display: flex;
  align-items: center;
  margin: 0 .5em;
}
</style>
