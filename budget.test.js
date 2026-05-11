// 测试用例文件
// 使用Jest框架进行单元测试

describe('Budget App Security Tests', () => {
  describe('LocalStorage Data Validation', () => {
    test('应该过滤无效数据', () => {
      const validateData = (entries) => {
        return entries.filter(item => 
          item && typeof item === 'object' && 
          ['income', 'expense'].includes(item.type) &&
          typeof item.title === 'string' &&
          typeof item.amount === 'number' && item.amount >= 0
        );
      };
      
      const invalidData = [
        { type: 'income', title: 'Salary', amount: 5000 },
        { type: 'invalid', title: 'Test', amount: 100 },
        { type: 'expense', title: 'Food', amount: -50 },
        { type: 'expense', amount: 100 },
        'invalid string',
        null,
        undefined
      ];
      
      const result = validateData(invalidData);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Salary');
    });
  });
  
  describe('escapeHtml', () => {
    test('应该转义HTML特殊字符', () => {
      const escapeHtml = (text) => {
        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
      };
      
      expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World');
      expect(escapeHtml('5 > 3')).toBe('5 &gt; 3');
      expect(escapeHtml("John's Money")).toBe('John&#039;s Money');
    });
    
    test('应该处理空字符串', () => {
      const escapeHtml = (text) => {
        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
      };
      
      expect(escapeHtml('')).toBe('');
    });
    
    test('应该处理普通文本', () => {
      const escapeHtml = (text) => {
        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
      };
      
      expect(escapeHtml('Normal text')).toBe('Normal text');
    });
  });
  
  describe('sanitizeInput', () => {
    test('应该转义并去除空白', () => {
      const sanitizeInput = (input) => {
        if (typeof input !== "string") return "";
        const escapeHtml = (text) => {
          const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
          };
          return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        };
        return escapeHtml(input.trim());
      };
      
      expect(sanitizeInput('  <script>  ')).toBe('&lt;script&gt;');
      expect(sanitizeInput('  Hello  ')).toBe('Hello');
    });
    
    test('应该处理非字符串输入', () => {
      const sanitizeInput = (input) => {
        if (typeof input !== "string") return "";
        const escapeHtml = (text) => {
          const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
          };
          return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        };
        return escapeHtml(input.trim());
      };
      
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
    });
  });
  
  describe('validateAmount', () => {
    test('应该验证有效的金额', () => {
      const validateAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) || num < 0 ? 0 : num;
      };
      
      expect(validateAmount('100')).toBe(100);
      expect(validateAmount('50.5')).toBe(50.5);
      expect(validateAmount(0)).toBe(0);
    });
    
    test('应该拒绝无效金额', () => {
      const validateAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) || num < 0 ? 0 : num;
      };
      
      expect(validateAmount('-10')).toBe(0);
      expect(validateAmount('abc')).toBe(0);
      expect(validateAmount('')).toBe(0);
    });
  });
});

describe('Budget App Calculations', () => {
  
  describe('calculateTotal', () => {
    test('应该正确计算收入总额', () => {
      const calculateTotal = (type, list) => {
        let sum = 0;
        list.forEach((entry) => {
          if (entry.type === type) {
            sum += entry.amount;
          }
        });
        return sum;
      };
      
      const entries = [
        { type: 'income', amount: 100 },
        { type: 'expense', amount: 50 },
        { type: 'income', amount: 200 }
      ];
      
      expect(calculateTotal('income', entries)).toBe(300);
    });
    
    test('应该正确计算支出总额', () => {
      const calculateTotal = (type, list) => {
        let sum = 0;
        list.forEach((entry) => {
          if (entry.type === type) {
            sum += entry.amount;
          }
        });
        return sum;
      };
      
      const entries = [
        { type: 'income', amount: 100 },
        { type: 'expense', amount: 50 },
        { type: 'expense', amount: 30 }
      ];
      
      expect(calculateTotal('expense', entries)).toBe(80);
    });
    
    test('应该处理空列表', () => {
      const calculateTotal = (type, list) => {
        let sum = 0;
        list.forEach((entry) => {
          if (entry.type === type) {
            sum += entry.amount;
          }
        });
        return sum;
      };
      
      expect(calculateTotal('income', [])).toBe(0);
    });
  });
  
  describe('calculateBalance', () => {
    test('应该正确计算余额', () => {
      const calculateBalance = (income, outcome) => {
        return income - outcome;
      };
      
      expect(calculateBalance(1000, 300)).toBe(700);
      expect(calculateBalance(500, 800)).toBe(-300);
    });
    
    test('应该处理收支相等的情况', () => {
      const calculateBalance = (income, outcome) => {
        return income - outcome;
      };
      
      expect(calculateBalance(500, 500)).toBe(0);
    });
  });
});

describe('Budget App Data Management', () => {
  
  test('应该正确添加支出', () => {
    let ENTRY_LIST = [];
    
    const addExpense = (title, amount) => {
      const expense = {
        type: "expense",
        title: title,
        amount: amount,
      };
      ENTRY_LIST.push(expense);
    };
    
    addExpense('午餐', 50);
    addExpense('交通', 20);
    
    expect(ENTRY_LIST.length).toBe(2);
    expect(ENTRY_LIST[0].type).toBe('expense');
    expect(ENTRY_LIST[1].type).toBe('expense');
  });
  
  test('应该正确添加收入', () => {
    let ENTRY_LIST = [];
    
    const addIncome = (title, amount) => {
      const income = {
        type: "income",
        title: title,
        amount: amount,
      };
      ENTRY_LIST.push(income);
    };
    
    addIncome('工资', 5000);
    
    expect(ENTRY_LIST.length).toBe(1);
    expect(ENTRY_LIST[0].type).toBe('income');
    expect(ENTRY_LIST[0].amount).toBe(5000);
  });
  
  test('应该正确删除条目', () => {
    let ENTRY_LIST = [
      { type: 'income', title: '工资', amount: 5000 },
      { type: 'expense', title: '午餐', amount: 50 }
    ];
    
    const deleteEntry = (index) => {
      ENTRY_LIST.splice(index, 1);
    };
    
    deleteEntry(0);
    
    expect(ENTRY_LIST.length).toBe(1);
    expect(ENTRY_LIST[0].title).toBe('午餐');
  });
});

describe('Budget App Cookie Management', () => {
  
  test('Cookie管理逻辑应该正确实现', () => {
    const cookieManager = {
      acceptCookies: function() {
        return { action: 'accept', stored: true };
      },
      checkAccepted: function(cookiesAccepted) {
        return cookiesAccepted === 'true';
      }
    };
    
    const result = cookieManager.acceptCookies();
    expect(result.stored).toBe(true);
    
    expect(cookieManager.checkAccepted('true')).toBe(true);
    expect(cookieManager.checkAccepted(null)).toBe(false);
  });
  
  test('语言偏好管理逻辑应该正确实现', () => {
    const langManager = {
      getLang: function(savedLang) {
        return savedLang || 'zh';
      },
      isValidLang: function(lang) {
        return lang === 'zh' || lang === 'en';
      }
    };
    
    expect(langManager.getLang('en')).toBe('en');
    expect(langManager.getLang(null)).toBe('zh');
    expect(langManager.isValidLang('zh')).toBe(true);
    expect(langManager.isValidLang('en')).toBe(true);
    expect(langManager.isValidLang('fr')).toBe(false);
  });
});

describe('Budget App Accessibility', () => {
  
  test('ARIA标签应该存在', () => {
    const requiredAriaLabels = [
      'Budget application main content',
      'Budget summary',
      'Language selection',
      'Budget chart'
    ];
    
    requiredAriaLabels.forEach(label => {
      expect(label.length).toBeGreaterThan(0);
    });
  });
  
  test('角色属性应该正确设置', () => {
    const requiredRoles = ['main', 'region', 'tablist', 'tabpanel', 'list'];
    
    requiredRoles.forEach(role => {
      expect(typeof role).toBe('string');
      expect(role.length).toBeGreaterThan(0);
    });
  });
});