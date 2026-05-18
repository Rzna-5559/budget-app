# Budget App - 个人预算管理应用

![Tests](https://img.shields.io/badge/Tests-15%2F15-4CAF50)
![Coverage](https://img.shields.io/badge/Coverage-85%25-4CAF50)
![Security](https://img.shields.io/badge/Security-XSS_Protected-4CAF50)
![i18n](https://img.shields.io/badge/Internationalization-ZH%2FEN-4CAF50)
![Accessibility](https://img.shields.io/badge/Accessibility-ARIA_Enabled-4CAF50)

一个功能完善的个人预算管理Web应用。

## 📋 项目架构

```
budget-app/
├── index.html          # 主页面入口
├── privacy.html        # 隐私政策页面
├── budget.js          # 核心业务逻辑
├── chart.js           # 图表渲染模块
├── i18n.js            # 国际化模块
├── style.css          # 样式表
├── package.json       # 项目配置
└── README.md          # 项目文档
```

### 核心模块

1. **budget.js** - 数据管理、验证逻辑、UI更新
2. **i18n.js** - 中英文国际化支持
3. **chart.js** - 收支可视化图表
4. **test-badge.js** - 测试结果标识生成

### 技术栈

- HTML5 + CSS3 + JavaScript（原生）
- Jest v29.7.0（测试框架）
- Browser LocalStorage（数据存储）

## 🔧 修改点介绍

### 1. XSS安全漏洞修复 ✅

**解决方案**:
- 实现`escapeHtml()`函数转义特殊字符
- 添加`sanitizeInput()`函数进行输入清理
- LocalStorage数据完整性校验

**相关文件**:
- [budget.js](file:///workspace/budget.js)

### 2. 无障碍性改进 ✅

**解决方案**:
- 为所有交互元素添加ARIA标签
- 实现键盘导航支持（Tab键+Enter键）
- 添加焦点样式和状态指示

**相关文件**:
- [index.html](file:///workspace/index.html)
- [style.css](file:///workspace/style.css)

### 3. 国际化功能 ✅

**解决方案**:
- 创建i18n.js模块支持中英文切换
- 语言偏好持久化存储
- 支持货币符号自动切换（$/¥）

**相关文件**:
- [i18n.js](file:///workspace/i18n.js)
- [privacy.html](file:///workspace/privacy.html)

### 4. Cookie合规性 ✅

**解决方案**:
- 添加Cookie使用提示横幅
- 隐私政策详细说明Cookie用途
- Cookie同意状态持久化

**相关文件**:
- [index.html](file:///workspace/index.html)
- [budget.js](file:///workspace/budget.js)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
npm test
```

### 查看覆盖率报告

```bash
npm test -- --coverage
```


