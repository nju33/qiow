import {Record, List} from 'immutable';
import {uniqById} from '@/helpers';

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

  addItemsIntoHead(items) {
    const nextItems = List(items)
      .concat(this.items)
      .withMutations(uniqById);
    return this.set('items', nextItems);
  }

  addItems(items) {
    const nextItems = this.items
      .concat(List(items))
      .withMutations(uniqById);
    return this.set('items', nextItems);
  }
}
