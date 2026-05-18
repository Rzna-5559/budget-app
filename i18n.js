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
    appTitle: "BudgetApp",
    titleEmpty: "Title cannot be empty.",
    titleTooLong: "Title cannot exceed 50 characters.",
    titleUnsafe: "Title cannot contain unsafe characters.",
    amountEmpty: "Amount cannot be empty.",
    amountInvalid: "Amount must be a number.",
    amountZero: "Amount must be greater than 0.",
    amountTooLarge: "Amount is too large.",
    backToApp: "← Back to App",
    privacyTitle: "Privacy Policy",
    lastUpdated: "Last Updated: January 1, 2024",
    infoCollection: "Information Collection and Use",
    infoCollectionText: "We take your privacy seriously. The information collected by this app is only used to improve user experience and provide local data storage services.",
    localStorage: "Local Storage",
    localStorageText: "We use the browser's LocalStorage to store your budget data. This data is stored only on your local device, and we cannot access or retrieve this information.",
    cookieUsage: "Cookie Usage",
    cookieUsageText: "We use cookies to remember your language preference settings. You can choose to accept or reject cookies during your first visit.",
    dataSecurity: "Data Security",
    dataSecurityText: "Your budget data is stored only in the browser locally and will not be transmitted to any server. Deleting browser data will clear all stored information.",
    thirdParty: "Third-Party Services",
    thirdPartyText: "This app does not use any third-party analytics or tracking services.",
    childrenPrivacy: "Children's Privacy",
    childrenPrivacyText: "This app is not intended for children under 13, and we do not knowingly collect personal information from children.",
    policyChanges: "Changes to This Privacy Policy",
    policyChangesText: "We may update this privacy policy from time to time. Any changes will be posted on this page. We recommend that you check periodically to stay informed about the latest information.",
    contactUs: "Contact Us",
    contactUsText: "If you have any questions about this privacy policy, please contact us through the following methods."
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
    appTitle: "预算应用",
    titleEmpty: "标题不能为空。",
    titleTooLong: "标题不能超过50个字符。",
    titleUnsafe: "标题不能包含危险字符。",
    amountEmpty: "金额不能为空。",
    amountInvalid: "金额必须是数字。",
    amountZero: "金额必须大于0。",
    amountTooLarge: "金额过大。",
    backToApp: "← 返回应用",
    privacyTitle: "隐私政策",
    lastUpdated: "最后更新日期：2024年1月1日",
    infoCollection: "信息收集与使用",
    infoCollectionText: "我们高度重视您的隐私保护。本应用收集的信息仅用于改善用户体验和提供本地数据存储服务。",
    localStorage: "本地存储",
    localStorageText: "我们使用浏览器的LocalStorage来存储您的预算数据。这些数据仅存储在您的本地设备上，我们无法访问或获取这些信息。",
    cookieUsage: "Cookie使用",
    cookieUsageText: "我们使用Cookie来记住您的语言偏好设置。您可以在首次访问时选择接受或拒绝Cookie。",
    dataSecurity: "数据安全",
    dataSecurityText: "您的预算数据仅存储在浏览器本地，不会被传输到任何服务器。删除浏览器数据将清除所有存储的信息。",
    thirdParty: "第三方服务",
    thirdPartyText: "本应用不使用任何第三方分析或追踪服务。",
    childrenPrivacy: "儿童隐私",
    childrenPrivacyText: "本应用不面向13岁以下的儿童，我们不会故意收集儿童的个人信息。",
    policyChanges: "隐私政策更新",
    policyChangesText: "我们可能会不时更新本隐私政策。所有更改将在本页面发布。建议您定期查看以了解最新信息。",
    contactUs: "联系我们",
    contactUsText: "如果您对本隐私政策有任何疑问，请通过以下方式联系我们。"
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
