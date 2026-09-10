/*
 * Lets a block that does not fit the page measure take the whole column, on request.
 *
 * Documentation pages cap everything — prose, tables, code, diagrams — at one measure, so the
 * column has a single edge down the page. That is right for reading and wrong for the occasional
 * wide table or long command, which the cap leaves scrolling inside a narrow box while there is
 * empty room to its right. This puts a toggle on those blocks instead of widening them all.
 *
 * The toggle appears whenever the column is wider than the measure, on every block that can use the
 * room. It deliberately does not try to work out whether a given block would benefit: a code block
 * wraps rather than overflows, a capped table reflows, a diagram scales — none of them can be asked
 * directly, and the measurement that guessed for them kept hiding the control on blocks that needed
 * it. At rest the button is faint enough not to compete with the content.
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

    wrapper.classList.toggle('widenable--offered', room);
  }

  var wrappers = [];

  function adopt(block) {
    if (block.closest('.widenable')) {
      return;
    }

    var wrapper = wrap(block);

    wrappers.push(wrapper);
    update(wrapper);
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

  // late layout — web fonts, images, the copy button appended inside every pre — can change the
  // column, so measure once more when the page is done
  window.addEventListener('load', function () {
    wrappers.forEach(update);
  });

  var pending;

  window.addEventListener('resize', function () {
    clearTimeout(pending);
    pending = setTimeout(function () {
      wrappers.forEach(update);
    }, 150);
  });
})();
