// Soft motion for monobook.co. Content is fully visible without this file.
// Loads in <head> so revealed elements never flash. React calls window.mbMotion() after each page change.
(function () {
  var html = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { window.mbMotion = function () {}; return; }
  html.classList.add('js-motion');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  var barIo = null;

  function add(el) {
    if (el.classList.contains('rv')) return;
    el.classList.add('rv');
    io.observe(el);
  }

  function scan() {
    // Single items rise in; children of any [data-stagger] list rise in one after another.
    document.querySelectorAll('.section>.wrap>*,.pagehead .wrap>*').forEach(function (el) {
      if (!el.hasAttribute('data-stagger')) add(el);
    });
    document.querySelectorAll('[data-stagger]').forEach(function (list) {
      Array.prototype.forEach.call(list.children, function (el, i) {
        el.style.setProperty('--i', Math.min(i, 8));
        add(el);
      });
    });
    // Mobile bar slides up once the hero button (or page heading) has scrolled away.
    var bar = document.querySelector('.mobile-cta');
    var trigger = document.querySelector('.hero .btn, .pagehead');
    if (barIo) barIo.disconnect();
    if (bar && trigger) {
      barIo = new IntersectionObserver(function (e) { bar.classList.toggle('is-shown', !e[0].isIntersecting); });
      barIo.observe(trigger);
    } else if (bar) { bar.classList.add('is-shown'); }
  }
  window.mbMotion = scan;

  // Header gets a hairline shadow after the first scroll.
  window.addEventListener('scroll', function () {
    var header = document.querySelector('.site-header');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
})();
