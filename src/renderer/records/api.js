import R from 'ramda';
import {Record, List} from 'immutable';
import queryString from 'query-string';
import snakecaseKeys from 'snakecase-keys';
import {uniqById} from '../helpers';
import Street from './street';

export default class Api extends Record({
  type: null,
  context: {},
  page: 2,
  perPage: 20
}) {
  get endpoint() {
    switch (this.type) {
      case Street.types.TAG: {
        return 'https://qiita.com/api/v2/tags';
      }
      case Street.types.SEARCH: {
        return 'https://qiita.com/api/v2/items';
      }
      case Street.types.STOCK: {
        return `https://qiita.com/api/v2/users/${this.context.userId}/stocks`;
      }
      default: {
        debugger;
        throw new Error('おかしい');
      }
    }
  }

  get query() {
    switch (this.type) {
      case Street.types.TAG:
      case Street.types.STOCK: {
        return queryString.stringify(
          snakecaseKeys(R.pick(['page', 'perPage'], this))
        );
      }
      case Street.types.SEARCH: {
        const data = R.pipe(
          R.pick(['page', 'perPage']),
          R.assoc('query', this.context.searchText)
        );
        return queryString.stringify(snakecaseKeys(data(this)));
      }
      default: {
        debugger;
        throw new Error('おかしい');
      }
    }
  }

  get firstUrl() {
    const query = queryString.stringify(
      {...queryString.parse(this.query), ...{page: 1}}
    );
    switch (this.type) {
      case Street.types.TAG: {
        return `${this.endpoint}/${this.context.tagId}/items?${query}`;
      }
      case Street.types.SEARCH:
      case Street.types.STOCK: {
        return `${this.endpoint}?${query}`;
      }
      default: {
        debugger;
        throw new Error('おかしい');
      }
    }
  }

  get url() {
    switch (this.type) {
      case Street.types.TAG: {
        return `${this.endpoint}/${this.context.tagId}/items?${this.query}`;
      }
      case Street.types.SEARCH:
      case Street.types.STOCK: {
        return `${this.endpoint}?${this.query}`;
      }
      default: {
        debugger;
        throw new Error('おかしい');
      }
    }
  }

  pageIncrement() {
    return this.set('page', this.page + 1);
  }
}
