/**
 * Template Name: SoftLand
 * Template URL: https://bootstrapmade.com/softland-bootstrap-app-landing-page-template/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  const translations = {};
  let currentLang = '';

  const isGithub = location.hostname.includes('github.io');
  const TRANSLATIONS_BASE_PATH = isGithub ?
    '/portfolio/translations/' :
    '../translations/';


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
        window.setLanguage('en');
      }
    }
  }

  // --- معالجة الأحداث عند تحميل DOM ---
  document.addEventListener("DOMContentLoaded", function () {
    // 1. معالجة النقر على زر تبديل القائمة المنسدلة (مثلاً "Language" مع السهم)
    const dropdownToggle = document.querySelector(".navmenu .dropdown > a.toggle-dropdown");

    if (dropdownToggle) {
      dropdownToggle.addEventListener("click", function (e) {
        e.preventDefault(); // منع السلوك الافتراضي للرابط (#)
        const parent = this.parentElement;
        parent.classList.toggle("open"); // تبديل فئة 'open' لفتح/إغلاق القائمة المنسدلة
        e.stopImmediatePropagation(); // الأهم: منع انتشار الحدث لمنع التضارب مع مستمعات أخرى
      });
    }

    // 2. معالجة النقر على عناصر اللغة داخل القائمة المنسدلة
    document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault(); // منع السلوك الافتراضي للرابط (#)
        const lang = this.getAttribute('data-lang'); // الحصول على رمز اللغة من data-lang
        window.setLanguage(lang); // تعيين اللغة عبر الوظيفة العامة

        // إغلاق القائمة المنسدلة (الخاصة باللغة) بعد اختيار اللغة
        const parentDropdown = this.closest('.dropdown');
        if (parentDropdown) {
          parentDropdown.classList.remove('open');
        }

        // إغلاق قائمة التنقل للموبايل إذا كانت مفتوحة (قائمة الهامبرغر)
        if (document.querySelector('body').classList.contains('mobile-nav-active')) {
          mobileNavToogle(); // استدعاء وظيفة إغلاق قائمة الموبايل
        }
      });
    });

    // 3. التهيئة الأولية للغة عند تحميل الصفحة
    const savedLang = localStorage.getItem('language');
    const langToUse = savedLang || 'en';
    window.setLanguage(langToUse).then(() => {
        aosInit(); // تهيئة AOS بعد تحميل اللغة
    });
  });
  // --- نهاية معالجة الأحداث عند تحميل DOM ---


  // --- وظيفة تعيين اللغة ---
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
        rtlLink.href = 'assets/css/main-rtl.css'; // تأكد من المسار الصحيح لملف RTL CSS
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

    // تحديث عرض اللغة الحالية في القائمة المنسدلة (إذا وجدت)
    const currentLangDisplay = document.getElementById('current-language-display');
    if (currentLangDisplay) {
      const dropdownKey = currentLangDisplay.getAttribute('data-translate-key');
      if (dropdownKey && translations[lang] && translations[lang][dropdownKey]) {
        currentLangDisplay.querySelector('span').textContent = translations[lang][dropdownKey];
      } else {
        currentLangDisplay.querySelector('span').textContent = (lang === 'ar' ? 'اللغة' : 'Language');
      }
    }

    // إعادة تهيئة Swiper إذا كان موجودًا ويتأثر باتجاه النص
    initSwiper();
  };
  // --- نهاية وظيفة تعيين اللغة ---


  // --- وظائف عامة أخرى ---

  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  // ** هذا هو التعديل الأساسي لمعالجة قائمة الموبايل: **
  // يستمع للنقرات على روابط التنقل الرئيسية ويغلق قائمة الموبايل،
  // لكنه يستثني عناصر قائمة اللغة المنسدلة لتجنب التضارب.
  document.querySelectorAll('#navmenu a:not(.dropdown-item)').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      // فقط أغلق قائمة الموبايل إذا كانت مفتوحة
      if (document.querySelector('body').classList.contains('mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

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

  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      if (swiperElement.swiper) {
        swiperElement.swiper.destroy(true, true);
      }

      let config = {};
      try {
        const configScript = swiperElement.querySelector(".swiper-config");
        if (configScript) {
          config = JSON.parse(configScript.innerHTML.trim());
        }
      } catch (e) {
        console.error("Error parsing Swiper config:", e);
      }

      config.rtl = document.documentElement.dir === "rtl";

      if (swiperElement.classList.contains("swiper-tab")) {
        if (typeof initSwiperWithCustomPagination === 'function') {
          initSwiperWithCustomPagination(swiperElement, config);
        } else {
          console.warn("initSwiperWithCustomPagination is not defined. Initializing as a regular Swiper.");
          new Swiper(swiperElement, config);
        }
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  window.addEventListener('load', function (e) {
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

  document.querySelectorAll('.view-details-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault(); // تمنع الانتقال الفوري

      // ظهور الـ preloader
      const preloader = document.getElementById('preloader');
      preloader.style.display = 'block';

      // بعد 1 ثانية انتقال للصفحة اللي محددها بـ data-target
      setTimeout(() => {
        window.location.href = this.getAttribute('data-target');
      }, 1000);
    });
  });

})();