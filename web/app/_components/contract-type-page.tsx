"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Card, DateField, DetailModal, Farol, FilterInput, FormModal, Icon, Kpi, PageHead, Pill, SearchBar, SelectField, SelectedBar, Shell, ViewAll, useToast, type Tone } from "./ui";

export type CtRow = { id: string; cells: Record<string, ReactNode>; text: string; status: string; tipo: string; execucao: string; selectedText: string; detail: Record<string, string> };
export type CtKpi = { value: ReactNode; label: string; primary?: boolean; redNumber?: boolean; filter?: string };

export default function ContractTypePage({
  title, subtitle, hint, kpis, filterPlaceholder, periodo, statusOptions, tipoOptions, execOptions, newLabel, note, cardTitle, farol, columns, rows: initial, total, totalLabel, newFields, buildRow, extraButton,
}: {
  title: string; subtitle: string; hint: string; kpis: CtKpi[]; filterPlaceholder: string; periodo: string;
  statusOptions: string[]; tipoOptions: string[]; execOptions: string[]; newLabel: string; note: string; cardTitle: string;
  farol: [number, number, number]; columns: { key: string; label: string }[]; rows: CtRow[]; total: number; totalLabel: string;
  newFields: { label: string; value?: string; placeholder?: string; required?: boolean }[]; buildRow: (v: Record<string, string>, n: number) => CtRow; extraButton: { label: string; icon: string };
}) {
  const [rows, setRows] = useState(initial);
  const [global, setGlobal] = useState("");
  const [query, setQuery] = useState("");
  const [per, setPer] = useState(periodo);
  const [status, setStatus] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [exec, setExec] = useState(execOptions[0]);
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState(initial[1]?.id ?? initial[0]?.id);
  const [modal, setModal] = useState<"novo" | "editar" | "ver" | null>(null);
  const [toast, showToast] = useToast();

  const visible = useMemo(() => {
    const q = `${global} ${query}`.trim().toLowerCase();
    return rows.filter((r) =>
      (status === "Todos" || r.status === status) &&
      (tipo === "Todos" || r.tipo === tipo) &&
      (exec === execOptions[0] || r.execucao === exec) &&
      (!kpiFilter || r.status === kpiFilter) &&
      (!q || q.split(" ").every((w) => r.text.toLowerCase().includes(w))),
    );
  }, [rows, global, query, status, tipo, exec, kpiFilter, execOptions]);
  const sel = rows.find((r) => r.id === selected);

  return (
    <Shell toast={toast}>
      <PageHead title={title} subtitle={subtitle} hint={hint} />
      <SearchBar placeholder="Buscar cliente, motorista, veículo, contrato..." value={global} onChange={setGlobal} />

      <div className={`kpis ${kpis.length === 4 ? "k4-left" : ""}`}>
        {kpis.map((k) => (
          <Kpi key={k.label} value={k.value} label={k.label} redNumber={k.redNumber}
            active={kpiFilter ? kpiFilter === k.filter : k.primary}
            onClick={k.filter ? () => setKpiFilter(kpiFilter === k.filter ? null : k.filter!) : undefined} />
        ))}
      </div>

      <div className="filters" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr", gap: 26 }}>
        <FilterInput label="Filtrar · digite para buscar" placeholder={filterPlaceholder} value={query} onChange={setQuery} />
        <DateField label="Período" value={per} onChange={setPer} />
        <SelectField label="Status" value={status} options={["Todos", ...statusOptions]} onChange={setStatus} />
        <SelectField label="Tipo" value={tipo} options={["Todos", ...tipoOptions]} onChange={setTipo} />
        <SelectField label="Execução" value={exec} options={execOptions} onChange={setExec} />
      </div>

      <div className="actions">
        <button type="button" className="btn btn-gold btn-lg" onClick={() => setModal("novo")}><Icon name="plus" /> {newLabel}</button>
        <button type="button" className="btn btn-outline btn-lg" style={{ minWidth: 118 }} onClick={() => (sel ? setModal("editar") : showToast("Selecione um registro."))}>Editar</button>
        <span className="note">{note}</span>
      </div>

      <Card title={cardTitle} right={<Farol g={farol[0]} a={farol[1]} r={farol[2]} />} footer={<ViewAll label={`Ver todos os ${total} ${totalLabel}`} onClick={() => { setQuery(""); setGlobal(""); setStatus("Todos"); setTipo("Todos"); setKpiFilter(null); }} />}>
        <div className="tbl-wrap">
          <table className="tbl tbl-sm hover">
            <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className={r.id === selected ? "sel" : ""} onClick={() => setSelected(r.id)} onDoubleClick={() => { setSelected(r.id); setModal("ver"); }}>
                  {columns.map((c) => <td key={c.key}>{r.cells[c.key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <div className="empty">Nenhum registro com esses filtros.</div>}
        </div>
      </Card>

      {sel && (
        <SelectedBar tight text={sel.selectedText}>
          <button type="button" className="btn btn-outline" onClick={() => { navigator.clipboard?.writeText(Object.entries(sel.detail).map(([k, v]) => `${k}: ${v}`).join("\n")); showToast(extraButton.label === "Copiar estrutura" ? `Estrutura de ${sel.id} copiada. Use em “${newLabel}”.` : `${extraButton.label}: ${sel.id}`); }}><Icon name={extraButton.icon} /> {extraButton.label}</button>
          <button type="button" className="btn btn-outline" onClick={() => setModal("ver")}><Icon name="eye" /> Visualizar</button>
          <button type="button" className="btn btn-gold" onClick={() => setModal("ver")}>Abrir etapas</button>
        </SelectedBar>
      )}

      {modal === "ver" && sel && <DetailModal title={sel.id} subtitle={title} data={sel.detail} onClose={() => setModal(null)} />}
      {modal === "novo" && (
        <FormModal title={newLabel} fields={newFields} onClose={() => setModal(null)} submitLabel="Salvar"
          onSave={(v) => { const r = buildRow(v, rows.length - initial.length); setRows((p) => [r, ...p]); setSelected(r.id); setModal(null); showToast(`${r.id} criado.`); }} />
      )}
      {modal === "editar" && sel && (
        <FormModal title={`Editar ${sel.id}`} fields={[{ label: "Status", value: sel.status }]} onClose={() => setModal(null)}
          onSave={(v) => {
            const st = statusOptions.find((s) => s.toLowerCase() === v.Status.trim().toLowerCase()) ?? sel.status;
            setRows((p) => p.map((r) => (r.id === sel.id ? { ...r, status: st, cells: { ...r.cells, situacao: <Pill tone={statusTone(st)}>{st}</Pill> }, detail: { ...r.detail, Situação: st } } : r)));
            setModal(null); showToast(`${sel.id} atualizado.`);
          }} />
      )}
    </Shell>
  );
}

export function statusTone(s: string): Tone {
  if (/inativ/i.test(s)) return "gray";
  if (/atras|cancel/i.test(s)) return "red";
  if (/realizado|ativo|faturado|lançado/i.test(s)) return "green";
  return "amber";
}
