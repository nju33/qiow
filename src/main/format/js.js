import prettier from 'prettier';

export default function format(codeData) {
  try {
    codeData.code = prettier.format(codeData.code);
  } catch (_) {
    return codeData;
  }
  return codeData;
}
