import prettier from 'prettier';

export default function format(codeData) {
  codeData.code = prettier.format(codeData.code);
  return codeData;
}
