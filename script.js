/**
 * Denis - Personal Homepage
 * Vanilla JavaScript (No frameworks)
 * Gruvbox Theme Switcher, Mobile Navigation & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initActiveNavOnScroll();
  initContactForm();
});

/* ==========================================================================
   1. Theme Switcher (Gruvbox Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  const rootElement = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  
  let currentTheme = savedTheme ? savedTheme : (prefersLight ? 'light' : 'dark');
  applyTheme(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  });

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark Mode';
      themeToggleBtn.setAttribute('aria-label', 'Switch to Gruvbox Dark theme');
    } else {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light Mode';
      themeToggleBtn.setAttribute('aria-label', 'Switch to Gruvbox Light theme');
    }
  }

  // Listen for system theme changes if user has not explicitly chosen
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'light' : 'dark';
      currentTheme = newTheme;
      applyTheme(newTheme);
    }
  });
}

/* ==========================================================================
   2. Mobile Navigation Toggle & Accessibility
   ========================================================================== */
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  navToggle.addEventListener('click', () => toggleMenu());

  // Close mobile menu when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        toggleMenu(true);
      }
    });
  });

  // Close menu on clicking outside
  document.addEventListener('click', (event) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      toggleMenu(true);
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(true);
      navToggle.focus();
    }
  });
}

/* ==========================================================================
   3. Active Section Highlighting on Scroll
   ========================================================================== */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    const headerHeight = 90;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

/* ==========================================================================
   4. Interactive Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !formStatus || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      showStatus('Please fill out all required fields.', 'error');
      return;
    }

    // Simple email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Emulate sending
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      showStatus(`Thank you, ${name}! Your message has been received. I will reply soon.`, 'success');
      form.reset();
    }, 600);
  });

  function showStatus(text, type) {
    formStatus.textContent = text;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 6000);
  }
}
