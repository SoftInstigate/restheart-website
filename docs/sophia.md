---
docs_version: 9
layout: no-footer
slack: false
applies_to: both
---

<div class="iframe-parent m-0 p-0">
  <!-- set the --vh property to set the height of the iframe correctly on desktop and mobile screen
       also scrolls to top on viewport resize
  -->
  <script>
    var lastVH = -1;
    const w = window.visualViewport || window;
    document.documentElement.style.setProperty('--vh', `${(w.height || w.innerHeight).toFixed(2) * 0.01}px`);
    // console.debug('set css variable --vh =', document.documentElement.style.getPropertyValue('--vh'));
    w.addEventListener('resize', debounce(() => {
      const _vh = ((w.height || w.innerHeight) * 0.01).toFixed(2);
      if (lastVH === _vh) { return; }
      lastVH = _vh;
      document.documentElement.style.setProperty('--vh', `${_vh}px`);
      window.scrollTo({top:0, left:0,behavior: 'instant'});
      // console.debug('set css variable --vh =', _vh);
    }), timeout = 100);
    function debounce(func, timeout = 300) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    }
  </script>
  <iframe src="https://sophia.restheart.com?scope=[%22restheart%22,%22both%22]" scrolling="yes"></iframe>
</div>
