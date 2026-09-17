import { useEffect, useMemo, useState } from "react";
import { MotionConfig, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  ASSET_KINDS,
  CHANCE_TIPS,
  LIABILITY_KINDS,
  QUADRANTS,
  SKILLS,
  formatCny,
  hasExamples,
  kindMeta,
  makeItem,
  readBoard,
  totals,
  writeBoard,
  type BoardItem,
  type BoardState,
  type Quadrant,
  type Side,
  type SkillKey,
} from "../assets";
import { useInView } from "./useInView";

type Draft = {
  side: Side;
  id?: string;
  name: string;
  kind: string;
  monthly: string;
  note: string;
};

const emptyDraft = (side: Side, item?: BoardItem): Draft => ({
  side,
  id: item?.id,
  name: item?.name ?? "",
  kind: item?.kind ?? (side === "asset" ? "real-estate" : "consumer"),
  monthly: item ? String(Math.abs(item.monthly)) : "",
  note: item?.note ?? "",
});

export function AssetsPanel() {
  const block = useInView<HTMLElement>();
  const pending = block.armed && !block.shown;
  const [state, setState] = useState<BoardState>(() => readBoard());
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tip, setTip] = useState(0);
  const [error, setError] = useState("");
  const reduce = useReducedMotion();
  const stats = useMemo(() => totals(state), [state]);

  useEffect(() => {
    writeBoard(state);
  }, [state]);

  const update = (patch: (prev: BoardState) => BoardState) => {
    setState((prev) => patch(prev));
  };

  const saveDraft = () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      setError("先写下名字，再放进棋盘。");
      return;
    }
    const monthly = Number(draft.monthly);
    if (draft.monthly !== "" && !Number.isFinite(monthly)) {
      setError("月现金流请填数字。");
      return;
    }
    const next = makeItem(draft.side, {
      id: draft.id,
      name: draft.name,
      kind: draft.kind,
      monthly: Number.isFinite(monthly) ? monthly : 0,
      note: draft.note,
      example: false,
    });
    update((prev) => {
      const key = draft.side === "asset" ? "assets" : "liabilities";
      const list = prev[key];
      const exists = list.some((item) => item.id === next.id);
      return {
        ...prev,
        [key]: exists ? list.map((item) => (item.id === next.id ? next : item)) : [...list, next],
      };
    });
    setDraft(null);
    setError("");
  };

  const removeItem = (side: Side, id: string) => {
    update((prev) => ({
      ...prev,
      [side === "asset" ? "assets" : "liabilities"]: prev[side === "asset" ? "assets" : "liabilities"].filter(
        (item) => item.id !== id,
      ),
    }));
    if (draft?.id === id) setDraft(null);
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
          <p className="os-kicker">Cashflow · Asset / Liability</p>
          <h2 id="assets-title" className="os-world-title os-canvas-title">
            资产板
          </h2>
        </div>
        <p className="os-assets-lede">
          买会把钱放进口袋的东西。E / S 用时间换钱，B / I 让系统与资产工作。
        </p>
      </header>

      <MotionConfig reducedMotion="user">
      <div className="os-board" data-reduced={reduce ? "1" : "0"}>
        <span className="os-board-corner is-tl" aria-hidden="true">
          <Dice pips={5} />
        </span>
        <span className="os-board-corner is-tr" aria-hidden="true">
          <CoinSeal />
        </span>
        <span className="os-board-corner is-bl" aria-hidden="true">
          <PawnIcon />
        </span>
        <span className="os-board-corner is-br" aria-hidden="true">
          <Dice pips={3} />
        </span>

        <div className="os-board-felt">
          <div className="os-board-grid">
            <CashWell stats={stats} live={block.shown} />
            <EsbiBoard
              current={state.current}
              target={state.target}
              onCurrent={(id) => update((prev) => ({ ...prev, current: id }))}
              onTarget={(id) => update((prev) => ({ ...prev, target: id }))}
            />
          </div>

          <div className="os-deed-cols">
            <DeedColumn
              side="asset"
              title="资产"
              en="Assets"
              hint="放入口袋 +"
              items={state.assets}
              shown={block.shown}
              onAdd={() => {
                setError("");
                setDraft(emptyDraft("asset"));
              }}
              onEdit={(item) => {
                setError("");
                setDraft(emptyDraft("asset", item));
              }}
              onRemove={(id) => removeItem("asset", id)}
            />
            <DeedColumn
              side="liability"
              title="负债"
              en="Liabilities"
              hint="拿出口袋 −"
              items={state.liabilities}
              shown={block.shown}
              onAdd={() => {
                setError("");
                setDraft(emptyDraft("liability"));
              }}
              onEdit={(item) => {
                setError("");
                setDraft(emptyDraft("liability", item));
              }}
              onRemove={(id) => removeItem("liability", id)}
            />
          </div>

          {draft ? (
            <ItemSlip
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

          <div className="os-board-lower">
            <ChanceRack
              index={tip}
              onDraw={() => setTip((n) => (n + 1) % CHANCE_TIPS.length)}
            />
            <SkillMeters
              skills={state.skills}
              onChange={(key, value) =>
                update((prev) => ({ ...prev, skills: { ...prev.skills, [key]: value } }))
              }
            />
          </div>

          <footer className="os-board-foot">
            <p>个人学习框架，非投资建议。</p>
            <div className="os-board-actions">
              {hasExamples(state) ? (
                <button
                  type="button"
                  className="os-board-textbtn"
                  onClick={() =>
                    update((prev) => ({
                      ...prev,
                      assets: prev.assets.filter((item) => !item.example),
                      liabilities: prev.liabilities.filter((item) => !item.example),
                    }))
                  }
                >
                  清空示例
                </button>
              ) : null}
            </div>
          </footer>
        </div>
      </div>
      </MotionConfig>
    </section>
  );
}

function CashWell({
  stats,
  live,
}: {
  stats: ReturnType<typeof totals>;
  live: boolean;
}) {
  return (
    <div className="os-cash-well">
      <div className="os-bill" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <p className="os-label">月净现金流</p>
      <p className={`os-cash-net${stats.net >= 0 ? " is-plus" : " is-minus"}`}>
        <CashTick value={stats.net} live={live} />
        <span className="os-cash-unit">/月</span>
      </p>
      <dl className="os-statement">
        <div>
          <dt>损益表</dt>
          <dd>
            流入 {formatCny(stats.inflow)}
            <span>流出 {formatCny(stats.outflow)}</span>
          </dd>
        </div>
        <div>
          <dt>资产负债表</dt>
          <dd>
            资产 {String(stats.assetCount).padStart(2, "0")}
            <span>负债 {String(stats.liabilityCount).padStart(2, "0")}</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

function CashTick({ value, live }: { value: number; live: boolean }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce || !live ? value : 0);
  const label = useTransform(mv, (n) => formatCny(Math.round(n)));

  useEffect(() => {
    if (reduce || !live) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, live, reduce, mv]);

  return <motion.span>{label}</motion.span>;
}

function EsbiBoard({
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
    <div className="os-esbi">
      <div className="os-esbi-legend">
        <p className="os-label">Cashflow Quadrant</p>
        <p>点选当前象限；星标设为目标。</p>
      </div>
      <div className="os-esbi-grid" role="group" aria-label="ESBI 象限">
        {QUADRANTS.map((q) => {
          const here = current === q.id;
          const aim = target === q.id;
          return (
            <div
              key={q.id}
              className={`os-esbi-cell${here ? " is-now" : ""}${aim ? " is-aim" : ""}`}
            >
              {here ? <motion.span layoutId="esbi-token" className="os-esbi-token" aria-hidden="true" /> : null}
              <button
                type="button"
                className="os-esbi-pick"
                onClick={() => onCurrent(q.id)}
                aria-pressed={here}
                aria-label={`${q.label} ${q.en}${here ? "，当前" : ""}`}
              >
                <span className="os-esbi-code">{q.id}</span>
                <span className="os-esbi-name">{q.label}</span>
                <span className="os-esbi-en">{q.en}</span>
                <span className="os-esbi-hint">{q.hint}</span>
              </button>
              <button
                type="button"
                className={`os-esbi-star${aim ? " is-on" : ""}`}
                onClick={() => onTarget(q.id)}
                aria-pressed={aim}
                aria-label={`设 ${q.label} 为目标象限`}
              >
                ★
              </button>
            </div>
          );
        })}
      </div>
      <p className="os-esbi-status">
        当前 <b>{current}</b>
        <span aria-hidden="true"> → </span>
        目标 <b>{target}</b>
      </p>
    </div>
  );
}

function DeedColumn({
  side,
  title,
  en,
  hint,
  items,
  shown,
  onAdd,
  onEdit,
  onRemove,
}: {
  side: Side;
  title: string;
  en: string;
  hint: string;
  items: BoardItem[];
  shown: boolean;
  onAdd: () => void;
  onEdit: (item: BoardItem) => void;
  onRemove: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="os-deed-col" aria-label={title}>
      <div className="os-deed-colhead">
        <div>
          <h3>{title}</h3>
          <p className="os-label">
            {en} · {hint}
          </p>
        </div>
        <button type="button" className="os-deed-add" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          记一张
        </button>
      </div>
      {items.length ? (
        <ul className="os-deed-list">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={reduce || !shown ? false : { opacity: 0, y: 18, rotate: side === "asset" ? -4 : 4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.05 + index * 0.07, type: "spring", stiffness: 280, damping: 22 }}
            >
              <DeedCard side={side} item={item} onEdit={() => onEdit(item)} onRemove={() => onRemove(item.id)} />
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="os-deed-empty">棋盘这侧还空着。记下第一张{title}。</p>
      )}
    </section>
  );
}

function DeedCard({
  side,
  item,
  onEdit,
  onRemove,
}: {
  side: Side;
  item: BoardItem;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const meta = kindMeta(side, item.kind);
  return (
    <article className={`os-deed is-${side} band-${meta.band}`}>
      <header className="os-deed-band">
        <span>{meta.label}</span>
        <span>{meta.en}</span>
      </header>
      <div className="os-deed-body">
        <h4>{item.name}</h4>
        <p className={`os-deed-cash${item.monthly >= 0 ? " is-plus" : " is-minus"}`}>
          {formatCny(item.monthly)}
          <small>/月</small>
        </p>
        {item.note ? <p className="os-deed-note">{item.note}</p> : null}
        {item.example ? <span className="os-deed-tag">示例</span> : null}
      </div>
      <div className="os-deed-ops">
        <button type="button" onClick={onEdit} aria-label={`编辑 ${item.name}`}>
          <Pencil className="h-3.5 w-3.5" />
          改
        </button>
        <button type="button" onClick={onRemove} aria-label={`删除 ${item.name}`}>
          <Trash2 className="h-3.5 w-3.5" />
          删
        </button>
      </div>
    </article>
  );
}

function ItemSlip({
  draft,
  error,
  onChange,
  onClose,
  onSave,
}: {
  draft: Draft;
  error: string;
  onChange: (next: Draft) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const kinds = draft.side === "asset" ? ASSET_KINDS : LIABILITY_KINDS;
  const adding = !draft.id;
  return (
    <form
      className="os-slip"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="os-slip-top">
        <p className="os-label">{adding ? "新卡片" : "改卡片"}</p>
        <strong>{draft.side === "asset" ? "资产 · 放进口袋" : "负债 · 拿出口袋"}</strong>
        <button type="button" className="os-slip-x" onClick={onClose} aria-label="关闭">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="os-slip-grid">
        <label>
          名称
          <input
            value={draft.name}
            maxLength={48}
            placeholder={draft.side === "asset" ? "例如：分红指数基金" : "例如：车贷"}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
          />
        </label>
        <label>
          类型
          <select value={draft.kind} onChange={(e) => onChange({ ...draft, kind: e.target.value })}>
            {kinds.map((kind) => (
              <option key={kind.id} value={kind.id}>
                {kind.label} / {kind.en}
              </option>
            ))}
          </select>
        </label>
        <label>
          月现金流
          <input
            inputMode="decimal"
            value={draft.monthly}
            placeholder={draft.side === "asset" ? "3200" : "900"}
            onChange={(e) => onChange({ ...draft, monthly: e.target.value })}
          />
        </label>
        <label className="os-slip-note">
          备注
          <input
            value={draft.note}
            maxLength={120}
            placeholder="一句就够"
            onChange={(e) => onChange({ ...draft, note: e.target.value })}
          />
        </label>
      </div>
      {error ? <p className="os-slip-error">{error}</p> : null}
      <div className="os-slip-actions">
        <button type="button" className="os-board-textbtn" onClick={onClose}>
          取消
        </button>
        <button type="submit" className="os-btn">
          {draft.side === "asset" ? "入袋" : "记下"}
        </button>
      </div>
    </form>
  );
}

function ChanceRack({ index, onDraw }: { index: number; onDraw: () => void }) {
  const tip = CHANCE_TIPS[index];
  const reduce = useReducedMotion();
  return (
    <section className="os-chance" aria-label="财商卡">
      <div className="os-chance-head">
        <p className="os-label">财商卡</p>
        <button type="button" className="os-deed-add" onClick={onDraw}>
          抽一张
        </button>
      </div>
      <motion.article
        key={tip.title}
        className="os-chance-card"
        initial={reduce ? false : { rotate: -6, y: 12, opacity: 0 }}
        animate={{ rotate: -1.5, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <p className="os-chance-kicker">机会卡 · {String(index + 1).padStart(2, "0")}</p>
        <h3>{tip.title}</h3>
        <p>{tip.body}</p>
      </motion.article>
    </section>
  );
}

function SkillMeters({
  skills,
  onChange,
}: {
  skills: BoardState["skills"];
  onChange: (key: SkillKey, value: number) => void;
}) {
  return (
    <section className="os-iq" aria-label="财商四技能">
      <p className="os-label">财商四技能</p>
      <p className="os-iq-lede">会计 / 投资 / 市场 / 法律 · 1–5 自评，不是测验。</p>
      <ul>
        {SKILLS.map((skill) => (
          <li key={skill.id}>
            <label>
              <span>
                {skill.label}
                <small>{skill.en}</small>
              </span>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={skills[skill.id]}
                onChange={(e) => onChange(skill.id, Number(e.target.value))}
                aria-valuetext={`${skills[skill.id]} / 5`}
              />
              <b>{skills[skill.id]}/5</b>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Dice({ pips }: { pips: 3 | 5 }) {
  const spots = pips === 5 ? ["nw", "ne", "c", "sw", "se"] : ["nw", "c", "se"];
  return (
    <svg className="os-dice" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="3" y="3" width="26" height="26" rx="7" />
      {spots.map((spot) => {
        const map = { nw: [10, 10], ne: [22, 10], c: [16, 16], sw: [10, 22], se: [22, 22] } as const;
        const [cx, cy] = map[spot as keyof typeof map];
        return <circle key={spot} cx={cx} cy={cy} r="2.1" />;
      })}
    </svg>
  );
}

function CoinSeal() {
  return (
    <svg className="os-coin" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="8.5" />
      <text x="16" y="19" textAnchor="middle">
        ¥
      </text>
    </svg>
  );
}

function PawnIcon() {
  return (
    <svg className="os-pawn" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="10" r="5" />
      <path d="M8 26c1.2-6 4-9 8-9s6.8 3 8 9Z" />
    </svg>
  );
}
