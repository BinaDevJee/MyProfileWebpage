/* ============================================================
   PERSONAL PORTFOLIO WEBSITE — MAIN JAVASCRIPT
   Features: Preloader, Navbar, Scroll Animations, Gallery,
             Skill Bars, Back-to-Top, Mobile Menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ---------- 1. Preloader ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 500);
    });
    // Fallback: hide after 3s even if load doesn't fire
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
      }
    }, 3000);
  }

  /* ---------- 2. Navbar Scroll Effect ---------- */
  const navbar = document.querySelector('.navbar-custom');
  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check

  /* ---------- 3. Active Navigation Link ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-custom .nav-link[href^="#"]');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink);

  /* ---------- 4. Close Mobile Menu on Link Click ---------- */
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navbarToggler = document.querySelector('.navbar-toggler');

  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });

  /* ---------- 5. Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ---------- 6. Scroll Animations (Intersection Observer) ---------- */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    animateElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all elements
    animateElements.forEach((el) => el.classList.add('animated'));
  }

  /* ---------- 7. Skill Bar Animation ---------- */
  const skillBars = document.querySelectorAll('.skill-bar .progress-bar');

  if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth + '%';
            skillObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));
  }

  /* ---------- 8. Back to Top Button ---------- */
  const backToTopBtn = document.querySelector('.back-to-top');

  const handleBackToTop = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTop);

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 9. Gallery Modal ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryModal = document.getElementById('galleryModal');

  if (galleryModal && galleryItems.length > 0) {
    const modalBody = galleryModal.querySelector('.modal-body');
    const bsModal = new bootstrap.Modal(galleryModal);

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const video = item.querySelector('video');

        modalBody.innerHTML = '';

        if (video) {
          const videoClone = document.createElement('video');
          videoClone.src = video.src;
          videoClone.controls = true;
          videoClone.autoplay = true;
          videoClone.style.maxWidth = '100%';
          videoClone.style.maxHeight = '80vh';
          videoClone.style.borderRadius = '12px';
          modalBody.appendChild(videoClone);
        } else if (img) {
          const imgClone = document.createElement('img');
          imgClone.src = img.src;
          imgClone.alt = img.alt || 'Gallery image';
          modalBody.appendChild(imgClone);
        }

        bsModal.show();
      });
    });

    // Pause videos when modal closes
    galleryModal.addEventListener('hidden.bs.modal', () => {
      const activeVideo = modalBody.querySelector('video');
      if (activeVideo) {
        activeVideo.pause();
        activeVideo.currentTime = 0;
      }
      modalBody.innerHTML = '';
    });
  }

  /* ---------- 10. Counter Animation ---------- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
              current += step;
              if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target;
              }
            };
            updateCounter();
            counterObserver.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- 11. Typing Effect for Hero (optional class) ---------- */
  const typingEl = document.querySelector('.typing-effect');
  if (typingEl) {
    const text = typingEl.getAttribute('data-text') || typingEl.textContent;
    typingEl.textContent = '';
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        typingEl.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
      }
    };
    setTimeout(typeWriter, 1000);
  }
});
