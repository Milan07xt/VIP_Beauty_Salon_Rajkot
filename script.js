document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  let delay = 0;
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.classList.add('show');
      }, delay);
      delay += 100;
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const menu = document.querySelector('.menu');
const links = document.querySelector('.links');
menu.addEventListener('click', () => {
  const open = getComputedStyle(links).display === 'flex';
  links.style.display = open ? 'none' : 'flex';
  menu.setAttribute('aria-expanded', String(!open));
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (window.innerWidth <= 700) {
    links.style.display = 'none';
    menu.setAttribute('aria-expanded', 'false');
  }
}));
