
(function() {
  "use strict";

  // --- Translation Variables & Functions ---
  const translations = {};
  let currentLang = '';

  const TRANSLATIONS_BASE_PATH = './translations/';

  async function loadTranslations(lang) {
    try {
      const response = await fetch(`${TRANSLATIONS_BASE_PATH}${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for ${TRANSLATIONS_BASE_PATH}${lang}.json`);
      }
      translations[lang] = await response.json();
      console.log(`Translations loaded for ${lang}:`, translations[lang]);
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      if (lang !== 'en' && Object.keys(translations).length === 0) {
        console.warn('Falling back to English as default due to translation load failure.');
        setLanguage('en');
      }
    }
  }

  window.setLanguage = async (lang) => {
    localStorage.setItem('language', lang);
    currentLang = lang;

    if (!translations[lang]) {
      await loadTranslations(lang);
    }

    document.querySelectorAll('[data-translate-key]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      if (translations[lang] && translations[lang][key]) {
        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
            element.setAttribute('placeholder', translations[lang][key]);
        } else {
            element.textContent = translations[lang][key];
        }
      } else {
        console.warn(`Missing translation for key "${key}" in ${lang}.json`);
      }
    });

    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');

      let rtlLink = document.getElementById('rtl-style');
      if (!rtlLink) {
        rtlLink = document.createElement('link');
        rtlLink.rel = 'stylesheet';
        rtlLink.href = 'assets/css/main-rtl.css';
        rtlLink.id = 'rtl-style';
        document.head.appendChild(rtlLink);
        console.log('RTL stylesheet added.');
      }
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);

      const rtlLink = document.getElementById('rtl-style');
      if (rtlLink) {
        rtlLink.remove();
        console.log('RTL stylesheet removed.');
      }
    }

    const currentLangDisplay = document.getElementById('current-language-display');
    if (currentLangDisplay) {
        const dropdownKey = currentLangDisplay.getAttribute('data-translate-key');
        if (dropdownKey && translations[lang] && translations[lang][dropdownKey]) {
            currentLangDisplay.querySelector('span').textContent = translations[lang][dropdownKey];
        } else {
            currentLangDisplay.querySelector('span').textContent = (lang === 'ar' ? 'اللغة' : 'Language');
        }
    }
  };

  // --- End Translation Variables & Functions ---


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

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3').forEach((faqItemHeading) => {
    faqItemHeading.addEventListener('click', () => {
      const parentFaqItem = faqItemHeading.closest('.faq-item');
      if (parentFaqItem) {
        parentFaqItem.classList.toggle('faq-active');
      }
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
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  // --- Initialize Language and related components on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('language');
    const langToUse = savedLang || 'en';

    await setLanguage(langToUse);

    aosInit();
    initSwiper();
  });


  /**
 * Init swiper sliders
 */
function initSwiper() {
  // Define the Swiper configuration directly in JavaScript
  const gallerySwiperConfig = {
    "loop": true,
    "speed": 600,
    "autoplay": {
      "delay": 2000,
      "disableOnInteraction": false
    },
    "centeredSlides": true,
    "spaceBetween": 30,
    "slidesPerView": "auto",
    "pagination": {
      "el": ".swiper-pagination",
      "type": "bullets",
      "clickable": true
    },
    "breakpoints": {
      "320": {
        "slidesPerView": 1,
        "spaceBetween": 10
      },
      "768": {
        "slidesPerView": 2,
        "spaceBetween": 20
      },
      "992": {
        "slidesPerView": 3,
        "spaceBetween": 30
      },
      "1200": {
        "slidesPerView": 4,
        "spaceBetween": 30
      }
    }
  };

  // Select the specific Swiper element by its ID or a unique class
  // Assuming '#gallery .init-swiper' uniquely identifies your gallery Swiper
  const gallerySwiperElement = document.querySelector('#gallery .init-swiper');

  if (gallerySwiperElement) {
    // Check if it's a "swiper-tab" or a regular Swiper
    if (gallerySwiperElement.classList.contains("swiper-tab")) {
      // If you have custom pagination for tabs, use that function
      // Make sure initSwiperWithCustomPagination is defined elsewhere in your JS
      initSwiperWithCustomPagination(gallerySwiperElement, gallerySwiperConfig);
    } else {
      // Initialize the Swiper with the defined configuration
      new Swiper(gallerySwiperElement, gallerySwiperConfig);
    }
  }

  // If you have other Swipers, you would add similar blocks for them,
  // each with their own unique selector and config object.
  // Example for another Swiper (if you had one):
  /*
  const anotherSwiperElement = document.querySelector('.another-swiper-class');
  const anotherSwiperConfig = {
      // ... its specific configuration ...
  };
  if (anotherSwiperElement) {
      new Swiper(anotherSwiperElement, anotherSwiperConfig);
  }
  */
}
})();