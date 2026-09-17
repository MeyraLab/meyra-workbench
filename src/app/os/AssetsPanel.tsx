import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  QUADRANTS,
  formatCny,
  hasExamples,
  makeLine,
  makeProduct,
  productNet,
  readBoard,
  totals,
  writeBoard,
  type BoardItem,
  type BoardState,
  type DigitalProduct,
  type Quadrant,
  type Side,
} from "../assets";
import { useInView } from "./useInView";

type LineDraft = {
  kind: Side;
  id?: string;
  name: string;
  monthly: string;
  note: string;
};

type ProductDraft = {
  kind: "product";
  id?: string;
  name: string;
  listings: string;
  monthlySales: string;
  updateCost: string;
  note: string;
};

type Draft = LineDraft | ProductDraft;

const emptyLine = (kind: Side, item?: BoardItem): LineDraft => ({
  kind,
  id: item?.id,
  name: item?.name ?? "",
  monthly: item ? String(Math.abs(item.monthly)) : "",
  note: item?.note ?? "",
});

const emptyProduct = (item?: DigitalProduct): ProductDraft => ({
  kind: "product",
  id: item?.id,
  name: item?.name ?? "",
  listings: item ? String(item.listings) : "1",
  monthlySales: item ? String(item.monthlySales) : "",
  updateCost: item ? String(item.updateCost) : "",
  note: item?.note ?? "",
});

export function AssetsPanel() {
  const block = useInView<HTMLElement>();
  const pending = block.armed && !block.shown;
  const [state, setState] = useState<BoardState>(() => readBoard());
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const stats = useMemo(() => totals(state), [state]);

  useEffect(() => {
    writeBoard(state);
  }, [state]);

  const update = (patch: (prev: BoardState) => BoardState) => setState((prev) => patch(prev));

  const saveDraft = () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      setError("先写下名称。");
      return;
    }
    if (draft.kind === "product") {
      const listings = Number(draft.listings);
      const monthlySales = Number(draft.monthlySales);
      const updateCost = Number(draft.updateCost);
      const bad = (raw: string, n: number) => raw !== "" && !Number.isFinite(n);
      if (bad(draft.listings, listings) || bad(draft.monthlySales, monthlySales) || bad(draft.updateCost, updateCost)) {
        setError("上架 / 销售 / 成本请填数字。");
        return;
      }
      const next = makeProduct({
        id: draft.id,
        name: draft.name,
        listings: Number.isFinite(listings) ? listings : 0,
        monthlySales: Number.isFinite(monthlySales) ? monthlySales : 0,
        updateCost: Number.isFinite(updateCost) ? updateCost : 0,
        note: draft.note,
        example: false,
      });
      update((prev) => ({
        ...prev,
        products: prev.products.some((item) => item.id === next.id)
          ? prev.products.map((item) => (item.id === next.id ? next : item))
          : [...prev.products, next],
      }));
    } else {
      const monthly = Number(draft.monthly);
      if (draft.monthly !== "" && !Number.isFinite(monthly)) {
        setError("月现金流请填数字。");
        return;
      }
      const next = makeLine(draft.kind, {
        id: draft.id,
        name: draft.name,
        monthly: Number.isFinite(monthly) ? monthly : 0,
        note: draft.note,
        example: false,
      });
      const key = draft.kind === "asset" ? "assets" : "liabilities";
      update((prev) => ({
        ...prev,
        [key]: prev[key].some((item) => item.id === next.id)
          ? prev[key].map((item) => (item.id === next.id ? next : item))
          : [...prev[key], next],
      }));
    }
    setDraft(null);
    setError("");
  };

  const removeLine = (side: Side, id: string) => {
    update((prev) => ({
      ...prev,
      [side === "asset" ? "assets" : "liabilities"]: prev[side === "asset" ? "assets" : "liabilities"].filter(
        (item) => item.id !== id,
      ),
    }));
    if (draft && draft.kind === side && draft.id === id) setDraft(null);
  };

  const removeProduct = (id: string) => {
    update((prev) => ({ ...prev, products: prev.products.filter((item) => item.id !== id) }));
    if (draft?.kind === "product" && draft.id === id) setDraft(null);
  };

  return (
    <section
      id="assets"
      ref={block.ref}
      className={`os-assets-section os-reveal${pending ? " is-pending" : ""}${block.shown ? " is-in" : ""}`}
      aria-labelledby="assets-title"
    >
      <header className="os-assets-head">
        <div>
          <p className="os-kicker">Weekly glance</p>
          <h2 id="assets-title" className="os-world-title os-canvas-title">
            资产板
          </h2>
        </div>
        <span className="os-status">{formatCny(stats.net)} /月</span>
      </header>
      <p className="os-assets-lede">
        每周一眼：主动收入、被动 / 半被动、固定支出。数字产品是 B 象限的资产，不是投资看板。
      </p>

      <Glance
        state={state}
        stats={stats}
        onActive={(value) => update((prev) => ({ ...prev, activeIncome: value }))}
        onFixed={(value) => update((prev) => ({ ...prev, fixedExpenses: value }))}
      />

      <EsbiRow
        current={state.current}
        target={state.target}
        onCurrent={(id) => update((prev) => ({ ...prev, current: id }))}
        onTarget={(id) => update((prev) => ({ ...prev, target: id }))}
      />

      <div className="os-asset-digital">
        <ListHead
          title="数字产品资产"
          en="Digital products"
          count={state.products.length}
          action="记一项"
          onAdd={() => {
            setError("");
            setDraft(emptyProduct());
          }}
        />
        {draft?.kind === "product" ? (
          <ProductForm
            draft={draft}
            error={error}
            onChange={setDraft}
            onClose={() => {
              setDraft(null);
              setError("");
            }}
            onSave={saveDraft}
          />
        ) : null}
        {state.products.length ? (
          <ul className="os-asset-list">
            {state.products.map((item, index) => (
              <li
                key={item.id}
                className="os-reveal os-reveal-quiet"
                style={{ transitionDelay: block.shown ? `${index * 50}ms` : "0ms" }}
              >
                <ProductRow
                  item={item}
                  onEdit={() => {
                    setError("");
                    setDraft(emptyProduct(item));
                  }}
                  onRemove={() => removeProduct(item.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="os-asset-empty">还没有上架。记下 Prompt Kit、模板或其他数字产品。</p>
        )}
      </div>

      <div className="os-asset-cols">
        <LineList
          side="asset"
          title="资产"
          en="Assets"
          hint="放入口袋"
          items={state.assets}
          shown={block.shown}
          draft={draft?.kind === "asset" ? draft : null}
          error={draft?.kind === "asset" ? error : ""}
          onAdd={() => {
            setError("");
            setDraft(emptyLine("asset"));
          }}
          onEdit={(item) => {
            setError("");
            setDraft(emptyLine("asset", item));
          }}
          onRemove={(id) => removeLine("asset", id)}
          onDraft={setDraft}
          onClose={() => {
            setDraft(null);
            setError("");
          }}
          onSave={saveDraft}
        />
        <LineList
          side="liability"
          title="负债"
          en="Liabilities"
          hint="拿出口袋"
          items={state.liabilities}
          shown={block.shown}
          draft={draft?.kind === "liability" ? draft : null}
          error={draft?.kind === "liability" ? error : ""}
          onAdd={() => {
            setError("");
            setDraft(emptyLine("liability"));
          }}
          onEdit={(item) => {
            setError("");
            setDraft(emptyLine("liability", item));
          }}
          onRemove={(id) => removeLine("liability", id)}
          onDraft={setDraft}
          onClose={() => {
            setDraft(null);
            setError("");
          }}
          onSave={saveDraft}
        />
      </div>

      <footer className="os-assets-foot">
        <p>个人学习框架，非投资建议。</p>
        {hasExamples(state) ? (
          <button
            type="button"
            className="os-text-link"
            onClick={() =>
              update((prev) => ({
                ...prev,
                assets: prev.assets.filter((item) => !item.example),
                liabilities: prev.liabilities.filter((item) => !item.example),
                products: prev.products.filter((item) => !item.example),
              }))
            }
          >
            清空示例
          </button>
        ) : null}
      </footer>
    </section>
  );
}

function Glance({
  state,
  stats,
  onActive,
  onFixed,
}: {
  state: BoardState;
  stats: ReturnType<typeof totals>;
  onActive: (value: number) => void;
  onFixed: (value: number) => void;
}) {
  return (
    <div className="os-asset-glance" aria-label="月度现金流">
      <MoneyField label="主动收入" en="Active" hint="接案 / 工资" value={state.activeIncome} onChange={onActive} />
      <div className="os-asset-metric">
        <p className="os-label">被动 / 半被动</p>
        <p className={`os-asset-num${stats.passive >= 0 ? " is-plus" : " is-minus"}`}>{formatCny(stats.passive)}</p>
        <p className="os-asset-hint">资产 {formatCny(stats.assetFlow)} · 数字产品 {formatCny(stats.digitalNet)}</p>
      </div>
      <MoneyField label="固定支出" en="Fixed" hint="生活与运营" value={state.fixedExpenses} onChange={onFixed} />
      <div className="os-asset-metric">
        <p className="os-label">月净现金流</p>
        <p className={`os-asset-num${stats.net >= 0 ? " is-plus" : " is-minus"}`}>{formatCny(stats.net)}</p>
        <p className="os-asset-hint">含负债流出 {formatCny(stats.liabilityFlow)}</p>
      </div>
    </div>
  );
}

function MoneyField({
  label,
  en,
  hint,
  value,
  onChange,
}: {
  label: string;
  en: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = () => {
    const n = Number(text);
    onChange(Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0);
  };

  return (
    <label className="os-asset-metric">
      <span className="os-label">
        {label} · {en}
      </span>
      <span className="os-asset-input">
        <span aria-hidden="true">¥</span>
        <input
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          aria-label={label}
        />
      </span>
      <span className="os-asset-hint">{hint}</span>
    </label>
  );
}

function EsbiRow({
  current,
  target,
  onCurrent,
  onTarget,
}: {
  current: Quadrant;
  target: Quadrant;
  onCurrent: (id: Quadrant) => void;
  onTarget: (id: Quadrant) => void;
}) {
  return (
    <div className="os-asset-esbi">
      <ChipGroup label="当前象限" value={current} onChange={onCurrent} />
      <ChipGroup label="目标象限" value={target} onChange={onTarget} />
    </div>
  );
}

function ChipGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Quadrant;
  onChange: (id: Quadrant) => void;
}) {
  return (
    <div className="os-asset-chips" role="group" aria-label={label}>
      <p className="os-label">{label}</p>
      <div>
        {QUADRANTS.map((q) => (
          <button
            key={q.id}
            type="button"
            className={`os-asset-chip${value === q.id ? " is-on" : ""}`}
            aria-pressed={value === q.id}
            title={q.hint}
            onClick={() => onChange(q.id)}
          >
            {q.id}
            <span>{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ListHead({
  title,
  en,
  count,
  action,
  onAdd,
}: {
  title: string;
  en: string;
  count: number;
  action: string;
  onAdd: () => void;
}) {
  return (
    <div className="os-asset-colhead">
      <div>
        <h3>{title}</h3>
        <p className="os-label">
          {en}
          <span className="os-status">{String(count).padStart(2, "0")}</span>
        </p>
      </div>
      <button type="button" className="os-asset-add" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        {action}
      </button>
    </div>
  );
}

function LineList({
  side,
  title,
  en,
  hint,
  items,
  shown,
  draft,
  error,
  onAdd,
  onEdit,
  onRemove,
  onDraft,
  onClose,
  onSave,
}: {
  side: Side;
  title: string;
  en: string;
  hint: string;
  items: BoardItem[];
  shown: boolean;
  draft: LineDraft | null;
  error: string;
  onAdd: () => void;
  onEdit: (item: BoardItem) => void;
  onRemove: (id: string) => void;
  onDraft: (next: LineDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <section aria-label={title}>
      <ListHead title={title} en={`${en} · ${hint}`} count={items.length} action="记一项" onAdd={onAdd} />
      {draft ? (
        <LineForm draft={draft} error={error} onChange={onDraft} onClose={onClose} onSave={onSave} />
      ) : null}
      {items.length ? (
        <ul className="os-asset-list">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="os-reveal os-reveal-quiet"
              style={{ transitionDelay: shown ? `${index * 50}ms` : "0ms" }}
            >
              <LineRow item={item} onEdit={() => onEdit(item)} onRemove={() => onRemove(item.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="os-asset-empty">这一栏还空着。</p>
      )}
    </section>
  );
}

function LineRow({ item, onEdit, onRemove }: { item: BoardItem; onEdit: () => void; onRemove: () => void }) {
  return (
    <article className="os-asset-row">
      <div className="min-w-0">
        <h4>
          {item.name}
          {item.example ? <span className="os-asset-tag">示例</span> : null}
        </h4>
        {item.note ? <p>{item.note}</p> : null}
      </div>
      <p className={`os-asset-cash${item.monthly >= 0 ? " is-plus" : " is-minus"}`}>
        {formatCny(item.monthly)}
        <small>/月</small>
      </p>
      <RowOps name={item.name} onEdit={onEdit} onRemove={onRemove} />
    </article>
  );
}

function ProductRow({
  item,
  onEdit,
  onRemove,
}: {
  item: DigitalProduct;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const net = productNet(item);
  return (
    <article className="os-asset-row is-product">
      <div className="min-w-0">
        <h4>
          {item.name}
          {item.example ? <span className="os-asset-tag">示例</span> : null}
        </h4>
        <p>
          上架 {String(item.listings).padStart(2, "0")} · 销售 {formatCny(item.monthlySales)} · 更新 {formatCny(-item.updateCost)}
          {item.note ? ` · ${item.note}` : ""}
        </p>
      </div>
      <p className={`os-asset-cash${net >= 0 ? " is-plus" : " is-minus"}`}>
        {formatCny(net)}
        <small>/月</small>
      </p>
      <RowOps name={item.name} onEdit={onEdit} onRemove={onRemove} />
    </article>
  );
}

function RowOps({ name, onEdit, onRemove }: { name: string; onEdit: () => void; onRemove: () => void }) {
  return (
    <div className="os-asset-ops">
      <button type="button" onClick={onEdit} aria-label={`编辑 ${name}`}>
        <Pencil className="h-3.5 w-3.5" />
        改
      </button>
      <button type="button" onClick={onRemove} aria-label={`删除 ${name}`}>
        <Trash2 className="h-3.5 w-3.5" />
        删
      </button>
    </div>
  );
}

function LineForm({
  draft,
  error,
  onChange,
  onClose,
  onSave,
}: {
  draft: LineDraft;
  error: string;
  onChange: (next: LineDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <form
      className="os-asset-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="os-asset-form-top">
        <p className="os-label">{draft.id ? "改一项" : "新一项"} · {draft.kind === "asset" ? "资产" : "负债"}</p>
        <button type="button" onClick={onClose} aria-label="关闭" className="os-asset-x">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="os-asset-fields">
        <label>
          名称
          <input
            value={draft.name}
            maxLength={48}
            placeholder={draft.kind === "asset" ? "例如：授权费" : "例如：工具订阅"}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
          />
        </label>
        <label>
          月现金流
          <input
            inputMode="decimal"
            value={draft.monthly}
            placeholder={draft.kind === "asset" ? "200" : "189"}
            onChange={(e) => onChange({ ...draft, monthly: e.target.value })}
          />
        </label>
        <label className="os-asset-span">
          备注
          <input
            value={draft.note}
            maxLength={120}
            placeholder="一句就够"
            onChange={(e) => onChange({ ...draft, note: e.target.value })}
          />
        </label>
      </div>
      {error ? <p className="os-asset-error">{error}</p> : null}
      <div className="os-asset-form-actions">
        <button type="button" className="os-text-link" onClick={onClose}>
          取消
        </button>
        <button type="submit" className="os-asset-save">
          保存
        </button>
      </div>
    </form>
  );
}

function ProductForm({
  draft,
  error,
  onChange,
  onClose,
  onSave,
}: {
  draft: ProductDraft;
  error: string;
  onChange: (next: ProductDraft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <form
      className="os-asset-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="os-asset-form-top">
        <p className="os-label">{draft.id ? "改一项" : "新一项"} · 数字产品</p>
        <button type="button" onClick={onClose} aria-label="关闭" className="os-asset-x">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="os-asset-fields is-product">
        <label>
          名称
          <input
            value={draft.name}
            maxLength={48}
            placeholder="例如：Prompt Kit"
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
          />
        </label>
        <label>
          上架数
          <input
            inputMode="numeric"
            value={draft.listings}
            placeholder="3"
            onChange={(e) => onChange({ ...draft, listings: e.target.value })}
          />
        </label>
        <label>
          月销售
          <input
            inputMode="decimal"
            value={draft.monthlySales}
            placeholder="1860"
            onChange={(e) => onChange({ ...draft, monthlySales: e.target.value })}
          />
        </label>
        <label>
          更新成本
          <input
            inputMode="decimal"
            value={draft.updateCost}
            placeholder="120"
            onChange={(e) => onChange({ ...draft, updateCost: e.target.value })}
          />
        </label>
        <label className="os-asset-span">
          备注
          <input
            value={draft.note}
            maxLength={120}
            placeholder="渠道或版本"
            onChange={(e) => onChange({ ...draft, note: e.target.value })}
          />
        </label>
      </div>
      {error ? <p className="os-asset-error">{error}</p> : null}
      <div className="os-asset-form-actions">
        <button type="button" className="os-text-link" onClick={onClose}>
          取消
        </button>
        <button type="submit" className="os-asset-save">
          保存
        </button>
      </div>
    </form>
  );
}
