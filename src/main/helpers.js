import cheerio from 'cheerio';
import escapeHtml from 'escape-html';
import hljs from 'highlightjs';
import codeFormat from './code-format';

const highlight = (lang, code) => {
  return hljs.highlight(lang, code).value;
};

export const transformContents = contents => {
  const $ = cheerio.load(contents, {decodeEntities: false});
  // const codeBlocks = $('.code-frame');
  $('.code-frame').each(function () {
    const $el = $(this);
    const lang = $el.data('lang')
    const $pre = $el.find('pre')
    const code = $pre.text();
    const formattedCode = codeFormat({lang, code});
    // if (lang === 'text' || lang === '') {

    $pre.text(formattedCode);
    // }
    // try {
    //   if (lang === 'text') {
    //     $pre.text(escapeHtml(code));
    //   }
    //
    //   const transformed = highlight(lang, code);
    //   console.log('transformed');
    //   $pre.html(transformed);
    // } catch (_) {
    //   console.log(99);
    //   $pre.text(escapeHtml(code));
    // }
  });
  return $.html();
  // if (codeBlocks.length === 0) {
  //   return;
  // }

  // Array.from(codeBlocks).forEach(block => {
  //   const {lang} = block.dataset;
  //   const pre = block.querySelector('pre');
  //   if (pre === null) {
  //     return;
  //   }
  //   try {
  //     hljs.highlight(lang, pre.innerText).value;
  //   } catch (_) {}
  // });
  // return 1;
};
