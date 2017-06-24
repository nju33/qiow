<template>
  <section
    v-if="type === 'button'"
    class="street-plus__box"
    :class="$theme.streetPlusBox"
    v-stream:click="{
      subject: addStreet$,
      data: {type: 'form'}
    }"
  >
    <span class="icon">
      <Octicon name="plus" scale="5" :class="$theme.streetPlusIcon"/>
    </span>
  </section>
  <section
    v-else-if="type === 'form'"
    class="street-plus__box"
  >
    <form
      class="street-plus__form"
      v-stream:submit="submit$"
    >
      <div class="street-plus__form-group">
        <label class="street-plus__form-label" for="tagId">タグID</label>
        <input
          class="street-plus__form-input"
          id="tagId"
          v-model.trim="tagId"
        />
      </div>
      <div class="street-plus__form-group">
        <button
          class="street-plus__form-button"
          type="submit">追加</button>
      </div>
    </form>
  </section>
</template>

<script>
import Rx from 'rxjs/Rx';
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/plus';
import Card from './card';
import {moveTo} from '@/helpers';

export default {
  components: {
    Card,
    Octicon
  },
  props: {
    // tagId: {
    //   type: String,
    //   required: true
    // },
    // key: {
    //   type: String,
    //   required: true
    // }
  },
  data() {
    return {
      tagId: ''
    };
  },
  computed: {
    formData() {
      return {
        tagId: this.tagId,
        hoge: 'asdf'
      };
    }
  },
  domStreams: ['submit$'],
  subscriptions() {
    this.addStreet$ = new Rx.BehaviorSubject({data: {type: 'button'}});

    this.submit$
      .do(({event}) => event.preventDefault())
      .flatMap(() => {
        return Rx.Observable
          .from(Object.values(this.formData))
          .every(val => val !== '');
      })
      .switchMap(bool => {
        if (bool) {
          return Rx.Observable.of(this.formData);
        }
        return Rx.Observable.never();
      })
      .subscribe(() => {
        const {tagId} = this;
        this.state$.next({
          fn(state) {
            const nextState = Object.assign({}, state);
            nextState.streets.push({
              tagId,
              items: []
            });
            return nextState;
          }
        });
        setTimeout(() => {
          this.addStreet$.next({data: {type: 'button'}});
        }, 0);
      });

    return {
      type: this.addStreet$
        .pluck('data')
        .pluck('type')
    };
  },
  mounted() {
    // this.$observables.items.subscribe(
    //   items => console.log(items)
    // );
  }
}
</script>

<style scoped>
  .street-plus__box {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 21em;
    max-width: 21em;
    cursor: pointer;
  }
  .street-plus__box:hover .icon svg {
    opacity: .5;
  }
  .icon svg {
    transition: .2s;
  }
  .street-plus__form,
  .street-plus__form-group {
    display: flex;
    flex-direction: column;
    margin: 1em 0;
  }
  /*.street-plus__form-input,
  .street-plus__form-label {
    margin: 1em 0;
  }*/
  .street-plus__form-input {
    padding: .5em .75em;
  }
  .street-plus__form-button {
    padding: .5em .75em;
  }
</style>
