<template lang="html">
  <transition name="modal">
    <div v-if="isDetail" class="modal__outer-box" v-stream:click="close$">
      <div class="modal__box">
        <ModalMenu :close$="close$"/>
        <QiitaContents :title="title" :contents="contents"/>
      </div>
    </div>
  </transition>
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
      title: '',
      contetns: ''
    }
  },
  subscriptions() {
    this.state$.subscribe(({route, detail}) => {
      this.isDetail = route === 'detail'
      if (detail === null) {
        return;
      }
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
  opacity: 1;
  transition: .3s cubic-bezier(0.23, 1, 0.32, 1);
}
.modal-enter {
  opacity: 0;
}
.modal-leave-to {
  transition: .25s cubic-bezier(0.55, 0.055, 0.675, 0.19) .15s;
  opacity: 0;
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
  transition:
    top .4s cubic-bezier(0.25, 0.46, 0.45, 0.94) .1s,
    opacity .2s cubic-bezier(0.25, 0.46, 0.45, 0.94) .2s;
}
.modal-enter .modal__box {
  top: 100vh;
  opacity: 0;
}
.modal-leave-to .modal__box {
  transition:
    top .2s cubic-bezier(0.55, 0.085, 0.68, 0.53),
    opacity .15s cubic-bezier(0.55, 0.085, 0.68, 0.53) .5s;
  top: 100vh;
  opacity: 0;
}
</style>
