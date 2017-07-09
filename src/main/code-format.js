import R from 'ramda';
import format from './format';
import highlight from './highlight';

export default function codeFormat(codeData) {
  const result = R.pipe(
    format,
    highlight
  )(codeData);
  console.log(result);
  return result;
}
