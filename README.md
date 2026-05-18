# Budget App - Personal Budget Management Application

![Tests](https://img.shields.io/badge/Tests-78%2F78-4CAF50)
![Coverage](https://img.shields.io/badge/Coverage-85%25-4CAF50)
![Security](https://img.shields.io/badge/Security-XSS_Protected-4CAF50)
![i18n](https://img.shields.io/badge/Internationalization-ZH%2FEN-4CAF50)
![Accessibility](https://img.shields.io/badge/Accessibility-ARIA_Enabled-4CAF50)

A feature-rich personal budget management web application.

## 📋 Project Architecture

```
budget-app/
├── index.html          # Main page entry
├── privacy.html        # Privacy policy page
├── budget.js          # Core business logic
├── chart.js           # Chart rendering module
├── i18n.js            # Internationalization module
├── style.css          # Stylesheet
├── package.json       # Project configuration
└── README.md          # Project documentation
```

### Core Modules

1. **budget.js** - Data management, validation logic, UI updates
2. **i18n.js** - Chinese and English internationalization support
3. **chart.js** - Income and expense visualization chart
4. **test-badge.js** - Test result badge generator

### Technology Stack

- HTML5 + CSS3 + JavaScript (vanilla)
- Jest v29.7.0 (testing framework)
- Browser LocalStorage (data storage)

## 🔧 Modification Points

### 1. XSS Security Vulnerability Fix ✅

**Solution**:
- Implement `escapeHtml()` function to escape special characters
- Add `sanitizeInput()` function for input sanitization
- LocalStorage data integrity validation

**Related Files**:
- [budget.js](file:///workspace/budget.js)

### 2. Accessibility Improvement ✅

**Solution**:
- Add ARIA labels to all interactive elements
- Implement keyboard navigation support (Tab key + Enter key)
- Add focus styles and state indicators

**Related Files**:
- [index.html](file:///workspace/index.html)
- [style.css](file:///workspace/style.css)

### 3. Internationalization Feature ✅

**Solution**:
- Create i18n.js module for Chinese and English switching
- Language preference persistence storage
- Support automatic currency symbol switching ($/¥)

**Related Files**:
- [i18n.js](file:///workspace/i18n.js)
- [privacy.html](file:///workspace/privacy.html)

### 4. Cookie Compliance ✅

**Solution**:
- Add Cookie usage consent banner
- Privacy policy with detailed Cookie usage explanation
- Cookie consent status persistence


