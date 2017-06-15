<template>
  <webview class="webview" :src="src"/>
</template>

<script>
export default {
  name: 'webview',
  props: {
    src: {
      required: true,
      type: String
    }
  }
}
</script>

<style scoped>
.webview {
  width: 100%;
  height: 100%;
}
</style>
