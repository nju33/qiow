<template>
  <div ref="contents" class="box" v-html="contents"></div>
</template>

<script>
import Rx from 'rxjs/Rx';

export default {
  name: 'qiita-contents',
  props: {
    contents: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      _disposables: []
    }
  },
  mounted() {
    const addEventListenerForA = (() => {
      const openLink$ = new Rx.Subject()
      const source$ = oopenLink$
        .map(data => ({
          type: openLink$,
          fn(state) {
            return Object.assign({}, state, {
              webview: data
            });
          }
        }));

      return a => {
        a.addEventListener('click', hndleOpenLink);
        return () => {
          a.removeEventListener('click', handleOpenLink);
        }
      }

      function handleOpenLink(ev) {
        const link = ev.target.getAttribute('href');
        source$.next({
          src: link
        });
      }
    })();
    const anchors = this.$refs.querySelectorAll('a[href]');
    anchors.forEach(a => {
      const dispose = addEventListenerForA(a);
      this._disposables.push(dispose);
    });
  },
  beforeDestroy() {
    this._disaposables.forEach(dispose => dispose())
  }
}
</script>

<style scoped>
</style>
