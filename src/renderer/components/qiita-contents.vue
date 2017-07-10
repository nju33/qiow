<template>
  <div ref="box" class="qiita-contents__box">
    <section class="qiita-contents__center">
      <h1
        class="qiita-contents__title"
        :class="{[$theme.title]: true}"
        v-text="title"
      />
      <div ref="contents" id="qC" v-html="transformedContents"/>
    </section>
    <div class="qiita-action">
      <button class="qiita-action__button" :class="$theme.qiitaActionButton">
        <Octicon name="package" scale="1.3"/>
      </button>
    </div>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/package';
import hljs from 'highlightjs';
import throttle from 'lodash/throttle';
import jump from 'jump.js';
import zenscroll from 'zenscroll';
import 'highlightjs/styles/atom-one-dark.css';

export default {
  name: 'qiita-contents',
  components: {
    Octicon
  },
  props: {
    title: {
      required: true,
      type: String
    },
    contents: {
      required: true,
      type: String
    },
    close$: {
      required: true
    }
  },
  data() {
    return {
      headlineStack: [],
      transformedContents: null,
      _disposables: []
    }
  },
  methods: {
    getPreviousHeadline(headline) {
      let prev = headline.previousElementSibling;
      if (prev === null) {
        return null;
      }

      while (!/H\d/.test(prev.tagName)) {
        prev = prev.previousElementSibling;
        if (prev === null) {
          return null;
        }
      }
      if (this.$refs.box.scrollTop <= prev.offsetTop) {
        prev = this.getPreviousHeadline(prev);
      }
      return prev;
    },
    getHeadlineLevel(headline) {
      return Number(headline.tagName.match(/\d$/)[0]);
    }
  },
  mounted() {
    const headlineIOSource$ = new Rx.Subject()
      .pairwise()
      .map(([prev, current]) => {
        const isScrollDown = prev.scrollTop < current.scrollTop;
        const isScrollUp = prev.scrollTop >= current.scrollTop;

        if (
          isScrollDown
          // current.visible
        ) {
          const {headline} = current;
          if (current.scrollTop <= headline.offsetTop - headline.clientHeight) {
            return;
          }

          if (this.$parent.headlineStack.length === 0) {
            this.$parent.$data._cacheHeadlineStack.set(headline, []);
            this.$parent.headlineStack.push(headline);
            return;
          }

          const level = this.getHeadlineLevel(headline);

          const {
            headline: lastHeadline,
            headlineLevel: lastHeadlineLevel
          } = ($p => {
            const lastIdx = $p.headlineStack.length - 1;
            const headline = $p.headlineStack[lastIdx]
            const headlineLevel = this.getHeadlineLevel(headline);
            return {headline, headlineLevel};
          })(this.$parent);


          if (lastHeadlineLevel >= level) {
            const nextStack = this.$parent.headlineStack.reduce((acc, stackedHeadline) => {
              if (this.getHeadlineLevel(stackedHeadline) < level) {
                acc.push(stackedHeadline);
              }
              return acc;
            }, [])
            this.$parent.$data._cacheHeadlineStack.set(
              headline,
              [...this.$parent.headlineStack]
            );
            nextStack.push(headline);
            this.$parent.headlineStack = nextStack;
          } else if (lastHeadlineLevel < level) {
            this.$parent.$data._cacheHeadlineStack.set(
              headline,
              [...this.$parent.headlineStack]
            );
            this.$parent.headlineStack.push(headline);
          }
        } else if (
          isScrollUp &&
          // current.scrollTop p current.headline.clientHeight
          // current.scrollTop < current.headline.offsetTop - current.headline.clientHeight
          // current.boxHeight + current.scrollTop > current.headline.offsetTop &&
          current.visible
        ) {
          const {headline: nextHeadline} = current;
          const headline = this.getPreviousHeadline(nextHeadline);
          if (headline === null) {
            this.$parent.headlineStack = [];
            return;
          }

          this.$parent.headlineStack = this.$parent.$data._cacheHeadlineStack.get(headline) || [];

          const level = this.getHeadlineLevel(headline);
          if (this.$parent.headlineStack.length === 0) {
            this.$parent.headlineStack.push(headline);
            return;
          }

          const {
            headline: lastHeadline,
            headlineLevel: lastHeadlineLevel
          } = ($p => {
            const lastIdx = $p.headlineStack.length - 1;
            const headline = $p.headlineStack[lastIdx]
            const headlineLevel = this.getHeadlineLevel(headline);
            return {headline, headlineLevel};
          })(this.$parent);

          if (lastHeadlineLevel >= level) {
            const nextStack = this.$parent.headlineStack.reduce((acc, stackedHeadline) => {
              if (this.getHeadlineLevel(stackedHeadline) < level) {
                acc.push(stackedHeadline);
              }
              return acc;
            }, [])
            nextStack.push(headline);
            this.$parent.headlineStack = nextStack;
          } else if (lastHeadlineLevel < level) {
            this.$parent.headlineStack.push(headline);
          }
        }
      })

    this.$data._disposables.push(headlineIOSource$.subscribe());

    const headlineIO = new IntersectionObserver(([entry], a) => {
      headlineIOSource$.next({
        boxHeight: this.$refs.box.clientHeight,
        scrollTop: this.$refs.box.scrollTop,
        headline: entry.target,
        visible: entry.intersectionRatio > 0.75
      });
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });


    this.$electron.ipcRenderer.send('transformCodeBlock:req', this.contents);
    this.$electron.ipcRenderer.on('transformCodeBlock:res', (ev, contents) => {
      let handleIO = null;
    // this.$electron.ipcRenderer.on('transformCodeBlock:res', function () {
      this.transformedContents = contents;
      setTimeout(() => {
        this.$refs.contents.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(elem => {
          headlineIO.observe(elem);
        });
      }, 0);
    });

    // zenscroll.setup(500);
    // const a = zenscroll.createScroller(this.$refs.box);
    // a.setup(500);
    // const b = a.moving()
    // let scrolling = null;
    const keybindSource$ = Rx.Observable.merge(
      Rx.Observable.fromEvent(document, 'keydown'),
      Rx.Observable.fromEvent(document, 'keyup')
    )
      // .throttleTime(200)
      .scan((acc, ev) => {
        if (ev.type === 'keyup') {
          return {
            type: ev.type,
            height: 0
          };
        }

        if (acc.height === 0) {
          acc.height = this.$refs.box.scrollTop;
        }

        switch (ev.key) {
          case 'Escape': {
            // console.log(this.close$);
            this.close$.next();
            break;
          }
          case 'ArrowDown':
          case 'j': {
            acc.height += 21;
            break;
          }
          case 'ArrowUp':
          case 'k': {
            acc.height -= 21;
            break;
          }
          case 'd': {
            acc.height += ~~this.$refs.box.clientHeight / 2
            break;
          }
          case 'u': {
            acc.height -= ~~this.$refs.box.clientHeight / 2
            break;
          }
          default: {
            break;
          }
        }

        if (acc.height < 0) {
          acc.height = 0;
        } else if (acc.height > this.$refs.box.scrollHeight) {
          acc.height = this.$refs.box.scrollHeight;
        }
        return {
          type: ev.type,
          height: acc.height
        };
      }, {
        type: null,
        height: 0
      })
      .map(({type, height}) => {
        if (type === 'keyup') {
          return;
        }
        this.$refs.box.scrollTop = height;
      });
    this.$data._disposables.push(keybindSource$.subscribe());


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
  scroll-behavior: smooth;
  overflow: auto;
  font-size: .95em;
  line-height: 1.75;
  display: flex;
  justify-content: center;
}
.qiita-contents__center {
  position: relative;
  width: 41em;
  margin: 1em 0 1.5em;
}
.qiita-contents__title {
  font-size: 1.6em;
  font-weight: normal;
  padding: 0 .75rem;
}
.qiita-action {
  position: fixed;
  bottom: 2em;
  margin-left: calc(20.5em + 4em);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.qiita-action__button {
  height: 4em;
  width: 4em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>

<style>
#qc {
  position: relative;
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
  font-size: 1.6em;
  border-bottom: 1px solid;
}
#qC h2 {
  font-size: 1.45em;
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
#qC table {
  padding: 0;
  border-collapse: collapse;
  font-size: .95em;
}
#qC table th,
#qC table td {
  padding: .25em .5em;
}
#qC table td {
  border: 1px solid;
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
