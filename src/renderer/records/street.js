import {Record, List} from 'immutable';
import {uniqById} from '../helpers';
import Api from './api';

export default class Street extends Record({
  type: null,
  context: {},
  width: 400,
  title: null,
  tid: null,
  items: List(),
  api: null,
}) {
  static types = {
    TAG: 'TAG',
    SEARCH: 'SEARCH',
    STOCK: 'STOCK',
  };

  static findByTagId(tagId) {
    return street => street.context.tagId === tagId;
  }

  static findBySearchText(searchText) {
    return street => street.context.searchText === searchText;
  }

  static findStockByUserId(userId) {
    return street => {
      return street.type === Street.types.STOCK &&
             street.context.userId === userId;
    };
  }

  constructor(data) {
    const title = Object.values(data.context).join(',');
    const api = new Api({
      type: data.type,
      context: data.context
    });
    super({...data, title, api});
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

  pageIncrement() {
    const nextApi = this.api.pageIncrement();
    return this.set('api', nextApi);
  }
}
