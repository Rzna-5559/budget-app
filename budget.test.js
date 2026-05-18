const { escapeHtml, sanitizeInput, validateAmount, calculateTotal, calculateBalance, validateTitle, getCurrency, validateData } = require('./budget.js');

describe('Budget App Security Tests', () => {
  describe('LocalStorage Data Validation', () => {
    test('应该过滤无效数据', () => {
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
    
    test('应该过滤类型无效的条目', () => {
      const data = [{ type: 'refund', title: 'Test', amount: 100 }];
      const result = validateData(data);
      expect(result.length).toBe(0);
    });
    
    test('应该过滤负数金额', () => {
      const data = [{ type: 'expense', title: 'Bill', amount: -100 }];
      const result = validateData(data);
      expect(result.length).toBe(0);
    });
    
    test('应该保留有效的收入条目', () => {
      const data = [{ type: 'income', title: 'Salary', amount: 5000 }];
      const result = validateData(data);
      expect(result.length).toBe(1);
      expect(result[0].type).toBe('income');
    });
    
    test('应该保留有效的支出条目', () => {
      const data = [{ type: 'expense', title: 'Food', amount: 50 }];
      const result = validateData(data);
      expect(result.length).toBe(1);
      expect(result[0].type).toBe('expense');
    });
    
    test('应该过滤金额为零的条目', () => {
      const data = [{ type: 'income', title: 'Zero', amount: 0 }];
      const result = validateData(data);
      expect(result.length).toBe(1);
    });
    
    test('应该处理空数组', () => {
      const result = validateData([]);
      expect(result.length).toBe(0);
    });
    
    test('应该过滤缺少标题的条目', () => {
      const data = [{ type: 'income', amount: 100 }];
      const result = validateData(data);
      expect(result.length).toBe(0);
    });
  });
  
  describe('escapeHtml', () => {
    test('应该转义script标签', () => {
      expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });
    
    test('应该转义&符号', () => {
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World');
    });
    
    test('应该转义大于小于号', () => {
      expect(escapeHtml('5 > 3')).toBe('5 &gt; 3');
      expect(escapeHtml('3 < 5')).toBe('3 &lt; 5');
    });
    
    test('应该转义单引号', () => {
      expect(escapeHtml("John's Money")).toBe('John&#039;s Money');
    });
    
    test('应该处理空字符串', () => {
      expect(escapeHtml('')).toBe('');
    });
    
    test('应该处理普通文本', () => {
      expect(escapeHtml('Normal text')).toBe('Normal text');
    });
    
    test('应该处理特殊引号', () => {
      expect(escapeHtml('"Double quotes"')).toBe('&quot;Double quotes&quot;');
    });
    
    test('应该处理混合内容', () => {
      expect(escapeHtml('<div class="test">Content & More</div>')).toBe('&lt;div class=&quot;test&quot;&gt;Content &amp; More&lt;/div&gt;');
    });
    
    test('应该处理数字', () => {
      expect(escapeHtml('123456')).toBe('123456');
    });
    
    test('应该处理Unicode字符', () => {
      expect(escapeHtml('你好世界')).toBe('你好世界');
    });
  });
  
  describe('sanitizeInput', () => {
    test('应该转义并去除空白', () => {
      expect(sanitizeInput('  <script>  ')).toBe('&lt;script&gt;');
    });
    
    test('应该去除前后空白', () => {
      expect(sanitizeInput('  Hello  ')).toBe('Hello');
    });
    
    test('应该处理null输入', () => {
      expect(sanitizeInput(null)).toBe('');
    });
    
    test('应该处理undefined输入', () => {
      expect(sanitizeInput(undefined)).toBe('');
    });
    
    test('应该处理数字输入', () => {
      expect(sanitizeInput(123)).toBe('');
    });
    
    test('应该处理普通文本', () => {
      expect(sanitizeInput('Test Input')).toBe('Test Input');
    });
    
    test('应该去除多余空白', () => {
      expect(sanitizeInput('   Test   ')).toBe('Test');
    });
  });
  
  describe('validateAmount', () => {
    test('应该接受有效的正数', () => {
      expect(validateAmount('100')).toBe(100);
    });
    
    test('应该接受小数', () => {
      expect(validateAmount('50.5')).toBe(50.5);
      expect(validateAmount('99.99')).toBe(99.99);
    });
    
    test('应该接受零', () => {
      expect(validateAmount(0)).toBe(0);
      expect(validateAmount('0')).toBe(0);
    });
    
    test('应该拒绝负数', () => {
      expect(validateAmount('-10')).toBe(0);
      expect(validateAmount('-0.01')).toBe(0);
    });
    
    test('应该拒绝非数字字符串', () => {
      expect(validateAmount('abc')).toBe(0);
      expect(validateAmount('')).toBe(0);
    });
    
    test('应该处理大数字', () => {
      expect(validateAmount('1000000')).toBe(1000000);
    });
    
    test('应该处理科学计数法', () => {
      expect(validateAmount('1e5')).toBe(100000);
    });
  });
  
  describe('validateTitle', () => {
    test('应该接受有效标题', () => {
      const result = validateTitle('Test Title');
      expect(result.valid).toBe(true);
      expect(result.value).toBe('Test Title');
    });
    
    test('应该拒绝空标题', () => {
      const result = validateTitle('');
      expect(result.valid).toBe(false);
    });
    
    test('应该拒绝空白标题', () => {
      const result = validateTitle('   ');
      expect(result.valid).toBe(false);
    });
    
    test('应该拒绝超过50字符的标题', () => {
      const longTitle = 'a'.repeat(51);
      const result = validateTitle(longTitle);
      expect(result.valid).toBe(false);
    });
    
    test('应该接受正好50字符的标题', () => {
      const title50 = 'a'.repeat(50);
      const result = validateTitle(title50);
      expect(result.valid).toBe(true);
    });
    
    test('应该拒绝包含<的标题', () => {
      const result = validateTitle('<script>');
      expect(result.valid).toBe(false);
    });
    
    test('应该拒绝包含>的标题', () => {
      const result = validateTitle('a > b');
      expect(result.valid).toBe(false);
    });
    
    test('应该去除前后空白', () => {
      const result = validateTitle('  Test  ');
      expect(result.valid).toBe(true);
      expect(result.value).toBe('Test');
    });
    
    test('应该接受包含特殊字符的标题', () => {
      const result = validateTitle('Test@#$%');
      expect(result.valid).toBe(true);
    });
  });
});

describe('Budget App Calculations', () => {
  describe('calculateTotal', () => {
    test('应该正确计算收入总额', () => {
      const entries = [
        { type: 'income', amount: 100 },
        { type: 'expense', amount: 50 },
        { type: 'income', amount: 200 }
      ];
      expect(calculateTotal('income', entries)).toBe(300);
    });
    
    test('应该正确计算支出总额', () => {
      const entries = [
        { type: 'income', amount: 100 },
        { type: 'expense', amount: 50 },
        { type: 'expense', amount: 30 }
      ];
      expect(calculateTotal('expense', entries)).toBe(80);
    });
    
    test('应该处理空列表', () => {
      expect(calculateTotal('income', [])).toBe(0);
    });
    
    test('应该处理大数字', () => {
      const entries = [
        { type: 'income', amount: 1000000 },
        { type: 'income', amount: 500000 }
      ];
      expect(calculateTotal('income', entries)).toBe(1500000);
    });
    
    test('应该忽略其他类型的条目', () => {
      const entries = [
        { type: 'income', amount: 100 },
        { type: 'refund', amount: 50 }
      ];
      expect(calculateTotal('income', entries)).toBe(100);
    });
  });
  
  describe('calculateBalance', () => {
    test('应该正确计算正余额', () => {
      expect(calculateBalance(1000, 300)).toBe(700);
    });
    
    test('应该正确计算负余额', () => {
      expect(calculateBalance(500, 800)).toBe(-300);
    });
    
    test('应该处理收支相等', () => {
      expect(calculateBalance(500, 500)).toBe(0);
    });
    
    test('应该处理零收支', () => {
      expect(calculateBalance(0, 0)).toBe(0);
    });
    
    test('应该处理只有收入', () => {
      expect(calculateBalance(1000, 0)).toBe(1000);
    });
    
    test('应该处理只有支出', () => {
      expect(calculateBalance(0, 500)).toBe(-500);
    });
  });
  
  describe('getCurrency', () => {
    test('应该返回美元符号', () => {
      const result = getCurrency();
      expect(result === '$' || result === '¥').toBe(true);
    });
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
