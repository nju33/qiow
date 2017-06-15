<template lang="html">
  <div v-if="isDetail" class="modal__outer-box" v-stream:click="close$">
    <div class="modal__box">
      <ModalMenu :close$="close$"/>
      <QiitaContents :title="title" :contents="contents"/>
    </div>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import QiitaContents from './qiita-contents';
import ModalMenu from './modal-menu';

export default {
  name: 'modal',
  components: {
    ModalMenu,
    QiitaContents
  },
  data() {
    return {
      isDetail: false,
      title: null,
      contetns: null
    }
  },
  subscriptions() {
    this.state$.subscribe(({route, detail}) => {
      this.isDetail = route === 'detail'
      this.title = detail.title;
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
.modal__outer-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.6);
}
.modal__box {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 5vh;
  height: 95vh;
  width: 100vw;
  background: #fff;
}
</style>
