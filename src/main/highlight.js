// import R from 'ramda';
import hljs from 'highlightjs';
import escapeHtml from 'escape-html';

export default function highlight({lang, code}) {
  try {
    return hljs.highlight(lang, code).value;
  } catch (_) {
    console.log(code);
    console.log(hljs.highlightAuto(code).value);
    return hljs.highlightAuto(code).value;
  }
}

// export default R.curry(highlight);
