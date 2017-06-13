<template>
  <div class="box">
    <ul class="list">
      <li class="item">
        <Card></Card>
      </li>
    </ul>
  </div>
</template>

<script>

import Card from './card';

export default {
  components: {
    Card
  }
}
</script>

<style scoped>
  .box {
    height: 100vh;
    box-sizing: border-box;
    border: solid #ccc;
    border-width: 0 1px;
  }

  .list {
    display: block;
  }
</style>
