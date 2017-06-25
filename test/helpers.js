import test from 'ava';
import {
  getTagItemsUrl,
  pickTagId,
  uniqById
} from '../src/renderer/helpers';

test('getTagItemsUrl', t => {
  const url = getTagItemsUrl('nodejs');
  t.is(url, 'https://qiita.com/api/v2/tags/nodejs/items');
});

test('pickTagId', t => {
  const tagId = pickTagId({tagId: 1});
  t.is(tagId, 1);
});

test('uniqById', t => {
  const list = [
    {id: 1},
    {id: 1}
  ];
  const result = uniqById(list);
  t.is(result.length, 1);
});
