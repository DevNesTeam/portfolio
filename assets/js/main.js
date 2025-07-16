/**
* Template Name: SoftLand
* Template URL: https://bootstrapmade.com/softland-bootstrap-app-landing-page-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  let glightboxInstance = null;
  function initGlightbox() {
    if (glightboxInstance) {
      glightboxInstance.destroy();
    }
    glightboxInstance = GLightbox({
      selector: '.glightbox',
      skin: 'zoom',
      openEffect: 'zoom',
      closeEffect: 'zoom',
      cssEfects: {
        fade: 'fade',
        zoom: 'zoom'
      }
    });
  }

  window.addEventListener('load', initGlightbox);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Dynamic content loading logic
   */
  const contentDiv = document.querySelector("#content");

  // Handler function for dynamic loading links
  function handleDynamicLoad(e) {
    e.preventDefault();
    const targetPage = this.getAttribute("data-load");

    fetch(targetPage)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newMain = doc.querySelector("main");
        contentDiv.innerHTML = newMain ? newMain.innerHTML : "<p>تعذر تحميل المحتوى</p>";

        // بعد تحميل المحتوى الجديد، أعد تهيئة المكونات والروابط
        reinitializePlugins();
      })
      .catch(err => {
        contentDiv.innerHTML = "<p>تعذر تحميل الصفحة المطلوبة.</p>";
        console.error("Error loading content:", err);
      });
  }

  // Attach event listeners to links with data-load
  function attachDynamicLoadListeners() {
    document.querySelectorAll("[data-load]").forEach(link => {
      link.removeEventListener("click", handleDynamicLoad);
      link.addEventListener("click", handleDynamicLoad);
    });
  }

  // إعادة تهيئة المكونات بعد تحميل المحتوى ديناميكيًا
  function reinitializePlugins() {
    // إعادة تهيئة Swiper
    document.querySelectorAll('.swiper').forEach(swiperEl => {
      const configElement = swiperEl.querySelector(".swiper-config");
      if (configElement) {
        try {
          const config = JSON.parse(configElement.textContent);
          new Swiper(swiperEl, config);
        } catch (e) {
          console.error("Swiper config error:", e);
        }
      }
    });

    // إعادة تهيئة GLightbox
    initGlightbox();

    // إعادة تعيين الروابط الديناميكية
    attachDynamicLoadListeners();
  }

  // تحميل الصفحة الأساسية داخل #content عند بداية تحميل الصفحة
  window.addEventListener("load", () => {
    fetch("main.html")
      .then(response => response.text())
      .then(html => {
        contentDiv.innerHTML = html;
        reinitializePlugins();
      })
      .catch(error => {
        console.error("Error loading main.html:", error);
      });
  });

  // ربط الـ event listeners للروابط عند DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    attachDynamicLoadListeners();
  });

})();
