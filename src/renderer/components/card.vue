<template>
  <div>
    <section class="box">
      <div>
        <span class="user">{{item.user.id}}</span>
        <em class="title" style="color:#005CAF">{{item.title}}</em>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log(this.item);
  }
}
</script>

<style scoped>
  .box {
    padding: .5em 1em;
    /*box-sizing: border-box;
    border: solid #ccc;
    border-width: 0 1px;*/
  }
  .user:after {
    content: '/';
    margin: 0 .25em;
  }
</style>
