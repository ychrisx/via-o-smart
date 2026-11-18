"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import RedSidebar from "./red-sidebar";

export type Tone = "green" | "amber" | "red" | "gray" | "blue" | "dark";

/* ---------------------------------------------------------------- ícones */
const paths: Record<string, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  download: <><path d="M12 4v11" /><path d="m7 10 5 5 5-5" /><path d="M5 20h14" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M8 14h2M14 14h2" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  warn: <><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v5M12 18h.01" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  sort: <><path d="m8 9 4-4 4 4" /><path d="m8 15 4 4 4-4" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
};

export function Icon({ name, size = 18, stroke = 2 }: { name: keyof typeof paths | string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/* ---------------------------------------------------------------- shell */
export function useToast(): [string, (msg: string) => void] {
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2800);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return [toast, show];
}

export function Shell({ children, toast }: { children: ReactNode; toast?: string }) {
  return (
    <div className="app-shell">
      <RedSidebar />
      <main className="workspace">
        {children}
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </main>
    </div>
  );
}

export function PageHead({ crumb, title, subtitle, hint }: { crumb?: ReactNode; title: string; subtitle?: ReactNode; hint?: ReactNode }) {
  return (
    <header className="page-head">
      {crumb ? <div className="crumb">{crumb}</div> : null}
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
      {hint ? <p className="hint">{hint}</p> : null}
    </header>
  );
}

/* ---------------------------------------------------------------- inputs */
export function SearchBar({ placeholder = "Buscar cliente, motorista ou veículo...", value, onChange, width }: { placeholder?: string; value: string; onChange: (v: string) => void; width?: number }) {
  return (
    <label className="search" style={width ? { maxWidth: width } : undefined}>
      <Icon name="search" size={19} />
      <input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} aria-label={placeholder} />
    </label>
  );
}

export function FilterInput({ label, placeholder, value, onChange, width, icon = "search" }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; width?: number | string; icon?: string }) {
  return (
    <label className="field" style={{ width }}>
      <span>{label}</span>
      <div className="control">
        <input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
        <Icon name={icon} size={19} />
      </div>
    </label>
  );
}

export function SelectField({ label, value, options, onChange, width, invalid }: { label: string; value: string; options: string[]; onChange: (v: string) => void; width?: number | string; invalid?: boolean }) {
  return (
    <label className="field" style={{ width }}>
      <span>{label}</span>
      <div className={`control ${invalid ? "invalid" : ""}`}>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <Icon name="chevron" size={18} />
      </div>
    </label>
  );
}

export function DateField({ label, value, onChange, width }: { label: string; value: string; onChange: (v: string) => void; width?: number | string }) {
  return (
    <label className="field" style={{ width }}>
      <span>{label}</span>
      <div className="control">
        <input value={value} onChange={(e) => onChange(e.target.value)} />
        <Icon name="calendar" size={19} />
      </div>
    </label>
  );
}

/** Converte dd/mm/aaaa em número comparável (aaaammdd). Retorna NaN se inválida. */
export function dateKey(br: string) {
  const m = br.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return m ? Number(`${m[3]}${m[2]}${m[1]}`) : NaN;
}

export function Segmented({ options, value, onChange, variant, label, showLabel }: { options: string[]; value: string; onChange: (v: string) => void; variant?: "head" | "sm" | "boxed"; label?: string; showLabel?: boolean }) {
  const seg = (
    <div className={`seg ${variant === "head" ? "seg-head" : ""} ${variant === "sm" ? "seg-sm" : ""} ${variant === "boxed" ? "seg-boxed" : ""}`} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} type="button" className={o === value ? "on" : ""} aria-pressed={o === value} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
  if (!label || !showLabel) return seg;
  return <div className="field"><span>{label}</span>{seg}</div>;
}

/* ---------------------------------------------------------------- status */
export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function Farol({ g, a, r, onPick }: { g: number; a: number; r: number; onPick?: (tone: "green" | "amber" | "red") => void }) {
  const items: ["green" | "amber" | "red", number, string][] = [["green", g, "em dia"], ["amber", a, "atenção"], ["red", r, "pendente"]];
  return (
    <span className="farol">
      {items.map(([tone, n, label]) =>
        onPick ? (
          <button key={tone} type="button" onClick={() => onPick(tone)} title={`Abrir ${label}`}><i className={`dot dot-${tone}`} />{n}</button>
        ) : (
          <span key={tone}><i className={`dot dot-${tone}`} />{n}</span>
        ),
      )}
    </span>
  );
}

export function Kpi({ value, label, primary, dot, redNumber, onClick, active }: { value: ReactNode; label: string; primary?: boolean; dot?: Tone; redNumber?: boolean; onClick?: () => void; active?: boolean }) {
  const cls = `kpi ${primary || active ? "primary" : ""} ${redNumber && !(primary || active) ? "red-number" : ""}`;
  const inner = <><strong>{dot ? <i className={`dot dot-${dot}`} /> : null}{value}</strong><span>{label}</span></>;
  return onClick ? <button type="button" className={cls} onClick={onClick}>{inner}</button> : <article className={cls}>{inner}</article>;
}

/* ---------------------------------------------------------------- cards */
export function Card({ title, right, children, footer, className = "", style }: { title: ReactNode; right?: ReactNode; children: ReactNode; footer?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <section className={`card ${className}`} style={style}>
      <div className="card-head"><h2>{title}</h2>{right ? <div className="right">{right}</div> : null}</div>
      {children}
      {footer ? <div className="card-foot">{footer}</div> : null}
    </section>
  );
}

export function ViewAll({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) {
  if (href) return <Link className="link-red" href={href}>{label} →</Link>;
  return <button type="button" className="link-red" onClick={onClick}>{label} →</button>;
}

export function SelectedBar({ text, children, start, tight }: { text: ReactNode; children: ReactNode; start?: boolean; tight?: boolean }) {
  return <div className={`selbar ${start ? "start" : ""} ${tight ? "tight" : ""}`}><span>{text}</span><div className="btns">{children}</div></div>;
}

export function HBars({ items, red, max, compact }: { items: [string, number, string][]; red?: boolean; max?: number; compact?: boolean }) {
  const top = max ?? Math.max(...items.map((i) => i[1]));
  return (
    <div className={`hbars ${compact ? "compact" : ""}`}>
      {items.map(([label, v, display]) => (
        <div className="hbar" key={label}>
          <span>{label}</span>
          <div className="track"><div className={`fill ${red ? "red" : ""}`} style={{ width: `${Math.max(2, (v / top) * 100)}%` }} /></div>
          <span className="val">{display}</span>
        </div>
      ))}
    </div>
  );
}

export function Donut({ parts, center, size = 170 }: { parts: [number, string][]; center: ReactNode; size?: number }) {
  const total = parts.reduce((s, p) => s + p[0], 0);
  const ends = parts.reduce<number[]>((a, [v]) => [...a, (a[a.length - 1] ?? 0) + v], []);
  const stops = parts.map(([v, c], i) => `${c} ${((ends[i] - v) / total) * 360}deg ${(ends[i] / total) * 360}deg`).join(", ");
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto", borderRadius: "50%", background: `conic-gradient(${stops})` }}>
      <div style={{ position: "absolute", inset: size * 0.19, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", textAlign: "center", fontWeight: 700, fontSize: 18, lineHeight: 1.15, color: "#1d1d1d" }}>{center}</div>
    </div>
  );
}

export function LineChart({ values, labels, color, fill, valueLabels, height = 170 }: { values: number[]; labels: string[]; color: string; fill: string; valueLabels?: string[]; height?: number }) {
  const W = 440, H = height, padX = 26, padTop = 30, padBottom = 26;
  const max = Math.max(...values), min = Math.min(0, ...values);
  const x = (i: number) => padX + (i * (W - padX * 2)) / (values.length - 1);
  const y = (v: number) => padTop + (1 - (v - min) / (max - min || 1)) * (H - padTop - padBottom);
  const line = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H + 16}`} width="100%" role="img" aria-label="Gráfico de linha">
      {[0, 1, 2].map((g) => <line key={g} x1={padX} x2={W - padX} y1={padTop + (g * (H - padTop - padBottom)) / 2} y2={padTop + (g * (H - padTop - padBottom)) / 2} stroke="#eee" />)}
      <polygon points={`${x(0)},${H - padBottom} ${line} ${x(values.length - 1)},${H - padBottom}`} fill={fill} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2.5" />
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r="4.5" fill={color} />
          <text x={x(i)} y={y(v) - 11} fontSize="12" textAnchor="middle" fill="#444">{valueLabels ? valueLabels[i] : v}</text>
          <text x={x(i)} y={H + 10} fontSize="12" textAnchor="middle" fill="#666">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- modais */
export function Modal({ title, subtitle, onClose, children, actions }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode; actions?: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><h2>{title}</h2>{subtitle ? <small>{subtitle}</small> : null}</div><button type="button" aria-label="Fechar" onClick={onClose}>×</button></div>
        <div className="modal-body">{children}</div>
        {actions ? <div className="modal-actions">{actions}</div> : null}
      </section>
    </div>
  );
}

export function DetailModal({ title, subtitle, data, onClose, actions }: { title: string; subtitle?: string; data: Record<string, ReactNode>; onClose: () => void; actions?: ReactNode }) {
  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose} actions={actions ?? <button className="btn btn-outline btn-sm" onClick={onClose}>Fechar</button>}>
      <dl className="detail">
        {Object.entries(data).map(([k, v]) => <div key={k} style={{ display: "contents" }}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </Modal>
  );
}

export function FormModal({ title, subtitle, fields, onClose, onSave, submitLabel = "Salvar" }: { title: string; subtitle?: string; fields: { label: string; placeholder?: string; value?: string; required?: boolean }[]; onClose: () => void; onSave: (values: Record<string, string>) => void; submitLabel?: string }) {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    fields.forEach((f) => { values[f.label] = String(fd.get(f.label) ?? ""); });
    onSave(values);
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><h2>{title}</h2>{subtitle ? <small>{subtitle}</small> : null}</div><button type="button" aria-label="Fechar" onClick={onClose}>×</button></div>
        <form onSubmit={submit}>
          <div className="modal-body">
            {fields.map((f) => (
              <label className="field" key={f.label}>
                <span>{f.label}</span>
                <div className="control"><input name={f.label} placeholder={f.placeholder} defaultValue={f.value} required={f.required} /></div>
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-gold btn-sm">{submitLabel}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
