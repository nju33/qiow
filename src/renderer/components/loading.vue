<template>
  <div class="loading">
    <transition name="loading__inner">
      <div class="loading__inner" v-if="loading">
        alkjfasdjf
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    loading: {
      required: true,
      type: Boolean
    }
  }
}
</script>

<style scoped>
.loading {
  max-height: 8em;
  min-height: 8em;
}

.loading__inner {
  width: 100%;
  height: 8em;
  background: green;
  transition: height 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  opacity: 0;
}

.loading__inner-enter {
  height: 0;
  opacity: 1;
}

.loading__inner-leave-to {
  height: 0;
  opacity: 1;
}
</style>
