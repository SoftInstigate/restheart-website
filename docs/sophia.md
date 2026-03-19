---
docs_version: 9
layout: no-footer
slack: false
applies_to: both
---

<style>
.sophia-page-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(var(--vh, 1vh) * 100 - 64px);
}
.sophia-info-bar {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  font-size: 0.88rem;
  text-align: center;
}
.sophia-info-bar a { color: #f8a839; }
.sophia-page-wrapper .iframe-parent {
  flex: 1;
  height: auto !important;
}
.sophia-page-wrapper .iframe-parent iframe {
  height: 100% !important;
}
</style>

<div class="sophia-page-wrapper">
<div class="sophia-info-bar">
  You are chatting with a <strong>Sophia</strong> instance configured to answer questions about RESTHeart.
  Sophia is an AI platform by SoftInstigate, available as a managed cloud service or for on-premises deployment —
  <a href="/docs/cloud/sophia/">learn more</a>.
</div>

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
  <iframe src="https://sophia.restheart.com/contexts/restheart?mcp-link=https:%2F%2Frestheart.org%2Fdocs%2Fcloud%2Fsophia%2Fmcp%23softinstigate-public-mcp-servers" scrolling="yes"></iframe>
</div>
</div>
