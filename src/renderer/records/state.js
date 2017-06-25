import {Record, List} from 'immutable';
import Street from './street';

export default class State extends Record({
  type: null,
  route: 'list',
  streets: List(),
  detail: null,
  config: null,
  user: null,
  ctx: null
}) {
  goList() {
    return this.set('route', 'list');
  }

  goDetail() {
    return this.set('route', 'detail');
  }

  findStreet(tagId) {
    return this.streets.findKey(Street.findByTagId(tagId));
  }

  setDetail(data) {
    return this
      .set('route', 'detail')
      .set('detail', data);
  }

  addStreet(street) {
    if (!(street instanceof Street)) {
      throw new Error(`Not a value of Street: ${street}`);
    }
    this.set('streets', this.streets.push(street));
    return this;
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
