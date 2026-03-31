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
.sophia-info-bar-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.sophia-info-bar-dismiss {
  flex-shrink: 0;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 4px;
  color: rgba(255,255,255,0.85);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.25rem 0.65rem;
  min-height: 2rem;
  min-width: 3rem;
}
.sophia-info-bar-dismiss:hover { background: rgba(255,255,255,0.22); color: #fff; }
.sophia-info-bar-reopen {
  display: none;
  background: rgba(50, 50, 65, 0.92);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.85rem 0.3rem;
  position: absolute;
  right: 1.5rem;
  z-index: 10;
  white-space: nowrap;
  line-height: 1;
  transition: color 0.15s, transform 0.15s;
}
.sophia-info-bar-reopen:hover {
  color: rgba(255,255,255,0.9);
  transform: translateY(1px);
}
.sophia-page-wrapper .iframe-parent {
  flex: 1;
  height: auto !important;
}
.sophia-page-wrapper .iframe-parent iframe {
  height: 100% !important;
}
</style>

<div class="sophia-page-wrapper" style="position:relative">
<div class="sophia-info-bar" id="sophia-info-bar">
  <div class="sophia-info-bar-inner">
    <span>You are chatting with a <strong>Sophia</strong> instance configured to answer questions about RESTHeart.
    Sophia is an AI platform by SoftInstigate, available as a managed cloud service or for on-premises deployment —
    <a href="/docs/cloud/sophia/">learn more</a>.</span>
    <button class="sophia-info-bar-dismiss" id="sophia-info-bar-dismiss" aria-label="Dismiss">Got it</button>
  </div>
</div>
<button class="sophia-info-bar-reopen" id="sophia-info-bar-reopen" aria-label="Show info">&#x2139;</button>
<script>
  (function() {
    var bar = document.getElementById('sophia-info-bar');
    var reopen = document.getElementById('sophia-info-bar-reopen');
    function dismiss() {
      bar.style.display = 'none';
      reopen.style.display = 'block';
      sessionStorage.setItem('sophia-info-bar-dismissed', '1');
    }
    function show() {
      bar.style.display = '';
      reopen.style.display = 'none';
      sessionStorage.removeItem('sophia-info-bar-dismissed');
    }
    if (sessionStorage.getItem('sophia-info-bar-dismissed')) { dismiss(); }
    document.getElementById('sophia-info-bar-dismiss').addEventListener('click', dismiss);
    reopen.addEventListener('click', show);
  })();
</script>

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
