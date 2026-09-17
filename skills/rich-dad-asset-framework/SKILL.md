---
name: rich-dad-asset-framework
description: 用清崎（Kiyosaki）现金流定义设计节点-箭头资产板，并把账本存成个人财务报表字段。适用于 Meyra OS 里的现金流画布：收入 / 现金池 / 支出 / 资产 / 负债，箭头为月现金流；JSON 同时写出 assets / liabilities / income / expenses / monthlyCashflow / passiveIncome / esbi。Use when building a cashflow graph, personal financial statement fields, ESBI income lanes, or digital-product assets — not bank sync, not a fork of other Cashflow apps.
---

# 富爸爸资产框架（现金流画布 + 报表字段）

把清崎的**教学结构**做成图，而不是摘录原文。判断句：

> 资产把钱放进口袋；负债把钱拿出口袋。

宿主已有 OS（如 Meyra）时，用它的 `os-*` 色票、标题行、对象材质（`--hud` / `--object` / `--shadow`）。节点只写名称和金额。不要另做一套仪表盘卡片、地契色条或教学旁注。

## 何时用

- 需要一张可拖拽的现金流关系图（节点 + 箭头 = 账本）
- 需要 localStorage / JSON 读起来像个人财务报表（资产、负债、收入、支出、月净、被动、ESBI）
- 用户是 B 象限数字产品卖家（Prompt Kit / 模板），资产栏优先数字产品
- 要同时看见 E / S / B / I 收入通道，以及被动是否覆盖支出（鼠赛 / Rat Race）

不要：银行同步、长期预测、投资建议。不要 fork / 粘贴下列仓库的界面或 GPL 代码；只借用**字段形状与算法概念**：

| 仓库 | 许可 | 借用什么 |
| --- | --- | --- |
| [personal-financial-statement](https://github.com/bitlab-experiments/personal-financial-statement) | MIT | 四栏报表 + 净资产 + 被动收入 + JSON 导入导出 |
| [cashflow-balance-sheet](https://github.com/NathanStrutz/cashflow-balance-sheet) | GPL-3.0 | 概念：passiveIncome、cashFlow、鼠赛。禁止拷代码 |
| [CashflowClassicGameSheet](https://github.com/christian-stockinger/CashflowClassicGameSheet) | MIT | cashflow = income + passive − expenses |
| [wealthwise-behavioral-finance](https://github.com/Nandha-Kishore-K-B/wealthwise-behavioral-finance) | MIT | ESBI 四路收入 + 资产/负债 + 被动占比 |
| [esbi-viewer](https://github.com/TakuyaFukumura/esbi-viewer) | — | E/S/B/I 可视化 |
| [CashflowGameAssistant](https://github.com/Saniol/CashflowGameAssistant) | MIT | 职业种子、收入/支出/资产分栏 |

## 数据模型（报表字段 + 画布）

`localStorage["meyra-assets-v1"]` version **4**。编辑时图仍是来源；写入时把图折叠成报表字段，JSON 可单独当财务报表读。

```json
{
  "version": 4,
  "income": [{ "id": "", "name": "", "monthly": 0, "worth": 0, "quadrant": "S" }],
  "expenses": [{ "id": "", "name": "", "monthly": 0, "worth": 0, "subtype": "living" }],
  "assets": [{ "id": "", "name": "", "monthly": 0, "worth": 0, "subtype": "digital" }],
  "liabilities": [{ "id": "", "name": "", "monthly": 0, "worth": 0, "subtype": "loan" }],
  "monthlyCashflow": 0,
  "passiveIncome": 0,
  "netWorth": 0,
  "esbi": { "current": "S", "target": "B", "E": 0, "S": 0, "B": 0, "I": 0 },
  "nodes": [],
  "edges": []
}
```

导入时接受：v3 纯图、v4 全量、仅报表四栏（自动排版成图）、旧 v1/v2 列表。

**节点**

| 类型 | 含义 | 可编辑 |
| --- | --- | --- |
| Income | E 工资 / S 接案 / B 数字产品 / I 分红租金 | 名称、象限、月流入 |
| Cash pool | 枢纽，中央显示月净现金流 | 名称 |
| Expense | 固定生活 / 工具订阅 | 名称、月流出 |
| Asset | 每月回流的东西（优先数字产品） | 名称、类型、上架、净值、月回流 |
| Liability | 每月抽干的东西 | 名称、本金、月抽干 |
| Summary | 净资产、月净、覆盖率 | 只读，由箭头推算 |

**箭头（¥/月，粗细随金额）**

| 方向 | 颜色 | 含义 |
| --- | --- | --- |
| 收入 → 现金池 | 绿 / system | 流入 |
| 现金池 → 支出 | 红 / pink | 流出 |
| 现金池 → 资产 | 绿 | 再投入 |
| 资产 → 现金池 | 绿 | 被动回流 |
| 负债 → 现金池 | 红虚线 | 抽干 |
| 资产 ↔ 负债 | 虚线 | 例如出租 + 房贷 |

再投入不计入月净（那是盈余的用法）。  
月净 = 收入流入 + 资产回流 − 支出 − 负债抽干。  
覆盖率 = 资产回流 / (支出 + 负债抽干)。覆盖 ≥ 1 即被动覆盖支出。  
ESBI.I = I 象限收入 + 资产回流。

默认模板分区：上收入 E→S→B→I，中现金池，左下资产，右下负债，下支出，角上汇总。

## UX

- 平移 / 拖节点 / 连线；点节点或箭头打开侧栏；点空白添加
- 顶栏：标题、E S B I（点选当前，Alt 设目标）、添加 / 导出 / 导入 / 重置
- 节点面：名称 + 金额。类型、象限、净值只在侧栏
- 材质跟 OS：舞台用 `--card` 对象，节点和侧栏用 `--hud` 芯片
- 页面滚动时不要抢 wheel 缩放

## 文案

短标签，不教。不要 kicker、机会卡、指标条、图例、页脚免责、节点上的类型小字。
中文界面用中文。按钮用动词：添加、导出、导入、重置、删除。
错误一句说完，例如「读不了这份文件。」
