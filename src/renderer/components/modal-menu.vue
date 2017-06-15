<template>
  <div class="modal-menu__box">
    <div class="modal-menu__group"></div>
    <div class="modal-menu__group--right">
      <button v-stream:click="close$">
        <Octicon name="x"/>
      </button>
    </div>
  </div>
</template>

<script>
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/x'
export default {
  name: 'modal-menu',
  components: {Octicon},
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
.modal-menu__box {
  flex: 0 0 2em;
  display: flex;
  justify-content: space-between;
  /*background: #333;*/
}

.modal-menu__box button {
  background: transparent;
  border: none;
  cursor: pointer;
}

.modal-menu__box button svg {
  /*fill: #fff;*/
}

.modal-menu__group,
.modal-menu__group--right {
  display: flex;
}

.modal-menu__group--right {
  flex-direction: row-reverse;
}
</style>
