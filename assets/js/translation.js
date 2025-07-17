// قم بتحديد مسار ملفات الترجمة
const translations = {
  en: 'assets/translations/en.json',
  ar: 'assets/translations/ar.json'
};

// مسار ملف CSS الخاص باللغة العربية (RTL)
const rtlCssPath = 'assets/css/main-rtl.css';

// دالة تحميل ملف CSS
function loadCssFile(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.id = 'rtl-style'; // أضف ID لسهولة حذفه لاحقاً
  document.head.appendChild(link);
}

// دالة إزالة ملف CSS
function removeCssFile(id) {
  const link = document.getElementById(id);
  if (link) {
    link.remove();
  }
}

// دالة تحميل الترجمات وتطبيقها
async function loadTranslations(lang) {
  try {
    const response = await fetch(translations[lang]);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Translations loaded for ${lang}:`, data); // للتأكد من تحميل الترجمات

    // تطبيق الترجمات على العناصر
    document.querySelectorAll('[data-translate-key]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      // التحقق مما إذا كان العنصر <input> ولديه placeholder
      if (element.tagName === 'INPUT' && element.hasAttribute('placeholder') && data[key]) {
        element.setAttribute('placeholder', data[key]);
      } else if (data[key]) {
        element.textContent = data[key];
      }
    });

    // تحديث السمة 'dir' لجسم الصفحة أو عنصر html
    const htmlElement = document.documentElement; // استهداف عنصر <html>
    if (lang === 'ar') {
      htmlElement.setAttribute('dir', 'rtl');
      loadCssFile(rtlCssPath); // تحميل ملف CSS الخاص بـ RTL
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      removeCssFile('rtl-style'); // إزالة ملف CSS الخاص بـ RTL
    }

    // حفظ اللغة المختارة في Local Storage
    localStorage.setItem('selectedLanguage', lang);

  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// دالة تبديل اللغة (تستخدم عند النقر على زر اللغة)
function setLanguage(lang) {
  loadTranslations(lang);
}

// تحميل اللغة عند تحميل الصفحة (من Local Storage أو الإنجليزية كافتراضي)
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  setLanguage(savedLang); // استدعاء setLanguage بدلاً من loadTranslations مباشرةً
});