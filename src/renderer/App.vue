<template>
  <div id="app">
    <router-view :themes="themes"></router-view>
    <Modal/>
  </div>
</template>

<script>
import themes from '@/themes';
import Modal from '@/components/modal';

export default {
  name: 'qiow',
  components: {Modal},
  date() {
    return {themes};
  },
  mounted() {
    console.log(this);
  }
}
</script>

<style>
  /* CSS */
</style>
