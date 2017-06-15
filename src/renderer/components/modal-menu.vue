<template>
  <div class="box">
    <div class="group"></div>
    <div class="group--right">
      <button v-stream:click="close$">xxx</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-menu',
  props: {
    close$: {
      required: true
    }
  },
  // domStreams: ['close$'],
  subscriptions() {},
  mounted() {
    console.log(this);
    // debugger;
  }
}
</script>

<style>
.box {
  display: flex;
  justify-content: space-between;
}

.group,
.group--right {
  display: flex;
}

.group--right {
  flex-direction: row-reverse;
}
</style>
