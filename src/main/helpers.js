import cheerio from 'cheerio';
import hljs from 'highlightjs';

export const transformContents = contents => {
  const $ = cheerio.load(contents, {decodeEntities: false});
  // const codeBlocks = $('.code-frame');
  $('.code-frame').each(function () {
    const $el = $(this);
    const lang = $el.data('lang')
    const $pre = $el.find('pre')
    const code = $pre.text();
    console.log(code);
    try {
      const transformed = hljs.highlight(lang, code).value;
      $pre.html(transformed);
    } catch (_) {}
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
