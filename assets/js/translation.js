document.addEventListener('DOMContentLoaded', () => {

  const translations = {};
  let currentLang = '';

  // تحديد المسار الأساسي لملفات الترجمة بالنسبة لجذر المشروع
  // بما أن ملفات الترجمة موجودة في جذر المشروع، سنحتاج للخروج من مجلدين للوصول إليها
  const TRANSLATIONS_BASE_PATH = '../../translations/'; // <--- هذا هو التغيير الصحيح الآن

  // دالة لجلب ملفات الترجمة
  async function loadTranslations(lang) {
    try {
      // استخدام المسار المطلق لجلب الترجمات
      const response = await fetch(`${TRANSLATIONS_BASE_PATH}${lang}.json`); // <--- المسار المعدّل
      if (!response.ok) { // تأكد من أن الطلب كان ناجحاً (مثلاً 200 OK)
        throw new Error(`HTTP error! status: ${response.status} for ${TRANSLATIONS_BASE_PATH}${lang}.json`);
      }
      translations[lang] = await response.json();
      console.log(`Translations loaded for ${lang}:`, translations[lang]); // للتأكد من التحميل
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      // في حال فشل تحميل ملف الترجمة، يمكننا إعادة تعيين للغة الافتراضية
      if (lang !== 'en' && Object.keys(translations).length === 0) {
        console.warn('Falling back to English as default due to translation load failure.');
        setLanguage('en'); // نعود للإنجليزية كافتراضي إذا كانت هذه أول لغة يتم تحميلها وفشلت
      }
    }
  }

  // دالة لتغيير لغة الموقع
  window.setLanguage = async (lang) => {
    localStorage.setItem('language', lang);
    currentLang = lang;

    if (!translations[lang]) {
      await loadTranslations(lang);
    }

    // تطبيق الترجمات
    document.querySelectorAll('[data-translate-key]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      // تأكد أن ملف الترجمة للغة الحالية قد تم تحميله وأن المفتاح موجود فيه
      if (translations[lang] && translations[lang][key]) {
        // إذا كان العنصر <input> ولديه placeholder، قم بتعيين قيمة الـ placeholder
        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
            element.setAttribute('placeholder', translations[lang][key]);
        } else {
            element.textContent = translations[lang][key];
        }
      } else {
        // يمكن هنا ترك المحتوى الأصلي أو إظهار رسالة خطأ للمفتاح غير الموجود
        console.warn(`Missing translation for key "${key}" in ${lang}.json`);
      }
    });

    // التعامل مع اتجاه النص (من اليمين لليسار RTL) وتحميل/إزالة ملف CSS الخاص بـ RTL
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      const rtlLink = document.getElementById('rtl-style');
      if (!rtlLink) { // إذا لم يكن ملف الـ RTL CSS محملاً، اقم بتحميله
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../assets/css/main-rtl.css'; // هذا المسار صحيح لأنه يخرج من js/ إلى assets/ ثم يدخل css/
        link.id = 'rtl-style';
        document.head.appendChild(link);
      }
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      const rtlLink = document.getElementById('rtl-style');
      if (rtlLink) { // إذا كان ملف الـ RTL CSS محملاً، اقم بإزالته
        rtlLink.remove();
      }
    }
    document.documentElement.setAttribute('lang', lang); // إضافة خاصية lang لعنصر <html>

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

  // دالة للتحقق من اللغة عند تحميل الصفحة وتعيين الافتراضي
  async function initializeLanguage() {
    const savedLang = localStorage.getItem('language');
    const langToUse = savedLang || 'en'; // الإنجليزية هي الافتراضية إذا لم يتم حفظ لغة
    await setLanguage(langToUse);
  }

  initializeLanguage();
});





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
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

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
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

// --- كود الترجمة الذي يجب أن يكون في ملف translation.js ---

document.addEventListener('DOMContentLoaded', () => {

  const translations = {};
  let currentLang = '';

  // المسار الأساسي لملفات الترجمة بالنسبة لملف HTML الرئيسي
  // إذا كانت ملفات الترجمة (.json) موجودة في نفس مستوى ملف HTML
  // يمكنك استخدام './translations/' أو 'translations/' إذا كانت في مجلد اسمه translations
  // إذا كانت translation.js في assets/js/ والترجمات في مجلد 'translations' بجذر المشروع،
  // فالمسار الصحيح هو:
  const TRANSLATIONS_BASE_PATH = './translations/'; 

  // دالة لجلب ملفات الترجمة
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

  // دالة لتغيير لغة الموقع
  window.setLanguage = async (lang) => {
    localStorage.setItem('language', lang);
    currentLang = lang;

    if (!translations[lang]) {
      await loadTranslations(lang);
    }

    // تطبيق الترجمات
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

    // التعامل مع اتجاه النص (من اليمين لليسار RTL) وتحميل/إزالة ملف CSS الخاص بـ RTL
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar'); // تحديث lang attribute للعربية

      let rtlLink = document.getElementById('rtl-style');
      if (!rtlLink) { // إذا لم يكن ملف الـ RTL CSS محملاً، اقم بتحميله
        rtlLink = document.createElement('link');
        rtlLink.rel = 'stylesheet';
        // المسار هنا يعتمد على موقع ملف الـ HTML الرئيسي.
        // إذا كان ملف HTML في جذر المشروع، والـ main-rtl.css في assets/css/
        // فالمسار الصحيح هو 'assets/css/main-rtl.css'
        rtlLink.href = 'assets/css/main-rtl.css'; 
        rtlLink.id = 'rtl-style';
        document.head.appendChild(rtlLink);
        console.log('RTL stylesheet added.');
      }
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang); // تحديث lang attribute للغة الأخرى

      const rtlLink = document.getElementById('rtl-style');
      if (rtlLink) { // إذا كان ملف الـ RTL CSS محملاً، اقم بإزالته
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

  // دالة للتحقق من اللغة عند تحميل الصفحة وتعيين الافتراضي
  async function initializeLanguage() {
    const savedLang = localStorage.getItem('language');
    const langToUse = savedLang || 'en'; // الإنجليزية هي الافتراضية إذا لم يتم حفظ لغة
    await setLanguage(langToUse);
    // شغّل الـ AOS بعد تحميل اللغة الأولية
    aosInit();
    // شغّل الـ Swiper بعد تحميل اللغة الأولية
    initSwiper();
  }

  initializeLanguage();
});