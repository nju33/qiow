import test from 'ava';
import Street from '../../src/renderer/records/street';

test.beforeEach(t => {
  t.context = {
    street: new Street()
  };
});

test('street.addItems', t => {
  let {street} = t.context;
  street = street.addItems([
    {id: 1},
    {id: 2}
  ]);
  street = street.addItems([
    {id: 2},
    {id: 3}
  ]);
  t.is(street.items.size, 3);
  t.is(street.items.last().id, 3);
});

test('street.addItemsIntoHead', t => {
  let {street} = t.context;
  street = street.addItems([
    {id: 2},
    {id: 3}
  ]);
  street = street.addItemsIntoHead([
    {id: 1},
    {id: 2}
  ]);
  t.is(street.items.size, 3);
  t.is(street.items.first().id, 1)
});

test('street.isChanged', t => {
  const items = [
    {id: 1},
    {id: 2}
  ];
  let {street} = t.context;

  street = street.addItems(items);
  t.false(street.isChanged(items));
  t.true(street.isChanged([{id: 2}]));
});
