/* ==========================================================================
   DIONISIA DOS SANTOS SOARES — PORTFOLIO INTERACTIVITY (VANILLA JAVASCRIPT)
   Demonstrates:
   - document.getElementById()
   - document.querySelector() & document.querySelectorAll()
   - addEventListener()
   - Named event handler functions
   - Dynamic DOM manipulation using textContent and classList
   ========================================================================== */

(function () {
  "use strict";

  // ------------------------------------------------------------------------
  // 1. DOM ELEMENT SELECTION (getElementById, querySelector, querySelectorAll)
  // ------------------------------------------------------------------------
  const rootElement = document.documentElement;
  const siteHeader = document.getElementById("site-header");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const themeLabel = document.getElementById("theme-label");

  const menuToggleBtn = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");
  const skillsCountEl = document.getElementById("skills-count");

  const detailToggleButtons = document.querySelectorAll(".detail-toggle");

  const copyProfileBtn = document.getElementById("copy-profile-btn");
  const copyFeedbackEl = document.getElementById("copy-feedback");

  const contactForm = document.getElementById("contact-form");
  const formResetBtn = document.getElementById("form-reset-btn");
  const nameInput = document.getElementById("sender-name");
  const emailInput = document.getElementById("sender-email");
  const subjectInput = document.getElementById("message-subject");
  const messageInput = document.getElementById("sender-message");

  const nameErrorEl = document.getElementById("name-error");
  const emailErrorEl = document.getElementById("email-error");
  const subjectErrorEl = document.getElementById("subject-error");
  const messageErrorEl = document.getElementById("message-error");
  const formStatusEl = document.getElementById("form-status");

  const backToTopBtn = document.getElementById("back-to-top");
  const currentYearEl = document.getElementById("current-year");
  const sections = document.querySelectorAll("main section[id]");
  const revealElements = document.querySelectorAll(".reveal");

  // ------------------------------------------------------------------------
  // 2. THEME TOGGLE (DARK / LIGHT MODE)
  // ------------------------------------------------------------------------
  function applyTheme(theme) {
    const isDark = theme === "dark";
    rootElement.setAttribute("data-theme", theme);
    themeToggleBtn.setAttribute("aria-pressed", String(isDark));
    themeToggleBtn.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    // Dynamic DOM manipulation using textContent
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeLabel.textContent = isDark ? "Light" : "Dark";
  }

  function handleThemeToggle() {
    const currentTheme = rootElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
      // Ignore storage errors in restricted environments
    }
  }

  function initializeTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem("portfolio-theme");
    } catch (error) {
      savedTheme = null;
    }

    if (savedTheme === "dark" || savedTheme === "light") {
      applyTheme(savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      applyTheme("dark");
    } else {
      applyTheme("light");
    }
  }

  // ------------------------------------------------------------------------
  // 3. MOBILE HAMBURGER MENU
  // ------------------------------------------------------------------------
  function closeMobileMenu() {
    navMenu.classList.remove("is-open");
    menuToggleBtn.classList.remove("is-open");
    menuToggleBtn.setAttribute("aria-expanded", "false");
    menuToggleBtn.setAttribute("aria-label", "Open navigation menu");
  }

  function handleMenuToggle() {
    const isOpen = navMenu.classList.toggle("is-open");
    menuToggleBtn.classList.toggle("is-open", isOpen);
    menuToggleBtn.setAttribute("aria-expanded", String(isOpen));
    menuToggleBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  }

  function handleNavLinkClick(event) {
    // Update active state across links using classList
    navLinks.forEach(function (link) {
      link.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
    closeMobileMenu();
  }

  function handleDocumentKeyDown(event) {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeMobileMenu();
      menuToggleBtn.focus();
    }
  }

  // ------------------------------------------------------------------------
  // 4. INTERACTIVE SKILLS FILTER
  // ------------------------------------------------------------------------
  function handleSkillFilter(event) {
    const clickedBtn = event.currentTarget;
    const selectedCategory = clickedBtn.getAttribute("data-filter");

    // Toggle active class on filter buttons
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    clickedBtn.classList.add("active");

    let visibleCount = 0;

    skillCards.forEach(function (card) {
      const cardCategory = card.getAttribute("data-category");
      const shouldShow =
        selectedCategory === "all" || cardCategory === selectedCategory;

      if (shouldShow) {
        card.classList.remove("is-hidden");
        visibleCount += 1;
      } else {
        card.classList.add("is-hidden");
      }
    });

    // Update live counter textContent
    skillsCountEl.textContent =
      "Showing " + visibleCount + " of " + skillCards.length + " skills";
  }

  // ------------------------------------------------------------------------
  // 5. EXPERIENCE DETAIL TOGGLE BUTTONS
  // ------------------------------------------------------------------------
  function handleDetailToggle(event) {
    const button = event.currentTarget;
    const card = button.closest(".timeline-card");
    const extraContent = card.querySelector(".timeline-extra");
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isExpanded));

    if (isExpanded) {
      extraContent.setAttribute("hidden", "");
      button.textContent = "Show Key Contributions";
    } else {
      extraContent.removeAttribute("hidden");
      button.textContent = "Hide Key Contributions";
    }
  }

  // ------------------------------------------------------------------------
  // 6. COPY PROFILE SUMMARY BUTTON
  // ------------------------------------------------------------------------
  function handleCopyProfile() {
    const summaryText =
      "Dionisia Dos Santos Soares — D4 Software Engineering Technology (Politeknik Indonusa Surakarta, Indonesia). Interests: Web Development, Technology, Digital Innovation.";

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(summaryText)
        .then(function () {
          copyFeedbackEl.textContent = "Profile summary copied to clipboard.";
        })
        .catch(function () {
          copyFeedbackEl.textContent =
            "Copy unavailable here—please use the contact form.";
        });
    } else {
      copyFeedbackEl.textContent =
        "Dionisia Dos Santos Soares — Politeknik Indonusa Surakarta.";
    }
  }

  // ------------------------------------------------------------------------
  // 7. CONTACT FORM VALIDATION & SUBMISSION
  // ------------------------------------------------------------------------
  function setFieldError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    if (message) {
      inputEl.classList.add("is-invalid");
    } else {
      inputEl.classList.remove("is-invalid");
    }
  }

  function validateContactForm() {
    let isValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const subjectVal = subjectInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (nameVal.length < 2) {
      setFieldError(
        nameInput,
        nameErrorEl,
        "Please enter your full name (at least 2 characters)."
      );
      isValid = false;
    } else {
      setFieldError(nameInput, nameErrorEl, "");
    }

    if (!emailPattern.test(emailVal)) {
      setFieldError(
        emailInput,
        emailErrorEl,
        "Please enter a valid email address (e.g. name@example.com)."
      );
      isValid = false;
    } else {
      setFieldError(emailInput, emailErrorEl, "");
    }

    if (subjectVal.length < 3) {
      setFieldError(
        subjectInput,
        subjectErrorEl,
        "Please provide a short subject (at least 3 characters)."
      );
      isValid = false;
    } else {
      setFieldError(subjectInput, subjectErrorEl, "");
    }

    if (messageVal.length < 10) {
      setFieldError(
        messageInput,
        messageErrorEl,
        "Please write a message of at least 10 characters."
      );
      isValid = false;
    } else {
      setFieldError(messageInput, messageErrorEl, "");
    }

    return isValid;
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const isValid = validateContactForm();
    formStatusEl.classList.remove("is-success", "is-error");

    if (!isValid) {
      formStatusEl.classList.add("is-error");
      formStatusEl.textContent =
        "Please review the highlighted fields before sending your message.";
      return;
    }

    const senderName = nameInput.value.trim();
    formStatusEl.classList.add("is-success");
    formStatusEl.textContent =
      "Thank you, " +
      senderName +
      "! Your message passed validation and is ready (static preview mode — no backend connected).";

    contactForm.reset();
  }

  function handleFormReset() {
    contactForm.reset();
    setFieldError(nameInput, nameErrorEl, "");
    setFieldError(emailInput, emailErrorEl, "");
    setFieldError(subjectInput, subjectErrorEl, "");
    setFieldError(messageInput, messageErrorEl, "");
    formStatusEl.classList.remove("is-success", "is-error");
    formStatusEl.textContent = "";
  }

  // ------------------------------------------------------------------------
  // 8. SCROLL HANDLERS, BACK TO TOP & REVEAL ANIMATIONS
  // ------------------------------------------------------------------------
  function updateActiveNavOnScroll() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  function handleScroll() {
    const scrolledY = window.scrollY;

    if (scrolledY > 24) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }

    if (scrolledY > 360) {
      backToTopBtn.classList.add("is-visible");
    } else {
      backToTopBtn.classList.remove("is-visible");
    }

    updateActiveNavOnScroll();
  }

  function handleBackToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function initializeRevealAnimations() {
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px",
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ------------------------------------------------------------------------
  // 9. EVENT REGISTRATION (addEventListener) & INITIALIZATION
  // ------------------------------------------------------------------------
  function initializePortfolio() {
    initializeTheme();
    initializeRevealAnimations();
    handleScroll();

    if (currentYearEl) {
      currentYearEl.textContent = String(new Date().getFullYear());
    }

    themeToggleBtn.addEventListener("click", handleThemeToggle);
    menuToggleBtn.addEventListener("click", handleMenuToggle);
    document.addEventListener("keydown", handleDocumentKeyDown);

    navLinks.forEach(function (link) {
      link.addEventListener("click", handleNavLinkClick);
    });

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", handleSkillFilter);
    });

    detailToggleButtons.forEach(function (btn) {
      btn.addEventListener("click", handleDetailToggle);
    });

    if (copyProfileBtn) {
      copyProfileBtn.addEventListener("click", handleCopyProfile);
    }

    contactForm.addEventListener("submit", handleFormSubmit);
    formResetBtn.addEventListener("click", handleFormReset);

    window.addEventListener("scroll", handleScroll, { passive: true });
    backToTopBtn.addEventListener("click", handleBackToTop);
  }

  // Initialize once DOM is ready (using querySelector as well for demonstration)
  const mainContainer = document.querySelector("#main-content");
  if (mainContainer) {
    initializePortfolio();
  }
})();
