import R from 'ramda';
import jsFormat from './js';

const proc = R.cond([
  [
    R.where({
      lang: R.either(R.equals('js'), R.equals('javascript'))
    }),
    jsFormat
  ],
  [
    R.where({lang: R.T}),
    R.tap(codeData => codeData)
  ]
]);

export default function format(codeData) {
  return proc(codeData);
}

// export default R.curry(format);
