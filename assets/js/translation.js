(function() {
  "use strict";

  const translations = {};
  let currentLang = '';

  // Path to translation files, relative to the HTML files using it.
  // Assuming HTML files are in 'app-details/' and 'translations' is in the project root.
const isGithub = location.hostname.includes('github.io');
const TRANSLATIONS_BASE_PATH = isGithub 
  ? '/portfolio/translations/' 
  : '../translations/';

  // Function to load translation JSON files
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
      // Fallback to English if translation fails, especially on first load
      if (lang !== 'en' && Object.keys(translations).length === 0) {
        console.warn('Falling back to English as default due to translation load failure.');
        window.setLanguage('en'); // Try setting to English
      }
    }
  }

  // Main function to change language and apply translations/RTL/LTR formatting
  // This function is made global so it can be called from dropdowns/buttons
  window.setLanguage = async (lang) => {
    // 1. Save the selected language to localStorage
    localStorage.setItem('language', lang); 
    currentLang = lang;

    // 2. Load translations if not already loaded
    if (!translations[lang]) {
      await loadTranslations(lang);
    }

    // 3. Apply translations to elements with data-translate-key
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

    // 4. Handle RTL/LTR direction
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
      let rtlLink = document.getElementById('rtl-style');
      if (!rtlLink) {
        rtlLink = document.createElement('link');
        rtlLink.rel = 'stylesheet';
        rtlLink.href = '../assets/css/main-rtl.css'; // Adjust path if necessary
        rtlLink.id = 'rtl-style';
        document.head.appendChild(rtlLink);
      }
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
      const rtlLink = document.getElementById('rtl-style');
      if (rtlLink) {
        rtlLink.remove();
      }
    }

    // 5. Update language display (if any dropdown/button shows current lang)
    const currentLangDisplay = document.getElementById('current-language-display');
    if (currentLangDisplay) {
      const dropdownKey = currentLangDisplay.getAttribute('data-translate-key');
      if (dropdownKey && translations[lang] && translations[lang][dropdownKey]) {
        currentLangDisplay.querySelector('span').textContent = translations[lang][dropdownKey];
      } else {
        currentLangDisplay.querySelector('span').textContent = (lang === 'ar' ? 'اللغة' : 'Language');
      }
    }

    // 6. Re-initialize Swiper after language and direction change
    // This is crucial if Swiper's layout depends on RTL/LTR
    initSwiper();
  };

  // Swiper initialization function (made global so setLanguage can call it)
  window.initSwiper = function() { // Changed to global
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      // Destroy existing Swiper instance before creating a new one
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

      // Set RTL direction based on current document direction
      config.rtl = document.documentElement.dir === "rtl";

      // Initialize Swiper
      new Swiper(swiperElement, config);
    });
  };

  // GLightbox initialization (also ensure it's re-initialized if needed, or done once)
  // Making it global so setLanguage can potentially re-call it if GLightbox elements change dynamically
  window.initGLightbox = function() {
    GLightbox({
      selector: '.glightbox'
    });
  };

  // Initialize language and components when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get saved language from localStorage
    const savedLang = localStorage.getItem('language');
    // 2. Use saved language, or default to 'en' if not found
    const langToUse = savedLang || 'en'; 

    // 3. Apply initial language settings and load translations
    await window.setLanguage(langToUse);

    // 4. Initialize GLightbox here once, as its elements are typically static after load
    window.initGLightbox(); 
  });
document.querySelectorAll('.swiper-slide img').forEach(img => {
  img.addEventListener('load', () => {
    img.classList.add('loaded');
    // السبينر هو العنصر الشقيق للـ <a> اللي يحتوي الصورة،
    // لذلك نطلع للوالد (swiper-slide) ونبحث عن السبينر داخله
    const spinner = img.closest('.swiper-slide').querySelector('.spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  });
});

})();