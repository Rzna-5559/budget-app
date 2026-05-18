// Internationalization (i18n) Module
const translations = {
  en: {
    balance: "Balance",
    income: "Income",
    expense: "Expense",
    dashboard: "Dashboard",
    expenses: "Expenses",
    all: "All",
    title: "title",
    amount: "$0",
    privacyPolicy: "Privacy Policy",
    cookieMessage: "We use cookies to improve your experience.",
    accept: "Accept",
    edit: "Edit",
    delete: "Delete",
    appTitle: "BudgetApp"
  },
  zh: {
    balance: "余额",
    income: "收入",
    expense: "支出",
    dashboard: "仪表盘",
    expenses: "支出",
    all: "全部",
    title: "标题",
    amount: "¥0",
    privacyPolicy: "隐私政策",
    cookieMessage: "我们使用cookies来改善您的体验。",
    accept: "接受",
    edit: "编辑",
    delete: "删除",
    appTitle: "预算应用"
  }
};

let currentLanguage = localStorage.getItem("language") || "en";

function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem("language", lang);
    updatePageTranslations();
    updateLanguageToggleButton();
    if (typeof onLanguageChange === "function") {
      onLanguageChange(lang);
    }
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }));
  }
}

function t(key) {
  return translations[currentLanguage][key] || translations["en"][key] || key;
}

function updatePageTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (element.tagName === "INPUT") {
      element.placeholder = t(key);
    } else if (element.tagName === "TITLE") {
      element.textContent = t(key);
    } else {
      element.textContent = t(key);
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach(element => {
    const key = element.getAttribute("data-i18n-aria");
    element.setAttribute("aria-label", t(key));
  });

  const balanceTitle = document.querySelector(".balance .title");
  if (balanceTitle) balanceTitle.textContent = t("balance");

  const incomeTitle = document.querySelector(".income .title");
  if (incomeTitle) incomeTitle.textContent = t("income");

  const expenseTitle = document.querySelector(".outcome .title");
  if (expenseTitle) expenseTitle.textContent = t("expense");

  const dashTitle = document.querySelector(".dash-title");
  if (dashTitle) dashTitle.textContent = t("dashboard");

  const cookieText = document.querySelector(".cookie-text");
  if (cookieText) cookieText.textContent = t("cookieMessage");

  const cookieAccept = document.querySelector(".cookie-accept");
  if (cookieAccept) cookieAccept.textContent = t("accept");

  document.title = t("appTitle");
}

function createLanguageToggle() {
  const existingToggle = document.querySelector(".language-toggle");
  if (existingToggle) {
    return existingToggle;
  }

  const toggle = document.createElement("button");
  toggle.className = "language-toggle";
  toggle.setAttribute("aria-label", "Toggle language");
  toggle.setAttribute("title", "切换语言 / Switch language");
  
  updateLanguageToggleButtonStyle(toggle);
  
  toggle.addEventListener("click", function() {
    const newLang = currentLanguage === "en" ? "zh" : "en";
    setLanguage(newLang);
  });

  return toggle;
}

function updateLanguageToggleButton() {
  const toggle = document.querySelector(".language-toggle");
  if (toggle) {
    updateLanguageToggleButtonStyle(toggle);
  }
}

function updateLanguageToggleButtonStyle(toggle) {
  toggle.textContent = currentLanguage === "en" ? "中文" : "EN";
  toggle.setAttribute("aria-label", currentLanguage === "en" ? "Switch to Chinese" : "切换到英文");
}

function initI18n() {
  const toggle = createLanguageToggle();
  const appTitle = document.querySelector(".app-title");
  if (appTitle) {
    appTitle.parentNode.insertBefore(toggle, appTitle.nextSibling);
  }
  updatePageTranslations();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { translations, setLanguage, t, initI18n, currentLanguage };
}
