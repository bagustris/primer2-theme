// Converts inline furigana markup into <ruby>/<rt> elements after kramdown
// renders the page -- kramdown has no native syntax for it, so `{base|reading}`
// just passes through as literal text, the same situation markdown-alerts.js
// handles for GFM alert blockquotes.
//
// Syntax (and matching regex) borrowed from
// https://github.com/steven-kraft/obsidian-markdown-furigana:
//   {漢字|かんじ}   -> <ruby>漢字<rt>かんじ</rt></ruby>
//   {漢字|かん|じ}  -> <ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>  (one reading per character)
//
// In source Markdown, escape the pipe as \| when this sits on its own in a
// paragraph: kramdown's GFM table syntax treats any line with a bare `|` as
// a one-row table and splits it into <td> cells before this script ever
// runs. kramdown strips the backslash on render, so by the time this code
// sees the text it's back to a plain `|`. A `|` inside inline code or a
// fenced code block is unaffected either way.
document.addEventListener('DOMContentLoaded', function () {
  var FURIGANA_RE = /\{((?:[⺀-꓏＀-￯])+)((?:\\?\|[^ -\/{-~:-@\[-`]*)+)\}/g;
  var SKIP_TAGS = { CODE: 1, PRE: 1, SCRIPT: 1, STYLE: 1, RUBY: 1 };

  function convert(textNode) {
    var matches = Array.from(textNode.textContent.matchAll(FURIGANA_RE));
    var node = textNode;

    matches.forEach(function (match) {
      var readings = match[2].split('|').slice(1);
      var base = readings.length === 1 ? [match[1]] : Array.from(match[1]);
      if (base.length !== readings.length) return; // malformed -- leave as literal text

      var ruby = document.createElement('ruby');
      base.forEach(function (chars, i) {
        ruby.appendChild(document.createTextNode(chars));
        var rt = document.createElement('rt');
        rt.textContent = readings[i];
        ruby.appendChild(rt);
      });

      var offset = node.textContent.indexOf(match[0]);
      var toReplace = node.splitText(offset);
      node = toReplace.splitText(match[0].length);
      toReplace.replaceWith(ruby);
    });
  }

  function walk(el) {
    var textNodes = [];
    el.childNodes.forEach(function (child) {
      if (child.nodeType === Node.TEXT_NODE) {
        textNodes.push(child);
      } else if (!SKIP_TAGS[child.nodeName] && child.hasChildNodes()) {
        walk(child);
      }
    });
    textNodes.forEach(convert);
  }

  var body = document.querySelector('.markdown-body');
  if (body) walk(body);
});
