<template>
  <div>
    <div class="tooltip__box" ref="tooltip">
      <div
        class="tooltip__row tooltip__row--img"
        :style="{
          backgroundImage: `url(${user.profileImageUrl})`
        }"
      ></div>
      <div class="tooltip__row tooltip__row--name">
        <div class="tooltip__name">
          <span>{{user.id}}</span>
        </div>
      </div>
      <div class="tooltip__row">
        <div class="tooltip__description">
          <span v-if="user.description">{{user.description}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tippy from 'tippy.js';

export default {
  name: 'user-tooltip',
  props: {
    user: {
      required: true,
      type: Object
    }
  },
  mounted() {
    // console.log(this);
    tippy(this.$parent.$refs.tooltip, {
      html: this.$refs.tooltip,
      arrow: true,
      animation: 'fade'
    });
  }

}
</script>

<style scoped>
.tooltip__box {
  display: grid;
  grid-template-rows: 8em 2.5em 1fr;
  width: 13em;
  background: #fff;
}

.tooltip__row--img {
  background-size: cover;
  background-position: center center;
}

.tooltip__row--name {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tooltip__name {
}

.tooltip__description {
  word-wrap: break-word;
  word-break: break-all;
  font-size: .9em;
  padding: .5em 1em;
  text-align: justify;
}

.tooltip__description:empty {
  display: none;
}
</style>
