/* Mark that JavaScript is running (lets CSS hide sections for the reveal effect) */
document.documentElement.classList.add('js');

/* ===== Project GitHub repository links: paste each repo URL between the quotes ===== */
const PROJECT_REPOS = {
  hr: 'https://github.com/mohamedabudhahir/hr-analytics-employee-attribution',
  customer: 'https://github.com/mohamedabudhahir/customer-shopping-behavior-analysis'
};
document.querySelectorAll('[data-repo]').forEach(a => {
  const url = PROJECT_REPOS[a.dataset.repo];
  if (url) {
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.removeAttribute('aria-disabled'); a.textContent = 'View on GitHub';
  } else {
    a.addEventListener('click', e => e.preventDefault()); // placeholder: nothing to open yet
  }
});

/* Footer year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile menu */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A') { navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
});

/* Scroll reveal + active nav highlighting */
const sections = document.querySelectorAll('main section[id]');
const linkFor = id => navLinks.querySelector('a[href="#' + id + '"]');
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const l = linkFor(en.target.id); if (l) l.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObs.observe(s));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

/* Back-to-top button */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => { toTop.hidden = window.scrollY < 600; }, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

/* Contact form: validate, then open the visitor's email app (no server needed) */
const form = document.getElementById('form');
const status = document.getElementById('status');
const rules = {
  name: v => v.trim() ? '' : 'Enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address, like name@example.com.',
  subject: v => v.trim() ? '' : 'Enter a subject.',
  message: v => v.trim().length >= 10 ? '' : 'Enter a message of at least 10 characters.'
};
function check(field) {
  const msg = rules[field.name](field.value);
  document.getElementById('e-' + field.name).textContent = msg;
  field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [...form.querySelectorAll('input,textarea')];
  const results = fields.map(check);            // validate every field
  const firstBad = fields[results.indexOf(false)];
  if (firstBad) { firstBad.focus(); return; }
  const d = Object.fromEntries(new FormData(form));
  const body = d.message + '\n\nFrom: ' + d.name + ' (' + d.email + ')';
  window.location.href = 'mailto:mohamedabudhahir92@gmail.com?subject=' + encodeURIComponent(d.subject) + '&body=' + encodeURIComponent(body);
  status.textContent = 'Your email app should open with the message ready. If it does not, email me directly at the address shown.';
});
form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') check(e.target); });
