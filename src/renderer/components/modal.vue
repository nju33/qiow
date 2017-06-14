<template lang="html">
  <div class="box" v-if="isDetail">hoge</div>
</template>

<script>
export default {
  name: 'modal',
  data() {
    return {
      isDetail: false
    }
  },
  subscriptions() {
    this.state$.subscribe(({route}) => {
      this.isDetail = route === 'detail'
    });
  }
}
</script>

<style scoped>
  .box {
    position: fixed;
    right: 50%;
    bottom: 50%;
    transform: translate(50%,50%);
    height: 90vh;
    width: 90vw;
    background: #ccc;
  }
</style>
