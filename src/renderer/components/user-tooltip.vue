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
  data() {
    return {
      tip: null
    }
  },
  mounted() {
    this.tip = tippy(this.$parent.$refs.tooltip, {
      html: this.$refs.tooltip,
      arrow: true,
      animation: 'fade',
      theme: 'light',
      size: 'small',
      interactive: true
    });
    // スタイル調整用
    // this.tip.show(this.tip.getPopperElement(this.$parent.$refs.tooltip));
  },
  beforeDestroy() {
    this.tip.destroyAll();
  }
}
</script>

<style scoped>
.tooltip__box {
  display: grid;
  grid-template-rows: 8em 2.1em 1fr;
  width: 12em;
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
  font-size: .85em;
  padding: .25em .75em;
  text-align: justify;
}

.tooltip__description:empty {
  display: none;
}
</style>
