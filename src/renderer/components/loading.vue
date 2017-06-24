<template>
  <div class="loading">
    <transition name="loading__inner">
      <div class="loading__inner" v-if="loading">
        <svg class="loading__icon" :class="$theme.loadingIcon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
          <rect x="0" y="0" width="4" height="20">
            <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
          </rect>
          <rect x="7" y="0" width="4" height="20">
            <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animate>
          </rect>
          <rect x="14" y="0" width="4" height="20">
            <animate attributeName="opacity" attributeType="XML" values="1; .2; 1" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animate>
          </rect>
        </svg>
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
  max-height: 5em;
  min-height: 5em;
}

.loading__inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 5em;
  transition: opacity .5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  opacity: 1;
}

.loading__inner-enter {
  opacity: 0;
}

.loading__inner-leave-to {
  opacity: 0;
}

.loading__icon {
  transform: scale(1);
  transform-origin: center top;
}
</style>
