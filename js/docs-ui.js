/*
 * Small behaviours of the documentation layout (_layouts/docs-adoc.html, _layouts/docs.html).
 *
 * 1. The menu entry of the current page is scrolled into view inside the sidebar, which scrolls on
 *    its own: on a page low in the menu it would otherwise be out of sight.
 * 2. The "On this page" column marks the section being read. A heading counts as current once it has
 *    passed the top quarter of the viewport; the last one passed wins.
 */
(function () {
  var menu = document.querySelector('.docs-side .bd-sidebar__menu');
  var active = menu && menu.querySelector('a.is-active');

  if (menu && active && window.matchMedia('(min-width: 768px)').matches) {
    var top = active.offsetTop - menu.offsetTop;

    if (top > menu.clientHeight * 0.6) {
      menu.scrollTop = top - menu.clientHeight / 3;
    }
  }

  var toc = document.querySelector('.docs-shell .bd-toc');

  if (!toc) {
    return;
  }

  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var targets = links
    .map(function (link) {
      var id = decodeURIComponent(link.getAttribute('href').slice(1));
      return { link: link, el: document.getElementById(id) };
    })
    .filter(function (t) {
      return t.el;
    });

  if (!targets.length) {
    return;
  }

  var current = null;
  var ticking = false;

  function update() {
    ticking = false;
    var line = window.innerHeight * 0.25;
    var next = targets[0];

    for (var i = 0; i < targets.length; i++) {
      if (targets[i].el.getBoundingClientRect().top <= line) {
        next = targets[i];
      } else {
        break;
      }
    }

    // at the bottom of the page the last sections may never reach the line
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      next = targets[targets.length - 1];
    }

    if (next !== current) {
      if (current) {
        current.link.classList.remove('is-current');
      }
      next.link.classList.add('is-current');
      current = next;
    }
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  update();
})();
