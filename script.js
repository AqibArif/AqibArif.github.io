// Animated counters in the status bar — runs once on load
function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  counters.forEach(el => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);

    if (reduceMotion) {
      el.textContent = formatNumber(target, decimals);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = formatNumber(value, decimals);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, decimals);
    }
    requestAnimationFrame(tick);
  });
}

function formatNumber(value, decimals) {
  if (decimals > 0) return value.toFixed(decimals);
  return Math.round(value).toLocaleString('en-US');
}

// Trigger counters when the status bar scrolls into view (also fires on load since it's in the hero)
const statusBar = document.getElementById('statusBar');
if (statusBar) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(statusBar);
}

// Nav background intensifies on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 1px 0 rgba(125,211,168,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
