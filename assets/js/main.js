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
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle'); // هذا السطر بيحاول يلاقي الزر

  function mobileNavToogle() {
    // هذا السطر ببدّل الكلاس "mobile-nav-active" على الـ body لفتح/إغلاق القائمة
    document.querySelector('body').classList.toggle('mobile-nav-active');
    // وهاد بغير أيقونة الزر بين الهامبرغر و X
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  // هذا السطر مهم جداً، بيضيف مستمع حدث (Event Listener) لزر التنقل
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  // ... (باقي أكواد القالب) ...

})();

  
  // --- Translation Variables & Functions (moved to top for better scope) ---
  const translations = {};
  let currentLang = '';

  // المسار الأساسي لملفات الترجمة بالنسبة لملف HTML الرئيسي (index.html)
  // تأكد أن مجلد 'translations' موجود في نفس مستوى ملف HTML الرئيسي
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

  // دالة لتغيير لغة الموقع (متاحة عالمياً)
  window.setLanguage = async (lang) => {
    localStorage.setItem('language', lang);
    currentLang = lang;

    if (!translations[lang]) {
      await loadTranslations(lang);
    }

    // تطبيق الترجمات على جميع العناصر التي تحمل data-translate-key
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

    // التعامل مع اتجاه النص (RTL/LTR) وتحميل/إزالة ملف CSS الخاص بـ RTL
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');

      let rtlLink = document.getElementById('rtl-style');
      if (!rtlLink) { // إذا لم يكن ملف الـ RTL CSS محملاً، قم بتحميله
        rtlLink = document.createElement('link');
        rtlLink.rel = 'stylesheet';
        // المسار هنا يكون نسبةً لملف HTML الرئيسي (index.html)
        rtlLink.href = 'assets/css/main-rtl.css';
        rtlLink.id = 'rtl-style';
        document.head.appendChild(rtlLink);
        console.log('RTL stylesheet added.');
      }
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);

      const rtlLink = document.getElementById('rtl-style');
      if (rtlLink) { // إذا كان ملف الـ RTL CSS محملاً، قم بإزالته
        rtlLink.remove();
        console.log('RTL stylesheet removed.');
      }
    }

    // تحديث النص المعروض لزر اختيار اللغة في القائمة المنسدلة
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
  // Changed from window.addEventListener('load', aosInit);
  // aosInit will be called by initializeLanguage() to ensure it runs after language is set.

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        // Assuming initSwiperWithCustomPagination is defined elsewhere or not used if not present
        // If it's not defined, this line will cause an error.
        // Make sure it's part of your project or remove this conditional.
        // For now, I'll keep it as per your original code.
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  // Changed from window.addEventListener("load", initSwiper);
  // initSwiper will be called by initializeLanguage() to ensure it runs after language is set.

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Frequently Asked Questions Toggle (Re-adjusted to use the correct selector and event)
   */
  document.querySelectorAll('.faq-item h3').forEach((faqItemHeading) => {
    // The original code was attaching to h3 AND .faq-toggle.
    // If h3 itself is clickable and contains the .faq-toggle, this is fine.
    // However, it's safer to attach to the toggle if it's a separate element.
    // Given your original CSS had `cursor: pointer` on both, I'll assume h3 is the main click area.
    faqItemHeading.addEventListener('click', () => {
      // Find the closest parent with class 'faq-item'
      const parentFaqItem = faqItemHeading.closest('.faq-item');
      if (parentFaqItem) {
        parentFaqItem.classList.toggle('faq-active');
      }
    });
  });

  // If .faq-toggle is a separate clickable element and not nested in h3,
  // then you should explicitly add an event listener to it as well:
  // document.querySelectorAll('.faq-item .faq-toggle').forEach((faqToggle) => {
  //   faqToggle.addEventListener('click', () => {
  //     const parentFaqItem = faqToggle.closest('.faq-item');
  //     if (parentFaqItem) {
  //       parentFaqItem.classList.toggle('faq-active');
  //     }
  //   });
  // });


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
    const langToUse = savedLang || 'en'; // الإنجليزية هي الافتراضية إذا لم يتم حفظ لغة

    // Apply initial language settings including RTL CSS
    await setLanguage(langToUse);

    // Now that language is set (and RTL CSS loaded if needed),
    // initialize components that might be affected by language/direction
    aosInit();
    initSwiper();
    // Any other initializations that should happen after language is set
  });

