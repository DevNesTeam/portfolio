document.addEventListener('DOMContentLoaded', () => {

  const translations = {};
  let currentLang = '';

  // دالة لجلب ملفات الترجمة
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`translations/${lang}.json`);
      if (!response.ok) { // تأكد من أن الطلب كان ناجحاً (مثلاً 200 OK)
        throw new Error(`HTTP error! status: ${response.status} for ${lang}.json`);
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
        element.textContent = translations[lang][key];
      } else {
        // يمكن هنا ترك المحتوى الأصلي أو إظهار رسالة خطأ للمفتاح غير الموجود
        console.warn(`Missing translation for key "${key}" in ${lang}.json`);
      }
    });

    // التعامل مع اتجاه النص (من اليمين لليسار RTL)
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    document.documentElement.setAttribute('lang', lang); // إضافة خاصية lang للـ HTML
  };

  // دالة للتحقق من اللغة عند تحميل الصفحة وتعيين الافتراضي
  async function initializeLanguage() {
    const savedLang = localStorage.getItem('language');
    const langToUse = savedLang || 'en'; // الإنجليزية هي الافتراضية إذا لم يتم حفظ لغة
    await setLanguage(langToUse);
  }

  initializeLanguage();
});