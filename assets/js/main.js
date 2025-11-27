// main.js — basic interactive behaviours: mobile nav, sticky header, smooth scroll
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navList = document.querySelector('.nav-list');
  const header = document.getElementById('site-header');
  const year = document.getElementById('year');

  // Set current year in footer
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav toggle
  hamburger.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    navList.classList.toggle('show');
  });

  // Close menu on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-inner') && navList.classList.contains('show')) {
      navList.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Sticky header shadow on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    const sc = window.scrollY;
    if (sc > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    lastScroll = sc;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".animate-in");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.2
  });

  items.forEach(item => observer.observe(item));
});




/* Testimonials: counters, carousel sliding, modal video */

// COUNTERS (runs once when visible)
(function counters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const run = (el, target) => {
    let start = 0;
    const duration = 1400;
    const step = Math.max(1, Math.floor(target / (duration / 30)));
    function tick() {
      start += step;
      if (start >= target) el.textContent = target;
      else { el.textContent = start; requestAnimationFrame(tick); }
    }
    tick();
  };

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const el = en.target;
        run(el, +el.dataset.target || 0);
        o.unobserve(el);
      }
    });
  }, {threshold: 0.35});

  counters.forEach(c => obs.observe(c));
})();

// Carousel Controls
const carousel = document.querySelector('.carousel');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

nextBtn.addEventListener('click', () => { carousel.scrollBy({ left: 260, behavior:'smooth' }); });
prevBtn.addEventListener('click', () => { carousel.scrollBy({ left: -260, behavior:'smooth' }); });

// Counter Animation
const counters = document.querySelectorAll('.counter');
const options = { threshold: 0.5 };

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const increment = Math.ceil(target / 100);

      const updateCounter = () => {
        count += increment;
        if(count > target) count = target;
        counter.textContent = count;
        if(count < target) requestAnimationFrame(updateCounter);
      };
      updateCounter();
      observer.unobserve(counter);
    }
  });
}, options);

counters.forEach(counter => counterObserver.observe(counter));



 const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';

      const formData = new FormData(form);

      try {
        const response = await fetch('https://formspree.io/f/mrbwpqaa',  {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          successMsg.style.display = 'block';
          form.reset();
        } else {
          errorMsg.style.display = 'block';
        }
      } catch (error) {
        errorMsg.style.display = 'block';
      }
    });

  // Extract student name from URL query ?name=Daniel
const urlParams = new URLSearchParams(window.location.search);
const studentName = urlParams.get('name'); // renamed variable
if (studentName) {
  document.getElementById('student-name').textContent = `Thank You, ${studentName}!`;
}
