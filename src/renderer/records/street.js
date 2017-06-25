import {Record, List} from 'immutable';
import {uniqById} from '../helpers';

export default class Street extends Record({
  tagId: null,
  tid: null,
  items: List()
}) {
  static findByTagId(targetId) {
    return obj => {
      return obj.tagId === targetId;
    }
  }

  isChanged(items) {
    const item = this.getIn(['items', 0]);
    if (typeof item === 'undefined') {
      return true;
    } else if (item.id !== items[0].id) {
      return true;
    }
    return false;
  }

  _uniqById(list) {
    const arr = list.toArray();
    const uniqedArr = uniqById(arr);
    return List(uniqedArr);
  }

  addItemsIntoHead(items) {
    const concatenated = List(items).concat(this.items);
    const nextItems = this._uniqById(concatenated);
    return this.set('items', nextItems);
  }

  addItems(items) {
    const concatenated = this.items.concat(List(items));
    const nextItems = this._uniqById(concatenated);
    return this.set('items', nextItems);
  }
}
