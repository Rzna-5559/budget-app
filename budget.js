// PURE FUNCTIONS - Exportable for testing
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

function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return escapeHtml(input.trim());
}

function getValidationMessage(key) {
  if (typeof t === "function") {
    return t(key);
  }
  const fallback = {
    titleEmpty: "Title cannot be empty.",
    titleTooLong: "Title cannot exceed 50 characters.",
    titleUnsafe: "Title cannot contain unsafe characters.",
    amountEmpty: "Amount cannot be empty.",
    amountInvalid: "Amount must be a number.",
    amountZero: "Amount must be greater than 0.",
    amountTooLarge: "Amount is too large."
  };
  return fallback[key] || key;
}

function validateTitle(title) {
  const trimmed = title.trim();

  if (!trimmed) {
    return {
      valid: false,
      message: getValidationMessage("titleEmpty")
    };
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      message: getValidationMessage("titleTooLong")
    };
  }

  if (/[<>]/.test(trimmed)) {
    return {
      valid: false,
      message: getValidationMessage("titleUnsafe")
    };
  }

  return {
    valid: true,
    value: trimmed
  };
}

function validateAmount(amount) {
  const numberValue = Number(amount);

  if (amount === "") {
    return {
      valid: false,
      message: getValidationMessage("amountEmpty")
    };
  }

  if (Number.isNaN(numberValue)) {
    return {
      valid: false,
      message: getValidationMessage("amountInvalid")
    };
  }

  if (numberValue <= 0) {
    return {
      valid: false,
      message: getValidationMessage("amountZero")
    };
  }

  if (numberValue > 1000000) {
    return {
      valid: false,
      message: getValidationMessage("amountTooLarge")
    };
  }

  return {
    valid: true,
    value: numberValue
  };
}

function validateData(entries) {
  return entries.filter(item => 
    item && typeof item === 'object' && 
    ['income', 'expense'].includes(item.type) &&
    typeof item.title === 'string' &&
    typeof item.amount === 'number' && item.amount >= 0
  );
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

function getCurrency() {
  const lang = typeof localStorage !== "undefined" ? (localStorage.getItem("language") || "en") : "en";
  return lang === "zh" ? "¥" : "$";
}

// EXPORT FOR TESTING
if (typeof module !== "undefined" && module.exports) {
  module.exports = { 
    escapeHtml, sanitizeInput, validateTitle, validateAmount, 
    validateData, calculateTotal, calculateBalance, getCurrency 
  };
}

// BROWSER ONLY CODE
if (typeof window !== "undefined") {
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

  // VARIABLES
  let ENTRY_LIST;
  let balance = 0,
    income = 0,
    outcome = 0;
  const DELETE = "delete",
    EDIT = "edit";

  function getBalanceLabel() {
    const lang = localStorage.getItem("language") || "en";
    if (lang === "zh") {
      return income >= outcome ? "" : "-";
    }
    return income >= outcome ? "" : "-";
  }

  // LOOK IF THERE IS DATA IN LOCAL STORAGE
  ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];

  // VALIDATE LOCALSTORAGE DATA TO PREVENT TAMPERING
  ENTRY_LIST = validateData(ENTRY_LIST);

  updateUI();

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
    const titleValidation = validateTitle(expenseTitle.value);
    const amountValidation = validateAmount(expenseAmount.value);

    if (!titleValidation.valid) {
      alert(titleValidation.message);
      return;
    }

    if (!amountValidation.valid) {
      alert(amountValidation.message);
      return;
    }

    let expense = {
      type: "expense",
      title: titleValidation.value,
      amount: amountValidation.value,
    };
    ENTRY_LIST.push(expense);

    updateUI();
    clearInput([expenseTitle, expenseAmount]);
  });

  addIncome.addEventListener("click", function () {
    const titleValidation = validateTitle(incomeTitle.value);
    const amountValidation = validateAmount(incomeAmount.value);

    if (!titleValidation.valid) {
      alert(titleValidation.message);
      return;
    }

    if (!amountValidation.valid) {
      alert(amountValidation.message);
      return;
    }

    let incomeObj = {
      type: "income",
      title: titleValidation.value,
      amount: amountValidation.value,
    };
    ENTRY_LIST.push(incomeObj);

    updateUI();
    clearInput([incomeTitle, incomeAmount]);
  });

  incomeList.addEventListener("click", deleteOrEdit);
  expenseList.addEventListener("click", deleteOrEdit);
  allList.addEventListener("click", deleteOrEdit);

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

  // HELPER FUNCS
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

    const currency = getCurrency();
    const sign = getBalanceLabel();

    balanceEl.innerHTML = `<small>${sign}${currency}</small>${balance}`;
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
    if (typeof updateChart === "function") {
      updateChart(income, outcome);
    }
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
  }

  function showEntry(list, type, title, amount, id) {
    const safeTitle = escapeHtml(title);
    const currency = getCurrency();
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
}
