# Bootstrap 5 完整样式指南

## 📚 **核心概念**

Bootstrap 5 是一个现代化的 CSS 框架，提供了一系列**预定义的 CSS 类**来快速构建响应式网页。

## 🏗️ **主要组成部分**

### 1. **布局系统**
- Grid System（网格系统）
- Containers（容器）
- Columns（列）

### 2. **组件库**
- UI 组件（按钮、卡片、导航等）
- 工具类（间距、颜色、排版等）

---

## 📐 **1. 布局系统**

### **Container（容器）**
```css
.container { max-width: 100%; }           /* 固定宽度 */
.container-fluid { width: 100%; }         /* 100% 宽度 */
.container-{breakpoint} { max-width: ... } /* 响应式容器 */
```

### **Grid（网格）**
```css
.row { display: flex; }                   /* 行容器 */
.col { flex: 1; }                        /* 自动宽度 */
.col-{number} { flex: 0 0 {percentage}; } /* 固定列宽 */
.col-{breakpoint}-{number} { ... }       /* 响应式列 */
```

**断点映射：**
- `xs`: 0px+ (默认)
- `sm`: 576px+
- `md`: 768px+
- `lg`: 992px+
- `xl`: 1200px+
- `xxl`: 1400px+

---

## 🎨 **2. 排版样式**

### **标题类**
```css
.h1, .h2, .h3, .h4, .h5, .h6 { font-size: ...; }
.display-1, .display-2, .display-3, .display-4 { font-size: larger; }
.text-{size} { font-size: ...; }  /* sm, lg, etc. */
```

### **文本样式**
```css
.text-start, .text-center, .text-end     /* 对齐 */
.text-lowercase, .text-uppercase, .text-capitalize  /* 大小写 */
.text-muted, .text-primary, .text-success, etc.     /* 颜色 */
.font-weight-bold, .font-weight-normal, .font-italic  /* 字体样式 */
```

---

## 🎨 **3. 颜色系统**

### **文本颜色**
```css
.text-primary     /* 主要颜色 */
.text-secondary   /* 次要颜色 */
.text-success     /* 成功 */
.text-danger      /* 错误 */
.text-warning     /* 警告 */
.text-info        /* 信息 */
.text-light       /* 浅色 */
.text-dark        /* 深色 */
.text-body        /* 默认正文 */
.text-muted       /* 灰色文本 */
.text-white       /* 白色文本 */
.text-black-50    /* 黑色半透明 */
.text-white-50    /* 白色半透明 */
```

### **背景颜色**
```css
.bg-primary, .bg-secondary, .bg-success, .bg-danger, .bg-warning, .bg-info
.bg-light, .bg-dark, .bg-white, .bg-transparent
.text-bg-{color}  /* 文字背景组合类 */
```

---

## 📏 **4. 间距工具类**

### **Margin（外边距）**
```css
.m{t|r|b|l|x|y}-{0|1|2|3|4|5|auto}  /* m = margin */
/* t=top, r=right, b=bottom, l=left, x=horizontal, y=vertical */
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 1rem; }
.m-4 { margin: 1.5rem; }
.m-5 { margin: 3rem; }
.m-auto { margin: auto; }
```

### **Padding（内边距）**
```css
.p{t|r|b|l|x|y}-{0|1|2|3|4|5}  /* p = padding */
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
.p-5 { padding: 3rem; }
```

---

## 🔄 **5. Flexbox 工具类**

### **Display**
```css
.d-flex        /* display: flex */
.d-inline-flex /* display: inline-flex */
```

### **Direction**
```css
.flex-row        /* flex-direction: row */
.flex-column     /* flex-direction: column */
.flex-row-reverse /* flex-direction: row-reverse */
.flex-column-reverse /* flex-direction: column-reverse */
```

### **Justify Content**
```css
.justify-content-start    /* 开始对齐 */
.justify-content-end      /* 结束对齐 */
.justify-content-center   /* 居中 */
.justify-content-between  /* 两端对齐 */
.justify-content-around   /* 环绕分布 */
.justify-content-evenly   /* 平均分布 */
```

### **Align Items**
```css
.align-items-start    /* align-items: flex-start */
.align-items-end      /* align-items: flex-end */
.align-items-center   /* align-items: center */
.align-items-baseline /* align-items: baseline */
.align-items-stretch  /* align-items: stretch */
```

### **Flex Shrink/Grow**
```css
.flex-shrink-0    /* 不收缩 */
.flex-shrink-1    /* 允许收缩 */
.flex-grow-0      /* 不增长 */
.flex-grow-1      /* 允许增长 */
```

---

## 🎯 **6. 尺寸工具类**

```css
.w-25 { width: 25%; }
.w-50 { width: 50%; }
.w-75 { width: 75%; }
.w-100 { width: 100%; }
.w-auto { width: auto; }

.h-25 { height: 25%; }
.h-50 { height: 50%; }
.h-75 { height: 75%; }
.h-100 { height: 100%; }
.h-auto { height: auto; }

.min-vw-100 { min-width: 100vw; }
.min-vh-100 { min-height: 100vh; }
.vw-100 { width: 100vw; }
.vh-100 { height: 100vh; }
```

---

## 📱 **7. 响应式断点**

### **可见性控制**
```css
.d-none           /* 隐藏 */
.d-{breakpoint}-none    /* 断点隐藏 */
.d-block          /* 显示 */
.d-{breakpoint}-block   /* 断点显示 */

.visible          /* 可见 */
.invisible        /* 不可见（仍占用空间） */
```

### **断点特定类**
```css
.{class}-{breakpoint}-{value}  /* 如: d-md-flex */
```

---

## 🎨 **8. 组件样式**

### **按钮**
```css
.btn { base button styles }
.btn-primary, .btn-secondary, .btn-success, .btn-danger, 
.btn-warning, .btn-info, .btn-light, .btn-dark, .btn-link

.btn-sm, .btn-lg     /* 大小 */
.btn-outline-{color} /* 轮廓按钮 */
.btn-{color}-subtle  /* 柔和按钮 */
```

### **卡片**
```css
.card              /* 卡片容器 */
.card-header       /* 卡片头部 */
.card-body         /* 卡片主体 */
.card-title        /* 卡片标题 */
.card-text         /* 卡片文本 */
.card-img-top      /* 卡片顶部图片 */
.card-footer       /* 卡片底部 */
```

### **导航**
```css
.nav              /* 导航容器 */
.nav-tabs         /* 标签导航 */
.nav-pills        /* 胶囊导航 */
.navbar          /* 导航栏 */
.breadcrumb      /* 面包屑 */
.pagination      /* 分页 */
```

### **表单**
```css
.form-control      /* 输入框 */
.form-check        /* 复选框/单选框 */
.form-select       /* 选择框 */
.form-label        /* 标签 */
.form-text         /* 帮助文本 */
.form-range        /* 滑块 */
.is-valid, .is-invalid  /* 验证状态 */
```

---

## 🛠️ **9. 工具类**

### **阴影**
```css
.shadow-sm    /* 小阴影 */
.shadow       /* 默认阴影 */
.shadow-lg    /* 大阴影 */
.shadow-none  /* 无阴影 */
```

### **边框**
```css
.border        /* 边框 */
.border-{side} /* border-top, border-right, etc. */
.border-{color} /* border-primary, etc. */
.rounded       /* 圆角 */
.rounded-{size} /* rounded-circle, rounded-pill, etc. */
```

### **定位**
```css
.position-static      /* static 定位 */
.position-relative    /* relative 定位 */
.position-absolute    /* absolute 定位 */
.position-fixed       /* fixed 定位 */
.position-sticky      /* sticky 定位 */

.top-0, .top-50, .top-100     /* top: 0%, 50%, 100% */
.bottom-0, .start-0, .end-0   /* bottom, left, right */
.translate-middle          /* 居中定位 */
```

---

## 🎨 **10. 实用工具**

### **溢出**
```css
.overflow-auto     /* 自动滚动 */
.overflow-hidden   /* 隐藏溢出 */
.overflow-visible  /* 显示溢出 */
.overflow-scroll   /* 总是显示滚动条 */
```

### **游标**
```css
.cursor-auto        /* 默认 */
.cursor-pointer     /* 手指 */
.cursor-move        /* 移动 */
.cursor-not-allowed /* 禁止 */
```

### **变换**
```css
.rotate-0, .rotate-90, .rotate-180, .rotate-270, .rotate-n90
.scale-{up|down}
.flip-{horizontal|vertical}
```

---

## 🎯 **完整示例**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <title>Bootstrap 5 示例</title>
</head>
<body>
  <!-- 响应式导航栏 -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">我的网站</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link active" href="#">首页</a></li>
          <li class="nav-item"><a class="nav-link" href="#">关于</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- 主内容区域 -->
  <div class="container-fluid">
    <div class="row">
      <!-- 侧边栏 -->
      <div class="col-md-3 d-flex flex-column flex-shrink-0 p-3 text-bg-dark">
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0">
          <span class="fs-4">侧边栏</span>
        </a>
        <ul class="nav nav-pills flex-column mb-auto">
          <li><a href="#" class="nav-link text-white active">首页</a></li>
          <li><a href="#" class="nav-link text-white">设置</a></li>
        </ul>
      </div>
      
      <!-- 主内容 -->
      <div class="col-md-9">
        <div class="card m-3">
          <div class="card-body">
            <h5 class="card-title">欢迎使用 Bootstrap 5</h5>
            <p class="card-text">这是使用 Bootstrap 5 构建的响应式页面。</p>
            <button class="btn btn-primary">点击我</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 📱 **响应式实用类参考**

| 类名 | 断点 | 最小宽度 | 最大宽度 |
|------|------|----------|----------|
| `.d-none` | xs | 0px | 575px |
| `.d-sm-block` | sm | 576px | 767px |
| `.d-md-block` | md | 768px | 991px |
| `.d-lg-block` | lg | 992px | 1199px |
| `.d-xl-block` | xl | 1200px | 1399px |
| `.d-xxl-block` | xxl | 1400px | ∞ |

---

## ✅ **总结**

Bootstrap 5 提供了完整的前端开发解决方案，包括：

- **布局系统**：Grid、Containers
- **排版**：字体、颜色、对齐
- **组件**：按钮、卡片、表单、导航
- **工具类**：间距、尺寸、响应式
- **实用程序**：阴影、边框、定位

这些类可以自由组合，快速构建现代化、响应式的网页界面。