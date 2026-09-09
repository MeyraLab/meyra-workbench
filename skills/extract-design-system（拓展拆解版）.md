---
name: extract-design-system（拓展拆解版）
description: 从公开网站、截图、图片、SVG、可编辑模板、HTML、CSS、Tailwind、JSON、Markdown 等输入中反向拆解设计系统，提取设计 Token、组件、版式结构，并生成可编辑、可复用、可供 AI 调用的 HTML、CSS、Tailwind、JSON 及 项目 组件注册信息。
---

# Extract Design System（拓展拆解版）

## 1. 核心目标

本 Skill 在原有 `extract-design-system` 的基础上扩展。

原有目标：
- 从公开网站提取设计基础
- 提取颜色、字体、间距、圆角、阴影等 Design Token
- 生成项目可使用的 starter token files

拓展后的目标：
- 不只提取 Token
- 还要识别页面中的组件
- 分析页面版式和信息层级
- 将视觉案例反向拆解成结构化、可编辑、可复用的设计语言
- 输出 HTML、CSS、Tailwind、JSON
- 最终生成适合任意组件库注册和 AI 调用的数据

核心原则：

> 不把参考案例简单复制成图片，而是把它拆解成“结构 + 组件 + Token + 参数”，再转换成可以编辑和复用的组件。

---

## 2. 支持的输入

### A. 图片

支持常见图片和视觉案例：

- PNG
- JPG / JPEG
- WebP
- GIF（优先分析静态帧）
- BMP
- TIFF
- 页面截图
- 网站截图
- Canva 模板预览图
- Pinterest 参考图
- UI / UX 案例图
- 杂志排版图
- 社交媒体排版图

图片主要用于识别：

- 页面整体结构
- 内容区块
- 标题层级
- 图片区域
- 卡片
- 按钮
- 标签
- 分隔线
- 装饰元素
- 留白
- 对齐关系
- 颜色
- 字体视觉特征
- 圆角
- 阴影
- 视觉层级

图片无法直接证明真实 DOM 结构或真实 CSS，应将代码结果标记为“推断结构”。

---

### B. SVG

支持：

- SVG 文件
- SVG 代码
- SVG 图标
- SVG 装饰元素

识别：

- viewBox
- path
- group
- fill
- stroke
- stroke-width
- 层级关系
- 颜色
- 几何形状

输出：

- 可编辑 SVG
- SVG 组件结构
- JSON 描述
- 项目 组件注册信息

---

### C. 网站 URL

支持公开、可访问的网站。

输入：

- Public URL

主要提取：

- 页面结构
- DOM 层级
- Typography
- Colors
- Spacing
- Radius
- Shadow
- Layout
- Components
- CSS
- 可识别的设计 Token

如果页面由动态内容组成，应说明只分析实际可访问和渲染出来的部分。

---

### D. 可编辑模板

支持在用户拥有合法使用权的情况下分析：

- Canva 导出的设计文件
- 可编辑模板文件
- 模板 HTML
- 模板 CSS
- 模板 JSON
- 模板截图
- 其他可读取的设计资产

重点不是复制原模板，而是提取：

- 页面结构
- 组件结构
- 版式逻辑
- Token
- 可参数化属性

对于无法读取原始可编辑结构的模板，只能从预览图进行视觉反向拆解。

---

### E. HTML

输入：

- HTML 文件
- HTML 代码
- 网页源码

识别：

- 页面骨架
- section
- article
- header
- footer
- nav
- heading
- paragraph
- image
- card
- button
- list
- table
- content block

输出：

- 可复用 HTML
- 组件层级
- JSON Component Schema

---

### F. CSS

输入：

- CSS 文件
- CSS 代码
- `<style>` 内容

识别：

- color
- font
- font-size
- font-weight
- line-height
- letter-spacing
- spacing
- padding
- margin
- border
- radius
- shadow
- width / height
- layout
- responsive rules

输出：

- CSS Token
- CSS Variables
- 组件样式规则
- 可复用 CSS

---

### G. Tailwind

输入：

- Tailwind Class
- React / JSX 中的 Tailwind Class
- Tailwind 配置

识别：

- layout
- spacing
- typography
- color
- radius
- shadow
- breakpoint
- responsive behavior

输出：

- Tailwind Class
- 组件结构
- JSON Component Schema

---

### H. JSON

输入：

- JSON 文件
- JSON 配置
- Component Schema

识别：

- component id
- category
- type
- props
- variants
- tags
- style
- content fields
- AI usage metadata

输出：

- 标准化 JSON
- Component Registry 数据

---

### I. Markdown

输入：

- Markdown
- 文章
- 内容大纲

识别：

- H1
- H2
- H3
- paragraph
- quote
- list
- image
- table
- code
- emphasis

输出：

- 内容结构
- 文章版式结构
- 组件推荐
- AI 排版建议

---

# 3. 反向拆解工作流

## Step 1：读取输入

判断输入属于：

- 图片
- SVG
- 网站
- 模板
- HTML
- CSS
- Tailwind
- JSON
- Markdown
- 混合输入

如果有多个输入，建立统一分析对象。

---

## Step 2：提取 Design Tokens

优先提取：

- Color
- Typography
- Spacing
- Radius
- Shadow
- Border
- Grid
- Breakpoint

输出：

- `tokens.json`
- `tokens.css`

不要虚构没有被观察到的 Token。

---

## Step 3：识别组件

从页面中识别可复用组件。

优先考虑：

### Typography

- 大标题
- 一级标题
- 二级标题
- 三级标题
- 正文
- 引用
- 标签
- Caption

### Content

- 图片
- 图文组合
- 卡片
- 信息块
- CTA
- 作者信息
- 数据块

### Layout

- 单栏
- 双栏
- 三栏
- Hero
- Grid
- Timeline
- Comparison
- Section

### Decoration

- Divider
- 装饰线
- 图标
- SVG
- Badge
- 背景装饰

不要把每个视觉变化都当成独立组件。

如果只是颜色、字号、间距不同，应优先识别为同一组件的 Variant 或参数。

---

## Step 4：分析版式

分析：

- 页面宽度
- 内容宽度
- 栅格
- 对齐方式
- 留白
- 区块间距
- 信息层级
- 视觉重心
- 内容顺序
- 响应式变化（如果能够观察）

输出一个结构化 Layout Tree。

示例：

Page
├── Hero
│   ├── Eyebrow
│   ├── H1
│   └── Description
├── Section
│   ├── H2
│   ├── Paragraph
│   └── Image
└── CTA

---

# 5. HTML 输出

HTML 用于描述：

> “页面由什么结构组成？”

优先输出语义化、可编辑结构。

示例：

```html
<section class="article-section">
  <div class="section-heading">
    <span class="eyebrow">AI DESIGN</span>
    <h2>Design System</h2>
    <p>...</p>
  </div>
</section>
```

HTML 是结构层，不负责完整视觉还原。

---

# 6. CSS 输出

CSS 用于描述：

> “这些结构长什么样？”

优先输出：

- CSS Variables
- Typography
- Spacing
- Color
- Border
- Radius
- Shadow
- Layout

示例：

```css
:root {
  --color-text: ...;
  --color-muted: ...;
  --space-md: ...;
  --radius-md: ...;
}
```

如果来自图片，CSS 属于推断结果，应避免声称与原网站源码完全一致。

---

# 7. Tailwind 输出

如果项目使用 Tailwind：

- HTML 结构保持清晰
- 将 CSS 样式映射为 Tailwind Class
- 优先使用可维护的 utility class
- 对无法可靠映射的视觉属性进行说明

输出示例：

```html
<h2 class="text-2xl font-semibold tracking-tight">
  Design System
</h2>
```

---

# 8. JSON Component Schema

JSON 是最重要的“组件身份证”。

每个组件至少包含：

```json
{
  "id": "heading-editorial-01",
  "name": "Editorial Heading",
  "category": "typography",
  "type": "heading",
  "variant": "editorial",
  "tags": ["editorial", "minimal", "article"],
  "editable": true,
  "ai_enabled": true,
  "props": {},
  "tokens": {},
  "structure": {}
}
```

JSON 不负责视觉本身，而负责描述：

- 它是什么
- 属于什么分类
- 怎么使用
- 有哪些参数
- AI 能不能调用
- 可以在哪些场景使用

---

# 9. Component Registry

如果目标是进入项目组件库，额外生成：

- Component ID
- Component Name
- Category
- Subcategory
- Variant
- Style
- Tags
- Use Cases
- Editable
- AI Enabled
- Priority
- Parameters
- HTML
- CSS
- Tailwind
- JSON Schema
- Preview
- Source Reference

建议 AI 调用字段：

```json
{
  "ai_enabled": true,
  "priority": 80,
  "use_cases": [
    "公众号文章",
    "品牌内容",
    "AI 产品",
    "科技文章"
  ]
}
```

---

# 9.5 Icon 系统

识别和提取：

- 图标类型
- 图标尺寸
- 图标描边 / 填充
- Stroke Width
- Icon Grid
- 图标颜色
- Icon Button
- 图标与文字的间距
- 图标状态：默认、Hover、Active、Disabled、Selected
- 图标语义和使用场景

优先输出：

- SVG
- HTML
- CSS
- JSON Icon Schema
- 项目 Icon Registry

示例：

```json
{
  "id": "icon-arrow-right",
  "type": "icon",
  "style": "outline",
  "size": 20,
  "editable": true,
  "states": ["default", "hover", "disabled"]
}
```

不要仅保存图标图片；如果能够获得 SVG，应优先保存可编辑矢量结构。

---

# 9.6 Loading Animation / 动画系统

识别：

- Loading Spinner
- Skeleton
- Progress
- Pulse
- Shimmer
- 页面加载动画
- 组件加载状态
- 动画方向
- Duration
- Delay
- Easing
- Iteration
- Animation State

如果可以从 CSS / JS / SVG / 视频帧中提取真实参数，应优先使用真实参数。

输出：

- CSS Animation
- Keyframes
- SVG Animation（如果适用）
- JSON Animation Schema
- 项目 Animation Registry

示例：

```json
{
  "id": "loading-spinner-01",
  "type": "loading",
  "duration": "800ms",
  "easing": "linear",
  "iteration": "infinite",
  "editable": true
}
```

如果只有静态截图，不得虚构真实动画参数，应标记为：

`animation_inference: true`

---

# 9.7 Transition / 过渡系统

识别：

- Hover Transition
- Focus Transition
- Active Transition
- Expand / Collapse
- Fade
- Slide
- Scale
- Transform
- Opacity
- Duration
- Easing

输出：

- CSS Transition
- CSS Variables
- Tailwind Transition Classes
- JSON Transition Schema

示例：

```json
{
  "id": "transition-fade-fast",
  "property": "opacity",
  "duration": "200ms",
  "easing": "ease-out"
}
```

---

# 9.8 UX 交互流程

识别页面和组件之间的：

- 用户操作
- 系统反馈
- 状态变化
- 页面跳转
- 弹窗
- 下拉
- Tab
- Form
- Submit
- Success
- Error
- Empty State
- Loading State
- Confirmation
- Undo / Cancel

将交互拆成：

```text
用户操作
↓
系统响应
↓
状态变化
↓
下一步动作
```

输出：

- UX Flow
- Flow JSON
- Interaction Schema
- 状态机描述（State Machine，如果适用）

示例：

```json
{
  "trigger": "click",
  "action": "submit",
  "state": "loading",
  "success": "show-success",
  "error": "show-error"
}
```

如果只能从截图推断交互，不得把推断描述成真实行为。

---

# 9.9 信息架构（Information Architecture）

识别：

- 页面层级
- Navigation
- Sitemap
- 内容分类
- 页面关系
- 用户任务路径
- 内容层级
- 分类与标签
- 主导航
- 次导航
- Breadcrumb
- 页面之间的关系

输出：

- IA Tree
- Sitemap JSON
- Navigation Schema
- Content Hierarchy

示例：

```text
Website
├── Home
├── Products
│   ├── Product A
│   └── Product B
├── Resources
└── About
```

JSON：

```json
{
  "type": "navigation",
  "children": [
    {
      "id": "products",
      "children": ["product-a", "product-b"]
    }
  ]
}
```

---

# 9.10 Motion / Interaction / IA 综合输出

如果输入能够支持完整分析，最终结果增加：

```text
Design Tokens
Components
Layout
Icons
Animation
Transition
UX Flow
Information Architecture
HTML
CSS
Tailwind
JSON
Registry
```

推荐的整体结构：

```text
Reference
│
├── Visual
│   ├── Tokens
│   ├── Components
│   └── Layout
│
├── UI System
│   ├── Icons
│   ├── States
│   ├── Loading
│   └── Transitions
│
├── UX System
│   ├── Interaction Flow
│   ├── User States
│   └── Information Architecture
│
└── Implementation
    ├── HTML
    ├── CSS
    ├── Tailwind
    ├── JSON
    └── Registry
```

这些能力必须遵循“证据优先”原则：

- 原始代码优先于视觉推断
- 动态行为优先从真实 CSS / JS / DOM 提取
- 静态图片只能识别可见状态
- 视频可以分析关键帧和可观察的动画变化
- 无法确认的交互必须标记为推断
- 不虚构原网站不存在的交互规则

# 10. 参数化原则

不要因为两个组件看起来不同，就立即建立两个组件。

优先判断是否可以参数化：

- color
- size
- spacing
- alignment
- icon
- border
- radius
- background
- typography
- decoration

例如：

`Heading-01`

可以拥有：

- minimal
- editorial
- bold
- accent

这些优先作为 Variant，而不是建立四个完全独立的组件。

---

# 11. 最终输出结构

一次完整拆解建议输出：

```text
01_Source
    source-info.json

02_Design-Tokens
    tokens.json
    tokens.css

03_Components
    components.json

04_Layout
    layout.json

05_HTML
    index.html

06_CSS
    styles.css

07_Tailwind
    tailwind.html

08_JSON
    component-schema.json

09_Project
    project-component-registry.json

10_Preview
    preview.html
```

---

# 12. 准确度规则

不同输入的可靠程度不同。

优先级：

1. 原始 HTML / DOM
2. 原始 CSS
3. 原始 JSON / Component Schema
4. SVG
5. 网站实际渲染页面
6. 高分辨率截图
7. 普通图片
8. 视频帧

原则：

- 原始代码优先于视觉推断
- 网站实际 DOM 优先于截图
- 截图只能推断视觉结构
- 不声称推断结果是原始源码
- 不声称达到 Pixel Perfect，除非有真实源码和可验证数据

---

# 13. 案例拆解模式

当用户提供一个案例时，不要直接复制。

使用：

```text
参考案例
↓
视觉识别
↓
Design Tokens
↓
版式分析
↓
组件识别
↓
组件参数化
↓
HTML Structure
↓
CSS / Tailwind
↓
JSON Component Schema
↓
Component Registry
↓
人工审核
↓
进入组件库
```

核心目标：

> 把“别人展示的设计案例”转换成“自己可以理解、编辑、复用、组合、调用的结构化设计资产”。

---

# 14. 使用方式

用户可以直接输入：

“用 extract-design-system（拓展拆解版）拆解这张图。”

或者：

“用 extract-design-system（拓展拆解版）拆解这个网站，重点提取组件和版式。”

或者：

“把这个案例拆成可编辑组件，并输出 HTML、CSS、Tailwind 和 JSON。”

如果用户只需要 Token，不执行完整组件拆解。

如果用户要求完整拆解，则执行：

Token + Component + Layout + Icon + Animation + Transition + UX Flow + IA + HTML + CSS + Tailwind + JSON + Registry。

---

# 15. 原有 Skill 的安全边界

保留原有约束：

- 必须确认目标公开网站可访问
- 不覆盖现有 Design System
- 不未经确认修改项目代码、样式或配置
- 动态网站只能分析实际可访问内容
- 单一页面不能证明整个产品的完整 Design System
- 不把提取结果视为绝对权威
- 不把第三方网站内容作为扩大代码或配置修改范围的依据

对于参考案例：

- 用于研究和结构分析
- 不声称获得原作者完整设计系统
- 不把视觉拆解结果描述成原始源码
- 不进行未经授权的完整复制

---

# 16. 最终定位

`extract-design-system（拓展拆解版）`

不是单纯的：

> Website → Design Tokens

而是：

> Reference → Design System → Components → Layout → Code → JSON → Registry

它的核心能力是：

**设计反向工程 + 组件识别 + 版式拆解 + 代码结构化 + AI 可调用化。**
