/*
 * Lets a block that does not fit the page measure take the whole column, on request.
 *
 * Documentation pages cap everything — prose, tables, code, diagrams — at one measure, so the
 * column has a single edge down the page. That is right for reading and wrong for the occasional
 * wide table or long command, which the cap leaves scrolling inside a narrow box while there is
 * empty room to its right. This puts a toggle on those blocks instead of widening them all.
 *
 * The toggle only appears where it would do something: when the column is actually wider than the
 * measure, and when the block has more content than it can show. Blocks that fit stay quiet.
 */
(function () {
  var BLOCKS = [
    'table.tableblock',
    '.imageblock',
    '.listingblock',
    '.literalblock',
    '.videoblock',
    '.mermaid-diagram'
  ];

  var content = document.querySelector('.doc .bd-content');

  if (!content) {
    return;
  }

  var ICON_WIDEN = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3L2 8l4 5M10 3l4 5-4 5"/></svg>';
  var ICON_NARROW = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3l4 5-4 5M14 3l-4 5 4 5"/></svg>';

  /*
   * Whether the block is showing everything it has.
   *
   * A pre and an image can be asked directly. A table squeezed by a max-width does not overflow —
   * it reflows, wrapping cell text — and a diagram scales, so neither can answer; there the offer
   * is made whenever there is room, and the reader decides.
   */
  function needsRoom(block) {
    var pre = block.querySelector('pre');

    if (pre) {
      return pre.scrollWidth > pre.clientWidth + 1;
    }

    var img = block.querySelector('img');

    if (img) {
      return img.naturalWidth > img.clientWidth + 1;
    }

    return true;
  }

  function wrap(block) {
    var wrapper = document.createElement('div');

    wrapper.className = 'widenable';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    var toggle = document.createElement('button');

    toggle.type = 'button';
    toggle.className = 'widenable__toggle';
    toggle.innerHTML = ICON_WIDEN;
    toggle.title = 'Use the full width';
    toggle.setAttribute('aria-label', 'Use the full width');
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', function () {
      var wide = wrapper.classList.toggle('is-wide');

      toggle.innerHTML = wide ? ICON_NARROW : ICON_WIDEN;
      toggle.title = wide ? 'Back to the page width' : 'Use the full width';
      toggle.setAttribute('aria-label', toggle.title);
      toggle.setAttribute('aria-expanded', String(wide));
    });

    wrapper.appendChild(toggle);

    return wrapper;
  }

  /*
   * An expanded block keeps its toggle whatever the measurement says: once widened it fills the
   * column, so "is there room left" is false exactly when the reader most needs the way back.
   */
  function update(wrapper) {
    if (wrapper.classList.contains('is-wide')) {
      wrapper.classList.add('widenable--offered');
      return;
    }

    var room = wrapper.parentElement.clientWidth - wrapper.clientWidth > 8;
    var block = wrapper.firstElementChild;

    wrapper.classList.toggle('widenable--offered', room && needsRoom(block));
  }

  var wrappers = [];

  function adopt(block) {
    if (block.closest('.widenable')) {
      return;
    }

    var wrapper = wrap(block);

    wrappers.push(wrapper);
    update(wrapper);

    // an image measured before it loaded reports a natural width of 0
    var img = block.querySelector('img');

    if (img && !img.complete) {
      img.addEventListener('load', function () {
        update(wrapper);
      });
    }
  }

  function scan() {
    content.querySelectorAll(BLOCKS.join(',')).forEach(adopt);

    // mermaid swaps a rendered diagram in for the block a wrapper was measured around, so what a
    // wrapper holds can change without the wrapper itself being new
    wrappers.forEach(update);
  }

  scan();

  // mermaid replaces its listingblock with a rendered diagram after this has already run
  new MutationObserver(scan).observe(content, { childList: true, subtree: true });

  var pending;

  window.addEventListener('resize', function () {
    clearTimeout(pending);
    pending = setTimeout(function () {
      wrappers.forEach(update);
    }, 150);
  });
})();
