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