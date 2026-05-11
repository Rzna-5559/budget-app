// SELECT ELEMENTS
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BUTTONS
const expenseBtn = document.querySelector(".first-tab");
const incomeBtn = document.querySelector(".second-tab");
const allBtn = document.querySelector(".third-tab");

// INPUT BTS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

// LANGUAGE SWITCH
const langSelect = document.getElementById("lang-select");

// VARIABLES
let ENTRY_LIST;
let balance = 0,
  income = 0,
  outcome = 0;
const DELETE = "delete",
  EDIT = "edit";

// INTERNATIONALIZATION
const translations = {
  en: {
    balance: "Balance",
    income: "Income",
    outcome: "Expense",
    dashboard: "Dashboard",
    expenses: "Expenses",
    all: "All",
    title: "title",
    amount: "$0",
    cookieMessage: "We use cookies to improve your experience.",
    accept: "Accept",
    privacy: "Privacy Policy"
  },
  zh: {
    balance: "余额",
    income: "收入",
    outcome: "支出",
    dashboard: "仪表盘",
    expenses: "支出",
    all: "全部",
    title: "标题",
    amount: "¥0",
    cookieMessage: "我们使用Cookie来改善您的体验。",
    accept: "同意",
    privacy: "隐私政策"
  }
};

let currentLang = localStorage.getItem("lang") || "zh";

// ESCAPE HTML TO PREVENT XSS ATTACKS
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// VALIDATE AND SANITIZE INPUT
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return escapeHtml(input.trim());
}

// VALIDATE AMOUNT
function validateAmount(amount) {
  const num = parseFloat(amount);
  return isNaN(num) || num < 0 ? 0 : num;
}

// LOOK IF THERE IS DATA IN LOCAL STORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();
applyTranslations();

// EVENT LISTENERS
expenseBtn.addEventListener("click", function () {
  show(expenseEl);
  hide([incomeEl, allEl]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});

incomeBtn.addEventListener("click", function () {
  show(incomeEl);
  hide([expenseEl, allEl]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});

allBtn.addEventListener("click", function () {
  show(allEl);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
});

addExpense.addEventListener("click", function () {
  if (!expenseTitle.value || !expenseAmount.value) return;

  let expense = {
    type: "expense",
    title: sanitizeInput(expenseTitle.value),
    amount: validateAmount(expenseAmount.value),
  };
  ENTRY_LIST.push(expense);

  updateUI();
  clearInput([expenseTitle, expenseAmount]);
});

addIncome.addEventListener("click", function () {
  if (!incomeTitle.value || !incomeAmount.value) return;

  let incomeObj = {
    type: "income",
    title: sanitizeInput(incomeTitle.value),
    amount: validateAmount(incomeAmount.value),
  };
  ENTRY_LIST.push(incomeObj);

  updateUI();
  clearInput([incomeTitle, incomeAmount]);
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// LANGUAGE SWITCH
langSelect.addEventListener("change", function() {
  currentLang = this.value;
  localStorage.setItem("lang", currentLang);
  applyTranslations();
  updateUI();
});

// KEYBOARD NAVIGATION
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && document.activeElement.classList.contains("add-expense")) {
    addExpense.click();
  }
  if (e.key === "Enter" && document.activeElement.classList.contains("add-income")) {
    addIncome.click();
  }
});

// COOKIE BANNER
function showCookieBanner() {
  if (!localStorage.getItem("cookiesAccepted")) {
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.style.display = "flex";
    }
  }
}

function acceptCookies() {
  localStorage.setItem("cookiesAccepted", "true");
  const banner = document.getElementById("cookie-banner");
  if (banner) {
    banner.style.display = "none";
  }
}

window.acceptCookies = acceptCookies;
showCookieBanner();

// HELEPER FUNCS
function deleteOrEdit(event) {
  const targetBtn = event.target;
  const entry = targetBtn.parentNode;

  if (targetBtn.id === EDIT) {
    editEntry(entry);
  } else if (targetBtn.id === DELETE) {
    deleteEntry(entry);
  }
}

function deleteEntry(entry) {
  ENTRY_LIST.splice(entry.id, 1);
  updateUI();
}

function editEntry(entry) {
  const ENTRY = ENTRY_LIST[entry.id];

  if (ENTRY.type === "income") {
    incomeTitle.value = ENTRY.title;
    incomeAmount.value = ENTRY.amount;
  } else if (ENTRY.type === "expense") {
    expenseTitle.value = ENTRY.title;
    expenseAmount.value = ENTRY.amount;
  }
  deleteEntry(entry);
}

function updateUI() {
  income = calculateTotal("income", ENTRY_LIST);
  outcome = calculateTotal("expense", ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));

  let currency = currentLang === "zh" ? "¥" : "$";
  let sign = income >= outcome ? currency : "-" + currency;

  balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
  outcomeTotalEl.innerHTML = `<small>${currency}</small>${outcome}`;
  incomeTotalEl.innerHTML = `<small>${currency}</small>${income}`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry, index) => {
    if (entry.type === "expense") {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index);
    } else if (entry.type === "income") {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index);
    }
    showEntry(allList, entry.type, entry.title, entry.amount, index);
  });
  updateChart(income, outcome);
  localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {
  const safeTitle = escapeHtml(title);
  const currency = currentLang === "zh" ? "¥" : "$";
  const entry = `<li id="${id}" class="${type}" role="listitem" aria-label="${safeTitle} ${currency}${amount}">
                    <div class="entry">${safeTitle} : ${currency}${amount}</div>
                    <button id="edit" class="edit-btn" aria-label="Edit entry" role="button" tabindex="0"></button>
                    <button id="delete" class="delete-btn" aria-label="Delete entry" role="button" tabindex="0"></button>
                  </li>`;
  const position = "afterbegin";
  list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
  elements.forEach((element) => {
    element.innerHTML = "";
  });
}

function calculateTotal(type, list) {
  let sum = 0;
  list.forEach((entry) => {
    if (entry.type === type) {
      sum += entry.amount;
    }
  });
  return sum;
}

function calculateBalance(income, outcome) {
  return income - outcome;
}

function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function show(element) {
  element.classList.remove("hide");
}

function hide(elements) {
  elements.forEach((element) => {
    element.classList.add("hide");
  });
}

function active(element) {
  element.classList.add("focus");
}

function inactive(elements) {
  elements.forEach((element) => {
    element.classList.remove("focus");
  });
}

function applyTranslations() {
  const t = translations[currentLang];
  document.querySelector(".balance .title").textContent = t.balance;
  document.querySelector(".income .title").textContent = t.income;
  document.querySelector(".outcome .title").textContent = t.outcome;
  document.querySelector(".dash-title").textContent = t.dashboard;
  document.querySelector(".first-tab").textContent = t.expenses;
  document.querySelector(".third-tab").textContent = t.all;
  document.querySelector("#expense-title-input").placeholder = t.title;
  document.querySelector("#income-title-input").placeholder = t.title;
  
  const cookieMsg = document.querySelector(".cookie-text");
  if (cookieMsg) cookieMsg.textContent = t.cookieMessage;
  
  langSelect.value = currentLang;
}

// EXPORT FOR TESTING
if (typeof module !== "undefined" && module.exports) {
  module.exports = { escapeHtml, sanitizeInput, validateAmount, calculateTotal, calculateBalance };
}