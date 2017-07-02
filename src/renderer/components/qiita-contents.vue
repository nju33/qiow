<template>
  <div class="qiita-contents__box">
      <section class="qiita-contents__center">
      <h1
        class="qiita-contents__title"
        :class="{[$theme.title]: true}"
        v-text="title"
      />
      <div ref="contents" id="qC" v-html="transformedContents"/>
    </section>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import hljs from 'highlightjs';
import 'highlightjs/styles/atom-one-dark.css';

export default {
  name: 'qiita-contents',
  props: {
    title: {
      required: true,
      type: String
    },
    contents: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      _disposables: [],
      transformedContents: null
    }
  },
  // beforeCreate() {
  // },
  mounted() {
    this.$electron.ipcRenderer.send('transformCodeBlock:req', this.contents);
    this.$electron.ipcRenderer.on('transformCodeBlock:res', (ev, contents) => {
    // this.$electron.ipcRenderer.on('transformCodeBlock:res', function () {
      // console.log(arguments);
      this.transformedContents = contents;
    });
    // (() => {
    //   const codeBlocks = this.$refs.contents.querySelectorAll('.code-frame');
    //   if (codeBlocks.length === 0) {
    //     return;
    //   }
    //
    //   Array.from(codeBlocks).forEach(block => {
    //     const {lang} = block.dataset;
    //     const pre = block.querySelector('pre');
    //     if (pre === null) {
    //       return;
    //     }
    //     try {
    //       hljs.highlight(lang, pre.innerText).value;
    //     } catch (_) {}
    //   });
    // })();

    const addEventListenerForA = (() => {
      const openLink$ = new Rx.Subject()
      const source$ = openLink$
        .map(data => ({
          type: openLink$,
          fn(state) {
            return Object.assign({}, state, {
              webview: data
            });
          }
        }));

      return a => {
        a.addEventListener('click', handleOpenLink);
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
    const anchors = this.$refs.contents.querySelectorAll('a[href]');
    anchors.forEach(a => {
      const dispose = addEventListenerForA(a);
      this.$data._disposables.push(dispose);
    });
  },
  beforeDestroy() {
    this.$data._disposables.forEach(dispose => dispose())
  }
}
</script>

<style scoped>
.qiita-contents__box {
  overflow: auto;
  font-size: 1.1em;
}
.qiita-contents__center {
  width: 37em;
  margin: 0 auto;
}
.qiita-contents__title {
  font-size: 2.1em;
  font-weight: normal;
  padding: 0 .75rem;
}
</style>

<style>
#qc {
  line-height: 1.7;
}
#qC > *:not(img) {
  padding: 0 .75rem;
  margin: .75em 0;
}
#qC p,
#qC pre {
  margin: 0;
}
#qC h1 {
  font-size: 1.95em;
  border-bottom: 1px solid;
}
#qC h2 {
  font-size: 1.75em;
}
#qC h3 {
  font-size: 1.3em;
  font-weight: normal;
}
#qC h4 {
  font-size: 1.15em;
}
#qC h5 {
  font-size: 1.05em;
}
#qC h6 {
  font-size: .9em;
}
#qC .code-frame {
  position: relative;
  box-sizing: border-box;
  /*background: #333;*/
  /*color: #f8f8f8;*/
  padding-top: .5rem;
  padding-bottom: .5rem;
  /*margin-left: -3em;*/
  /*width: 40em;*/
}
#qC .code-lang {
  position: absolute;
  left: 0;
  top: 0;
  padding: .13em .3em;
  background: rgba(0,0,0,.2);
  opacity: .8;
  font-size: .8em;
}
#qC .code-lang + .highlight {
  padding-top: 1rem;
}
#qC .highlight {
  overflow: auto;
  font-size: .9em;
  line-height: 1. 4;
}
#qC img {
  max-width: 100%;
}
#qC a {
  word-wrap: break-word;
}
</style>
