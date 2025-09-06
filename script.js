// CONTACT FORM AJAX SUBMISSION & FEEDBACK
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const sendBtn = document.getElementById('sendBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();                 // stay on page
    statusEl.textContent = '';          // clear status
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';

    // Build payload
    const fd = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }, // tells FormSubmit to return JSON
        body: fd
      });

      if (res.ok) {
        statusEl.style.color = 'green';
        statusEl.textContent = 'Thanks! Your message has been sent.';
        form.reset();                   // ✅ clear fields on success
      } else {
        // Try to parse error if available
        let msg = 'Something went wrong. Please try again or email me directly.';
        try {
          const data = await res.json();
          if (data && data.message) msg = data.message;
        } catch {}
        statusEl.style.color = 'crimson';
        statusEl.textContent = msg;
      }
    } catch (err) {
      statusEl.style.color = 'crimson';
      statusEl.textContent = 'Network error. Please try again later.';
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
    }
  });
});
// =============================
// THEME TOGGLE (persisted)
// =============================
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  toggle.setAttribute('aria-pressed', String(mode === 'dark'));
  localStorage.setItem('theme', mode);
}
setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));
toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// =============================
// PORTFOLIO FILTERS
// =============================
const filters = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.setAttribute('aria-pressed', 'false'));
  btn.setAttribute('aria-pressed', 'true');
  const f = btn.dataset.filter;
  projects.forEach(card => {
    const tags = card.dataset.tags;
    const show = f === 'all' || (tags && tags.includes(f));
    card.style.display = show ? 'block' : 'none';
  });
}));

// =============================
// CONTACT FORM (basic validation + UX)
// =============================
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';
  const fd = new FormData(form);
  const payload = new URLSearchParams(fd);
  try {
    const res = await fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: payload });
    if (res.ok) {
      statusEl.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    } else {
      statusEl.textContent = 'Something went wrong. Please try again or email me directly.';
    }
  } catch (err) {
    statusEl.textContent = 'Network error. Please try again later.';
  }
});

// =============================
// MISC UI ENHANCEMENTS
// =============================
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('scrollTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Reveal on scroll (respect reduced motion)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.animate([
          { transform: 'translateY(12px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 }
        ], { duration: 450, easing: 'cubic-bezier(.2,.65,.2,1)', fill: 'forwards' });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.card, .title, .hero-ctas, .section-header').forEach(el => observer.observe(el));
}

// Replace this with your own GA4 if needed
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');