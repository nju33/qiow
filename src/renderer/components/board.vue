<template>
  <div class="box">
    <Street></Street>
    <Street></Street>
    <Street></Street>
    <Street></Street>
  </div>
</template>

<script>
  import Street from './street';

  export default {
    name: 'board',
    components: {
      Street
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
  body {
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>

<style scoped>
  .box {
    display: flex;
  }

  .box > * {
    flex: auto;
    min-width: 14em;
  }
</style>
