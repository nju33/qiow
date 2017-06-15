<template>
  <div
    class="separator"
    @mousedown="handleMousedown"
  />
</template>

<script>
import bindAll from 'lodash-decorators/bindAll';

export default {
  data() {
    return {
      _dragging: false
    }
  },
  @bindAll()
  methods: {
    handleMousedown() {
      this.$data._dragging = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    handleMouseup() {
      this.$data._dragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = ''
    },
    handleMousemove(ev) {
      if (!this.$data._dragging) {
        return;
      }
      const movement = ev.movementX;
      const prevElem = this.$el.previousElementSibling;
      const prevElemWidth = prevElem.clientWidth;
      if (movement < 0) {
        prevElem.style.minWidth = prevElemWidth + movement + 'px';
        prevElem.style.maxWidth = prevElemWidth + movement + 'px';
      } else {
        prevElem.style.minWidth = prevElemWidth + movement + 'px';
        prevElem.style.maxWidth = prevElemWidth + movement + 'px';
      }
    },
  },
  mounted() {
    document.body.addEventListener('mousemove', this.handleMousemove);
    document.body.addEventListener('mouseup', this.handleMouseup);
  },
  beforeDestroy() {
    document.body.removeEventListener('mousemove', this.handleMousemove);
    document.body.removeEventListener('mouseup', this.handleMouseup);
  }
}
</script>

<style scoped>
.separator {
  flex: 0 0 1px;
  min-width: 1px;
  max-width: 1px;
  border-left: 1px solid #222;
  cursor: col-resize;
}
</style>
