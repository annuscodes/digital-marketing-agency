/* ===========================
   GSAP + SCROLLTRIGGER SETUP
   =========================== */
gsap.registerPlugin(ScrollTrigger);

/* ===========================
   REDUCED MOTION CHECK
   =========================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===========================
   MOBILE NAV
   =========================== */
const menuToggle = document.querySelector('.menu-toggle');
const siteHeader = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-links a');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    document.body.classList.toggle('nav-open');
  });
}

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ===========================
   NAV SCROLL SHADOW
   =========================== */
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
});

/* ===========================
   COUNTER ANIMATION (reusable)
   =========================== */
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const isDecimal = element.hasAttribute('data-decimal');
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
    
    // Ease out quad
    const easeProgress = progress * (2 - progress);
    const currentVal = start + (end - start) * easeProgress;
    
    element.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = isDecimal ? end.toFixed(1) : end;
    }
  };
  
  window.requestAnimationFrame(step);
}

/* ===========================
   HERO ANIMATION TIMELINE
   =========================== */
const chartLine = document.querySelector('.chart-line');
const chartDots = document.querySelectorAll('.chart-dot');
const heroStat = document.querySelector('.hero-stat-number');

if (chartLine && !prefersReducedMotion) {
  // Set up chart line drawing based on actual path length
  const length = chartLine.getTotalLength();
  chartLine.style.strokeDasharray = length;
  chartLine.style.strokeDashoffset = length;
  
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  
  heroTl
    .from(".hero-headline", { y: 40, opacity: 0, duration: 0.8, delay: 0.2 })
    .from(".hero-sub", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4")
    .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
    .to(".chart-line", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, "-=0.2")
    .from(".chart-dot", { scale: 0, opacity: 0, duration: 0.3, stagger: 0.1, transformOrigin: "center" }, "-=0.3")
    .call(() => {
      if (heroStat) {
        const target = parseFloat(heroStat.getAttribute('data-target'));
        animateCounter(heroStat, 0, target, 2);
      }
    });
} else if (prefersReducedMotion) {
  // Immediately show final state if user prefers reduced motion
  if (chartLine) {
    chartLine.style.strokeDasharray = "none";
    chartLine.style.strokeDashoffset = "0";
  }
  chartDots.forEach(dot => dot.style.opacity = "1");
  if (heroStat) {
    heroStat.textContent = heroStat.getAttribute('data-target');
  }
}

/* ===========================
   SCROLL-TRIGGERED FADE-INS
   =========================== */
if (!prefersReducedMotion) {
  const revealElements = gsap.utils.toArray('.scroll-reveal');
  
  revealElements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  });
}

/* ===========================
   STAT COUNTERS ON SCROLL
   =========================== */
const resultsSection = document.querySelector('.results');
const statCounters = document.querySelectorAll('.results .counter');

if (resultsSection && !prefersReducedMotion) {
  ScrollTrigger.create({
    trigger: resultsSection,
    start: "top 80%",
    once: true,
    onEnter: () => {
      statCounters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        animateCounter(counter, 0, target, 2.5);
      });
    }
  });
} else if (prefersReducedMotion && statCounters.length > 0) {
  statCounters.forEach(counter => {
    counter.textContent = counter.getAttribute('data-target');
  });
}

/* ===========================
   TESTIMONIAL CAROUSEL
   =========================== */
const track = document.getElementById('testimonialTrack');
const dots = document.querySelectorAll('.carousel-dots .dot');

if (track && dots.length > 0) {
  // Update active dot on scroll
  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const cardWidth = track.clientWidth;
    const activeIndex = Math.round(scrollLeft / cardWidth);
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  });
  
  // Click dot to scroll to testimonial
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const cardWidth = track.clientWidth;
      track.scrollTo({
        left: cardWidth * index,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
}

/* ===========================
   CONTACT FORM
   =========================== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    // Basic frontend validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      const group = input.parentElement;
      if (!input.value.trim() || (input.type === 'email' && !input.value.includes('@'))) {
        group.classList.add('has-error');
        isValid = false;
      } else {
        group.classList.remove('has-error');
      }
    });
    
    // If valid, show success message
    if (isValid) {
      contactForm.classList.add('hidden');
      formSuccess.classList.remove('hidden');
    }
  });
  
  // Clear error styling on input
  contactForm.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      e.target.parentElement.classList.remove('has-error');
    }
  });
}
