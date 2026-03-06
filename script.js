(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-list a");
  const contactForm = document.getElementById("contact-form");

  // ----- Header scroll state -----
  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // ----- Mobile nav -----
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      const open = navList.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // ----- Scroll-triggered animations -----
  const animated = document.querySelectorAll(".animate-on-scroll");
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  animated.forEach(function (el) {
    observer.observe(el);
  });

  // ----- Hero stats counter -----
  const statNums = document.querySelectorAll(".stat-num[data-target]");

  function animateValue(el, end, duration) {
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(start + (end - start) * easeOut);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end;
      }
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"), 10);
        if (isNaN(target)) return;
        animateValue(el, target, 1500);
        statsObserver.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );

  statNums.forEach(function (el) {
    statsObserver.observe(el);
  });

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ----- Marquee scroll controls (prev/next) -----
  const scrollStep = 280;
  document.querySelectorAll(".marquee-with-controls").forEach(function (block) {
    const wrap = block.querySelector(".marquee-scroll-wrap");
    const prevBtn = block.querySelector(".marquee-prev");
    const nextBtn = block.querySelector(".marquee-next");
    if (!wrap || !prevBtn || !nextBtn) return;
    prevBtn.addEventListener("click", function () {
      wrap.scrollBy({ left: -scrollStep, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", function () {
      wrap.scrollBy({ left: scrollStep, behavior: "smooth" });
    });
  });

  // ----- Contact form -----
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;

      // Simulate submit (replace with real endpoint)
      setTimeout(function () {
        btn.textContent = "Sent!";
        btn.style.background = "var(--color-primary-dim)";
        contactForm.reset();
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = "";
        }, 2500);
      }, 800);
    });
  }
})();
