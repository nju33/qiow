<template lang="html">
  <div class="box" v-if="isDetail">
    <ModalMenu :close$="close$"/>
    <div v-html="contents"></div>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import QiitaContents from './qiita-contents';
import ModalMenu from './modal-menu';

export default {
  name: 'modal',
  components: {
    ModalMenu
  },
  data() {
    return {
      isDetail: false,
      contetns: null
    }
  },
  subscriptions() {
    this.state$.subscribe(({route, detail}) => {
      this.isDetail = route === 'detail'
      this.contents = detail.rendered_body;
    });

    this.close$ = new Rx.Subject()
      .map(() => ({
        type: this.close$,
        fn(state) {
          return Object.assign({}, state, {route: 'list'})
        }
      }));
    this.close$.subscribe(this.state$);
  }
}
</script>

<style scoped>
  .box {
    position: fixed;
    left: 0;
    top: 5vh;
    height: 95vh;
    width: 100vw;
    background: #fff;
  }
</style>
