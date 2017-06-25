import test from 'ava';
import {List} from 'immutable';
import State from '../../src/renderer/records/state';
import Street from '../../src/renderer/records/street';

test.beforeEach(t => {
  t.context = {
    state: new State({
      streets: List([
        new Street({tagId: 'nodejs'})
      ])
    })
  };
});

test('state.go***', t => {
  let {state} = t.context;
  state = state.goDetail();
  t.is(state.route, 'detail');
  state = state.goList();
  t.is(state.route, 'list');
});

test('state.findStreet', t => {
  let {state} = t.context;
  t.is(state.findStreet('nodejs'), 0);
});

test.todo('state.addStreet');
test.todo('state.removeStreet');
test.todo('state.addStreetItems');
