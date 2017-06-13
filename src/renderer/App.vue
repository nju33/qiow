<template>
  <div id="app">
    <router-view :themes="themes"></router-view>
  </div>
</template>

<script>
import themes from '@/themes';

export default {
  name: 'qiow',
  date() {
    return {themes};
  }
}
</script>

<style>
  /* CSS */
</style>
