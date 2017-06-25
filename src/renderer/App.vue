<template>
  <div id="app">
    <router-view></router-view>
    <Modal/>
  </div>
</template>

<script>
import Modal from '@/components/modal';
import 'tippy.js/dist/tippy.css';

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
body {
  font: 12.5px / 1.5 "Noto Sans Japanese", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", sans-serif;
  margin: 0;
  max-height: 100vh;
  overflow: hidden;
}
h3 {
  margin: 0;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
a {
  color: inherit;
  text-decoration: none;
}
input,
textarea,
button {
  box-sizing: border-box;
  font-size: inherit;
  outline: none;
}
</style>
