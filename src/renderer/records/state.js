import R from 'ramda';
import {Record, Map, List} from 'immutable';
import Street from './street';

export default class State extends Record({
  _id: 0,
  type: null,
  route: 'list',
  streets: List(),
  control: Map(),
  detail: null,
  config: null,
  user: null,
  ctx: null
}) {
  export() {
    const pick = R.pick([
      'type',
      'context',
      'width',
      'title'
    ]);
    console.log('exp');
    console.log(R.map(pick, this.streets.toArray()));
    return {
      streets: R.map(pick, this.streets.toArray())
    }
  }

  forceUpdate() {
    return this.set('_id', this._id + 1);
  }

  goList() {
    return this.set('route', 'list');
  }

  goDetail() {
    return this.set('route', 'detail');
  }

  addStreet(data) {
    const street = new Street(data);
    return this.streets.unshift(street);
  }

  findStreet(street) {
    switch (street.type) {
      case Street.types.TAG: {
        const {tagId} = street.context;
        return this.streets.findKey(Street.findByTagId(tagId));
      }
      case Street.types.SEARCH: {
        const {searchText} = street.context;
        return this.streets.findKey(Street.findBySearchText(searchText));
      }
      default: {
        debugger;
        throw new Error('おかしい');
      }
    }
  }

  setList() {

  }

  setDetail(data) {
    return this
      .goDetail()
      .set('detail', data);
  }

  addStreet(street) {
    if (!(street instanceof Street)) {
      throw new Error(`Not a value of Street: ${street}`);
    }
    /**
     * vue-rxの問題なのかsource$がアップデートされないためpush
     */
    return this.set('streets', this.streets.push(street));
  }

  addStreetItems(tagId, items) {
    const target = this.streets.find(street => {
      return street.tagId === tagId;
    });

    if (typeof target === 'undefined') {
      return this;
    }

    target.set('items', target.addItems(items));
    return this;
  }

  removeStreet(idx) {
    if (typeof idx !== 'number') {
      throw new Error(`idx isn't a number: ${idx}`);
    }
    this.set('streets', this.streets.delete(idx));
    return this;
  }
}
