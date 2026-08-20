// Detects GitHub-style alert blockquotes (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`,
// `[!WARNING]`, `[!CAUTION]`) and re-styles them.
//
// kramdown (this theme's markdown renderer) doesn't understand that syntax --
// it just emits a plain <blockquote> whose first line is the literal text
// "[!NOTE]" followed by a <br>. This runs after render, strips that marker,
// and swaps in the classes/icon that _sass/primer-markdown/lib/alerts.scss
// styles, so authors can keep writing the same syntax GitHub renders natively.
document.addEventListener('DOMContentLoaded', function () {
  var ALERT_TYPES = {
    NOTE: {
      label: 'Note',
      icon: '<path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>'
    },
    TIP: {
      label: 'Tip',
      icon: '<path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.856.621 1.345a.75.75 0 0 1-1.48.25c-.041-.238-.19-.55-.436-.905a11.098 11.098 0 0 0-.579-.729l-.232-.274c-.554-.665-1.255-1.622-1.255-3.092C2.51 2.55 4.907.5 8 .5c3.093 0 5.489 2.05 5.489 4.75 0 1.47-.7 2.427-1.255 3.092l-.232.274a11.15 11.15 0 0 0-.579.729c-.246.354-.395.667-.436.905a.75.75 0 1 1-1.48-.25c.084-.49.337-.934.621-1.345.203-.292.45-.584.673-.848.075-.088.147-.174.214-.253.56-.679.984-1.32.984-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>'
    },
    IMPORTANT: {
      label: 'Important',
      icon: '<path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A.25.25 0 0 1 5 15.396V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h4a.75.75 0 0 1 .75.75v1.688l1.97-1.969a.75.75 0 0 1 .53-.219h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>'
    },
    WARNING: {
      label: 'Warning',
      icon: '<path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>'
    },
    CAUTION: {
      label: 'Caution',
      icon: '<path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.141.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>'
    }
  };
  var MARKER_RE = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/;

  document.querySelectorAll('.markdown-body blockquote').forEach(function (bq) {
    var p = bq.querySelector('p');
    if (!p || !p.firstChild || p.firstChild.nodeType !== Node.TEXT_NODE) return;

    var match = p.firstChild.textContent.match(MARKER_RE);
    if (!match) return;

    var type = match[1];
    var config = ALERT_TYPES[type];

    // Strip the "[!NOTE]" marker and the line break kramdown puts right after it.
    p.firstChild.textContent = p.firstChild.textContent.slice(match[0].length);
    if (p.firstChild.textContent === '') p.removeChild(p.firstChild);
    if (p.firstChild && p.firstChild.nodeName === 'BR') p.removeChild(p.firstChild);
    if (p.firstChild && p.firstChild.nodeType === Node.TEXT_NODE) {
      p.firstChild.textContent = p.firstChild.textContent.replace(/^\s+/, '');
    }

    bq.classList.add('markdown-alert', 'markdown-alert-' + type.toLowerCase());

    var title = document.createElement('p');
    title.className = 'markdown-alert-title';
    title.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">' +
      config.icon +
      '</svg>' +
      config.label;
    bq.insertBefore(title, bq.firstChild);
  });
});
