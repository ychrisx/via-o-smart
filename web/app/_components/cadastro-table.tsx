"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useLocationSearch } from "./use-location-search";
import { DetailModal, FilterInput, Icon, PageHead, Pill, SelectField, Shell, useToast, type Tone } from "./ui";

export type Light = "green" | "amber" | "red";
export type CadRow = { farol: Light; data: Record<string, string>; tones?: Record<string, Tone> };
export type CadColumn = { key: string; label: string; sortable?: boolean; strong?: boolean };
export type CadSelect = { label: string; column: string; all: string; options?: string[] };

const lightName: Record<Light, string> = { green: "Em dia", amber: "A vencer", red: "Vencidos" };
const lightParam: Record<string, Light> = { verde: "green", amarelo: "amber", vermelho: "red" };
const PAGE = 6;

export default function CadastroTable({
  title, subtitle, searchPlaceholder, selects, columns, rows, counts, lightLabels = lightName, defaultLights = ["amber", "red"]
}: {
  title: string;
  subtitle: ReactNode;
  searchPlaceholder: string;
  selects: CadSelect[];
  columns: CadColumn[];
  rows: CadRow[];
  counts: { green: number; amber: number; red: number; total: number };
  lightLabels?: Record<Light, string>;
  defaultLights?: Light[];
}) {
  const search = useLocationSearch();
  const params = new URLSearchParams(search);
  const urlBusca = params.get("busca");
  const urlFarol = params.get("farol") ?? "";
  const [userQuery, setQuery] = useState<string | null>(null);
  const [userLights, setUserLights] = useState<Light[] | null>(null);
  const query = userQuery ?? urlBusca ?? "";
  const defaultKey = defaultLights.join(",");
  const lights = useMemo<Light[]>(() => {
    if (userLights) return userLights;
    if (urlBusca) return ["green", "amber", "red"];
    const fromUrl = urlFarol.split(",").map((x) => lightParam[x]).filter(Boolean);
    return fromUrl.length ? fromUrl : (defaultKey.split(",") as Light[]);
  }, [userLights, urlBusca, urlFarol, defaultKey]);
  const openedByFarol = userLights === null && !urlBusca;
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() => Object.fromEntries(selects.map((s) => [s.column, s.all])));
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState<CadRow | null>(null);
  const [toast, showToast] = useToast();


  const all = rows;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = all.filter((r) =>
      lights.includes(r.farol) &&
      selects.every((s) => selectValues[s.column] === s.all || (r.data[s.column] ?? "").toLowerCase().includes(selectValues[s.column].toLowerCase())) &&
      (!q || Object.values(r.data).some((v) => v.toLowerCase().includes(q))),
    );
    if (sort) list = [...list].sort((a, b) => (a.data[sort.key] ?? "").localeCompare(b.data[sort.key] ?? "", "pt-BR", { numeric: true }) * sort.dir);
    return list;
  }, [all, lights, query, selects, selectValues, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pages - 1);
  const visible = filtered.slice(current * PAGE, current * PAGE + PAGE);
  const shownTotal = lights.length === 3 ? counts.total : lights.reduce((s, l) => s + counts[l], 0);

  function toggleLight(l: Light) {
    setPage(0);
    setUserLights(lights.includes(l) ? lights.filter((x) => x !== l) : [...lights, l]);
  }

  function exportCsv() {
    const header = columns.map((c) => c.label).join(";");
    const body = filtered.map((r) => columns.map((c) => `"${(r.data[c.key] ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob([`﻿${header}\n${body}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${title.toLowerCase()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast(`${filtered.length} registros exportados.`);
  }

  const lightsLabel = lights.map((l) => ({ green: "verde", amber: "amarelo", red: "vermelho" })[l]).join(" + ");

  return (
    <Shell toast={toast}>
      <PageHead crumb={<><Link href="/cadastros-gerais">Cadastros Gerais</Link> › {title}</>} title={title} subtitle={subtitle} />

      <div className="filters" style={{ display: "grid", gridTemplateColumns: `1.3fr ${selects.map(() => "1fr").join(" ")}`, gap: 26 }}>
        <FilterInput label="Filtrar nesta tabela · digite para buscar" placeholder={searchPlaceholder} value={query} onChange={(v) => { setQuery(v); setPage(0); }} />
        {selects.map((s) => {
          const options = s.options ?? Array.from(new Set(rows.map((r) => r.data[s.column]).filter((v) => v && v !== "—")));
          return <SelectField key={s.column} label={s.label} value={selectValues[s.column]} options={[s.all, ...options]} onChange={(v) => { setSelectValues((p) => ({ ...p, [s.column]: v })); setPage(0); }} />;
        })}
      </div>

      <div className="chips" style={{ marginBottom: 34 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#3a3a3a" }}>Farol:</span>
        {(["green", "amber", "red"] as Light[]).map((l) => (
          <button key={l} type="button" className={`chip ${lights.includes(l) && lights.length < 3 ? "on" : ""}`} aria-pressed={lights.includes(l)} onClick={() => toggleLight(l)}>
            <i className={`dot dot-${l}`} /> {lightLabels[l]} <b>{counts[l]}</b>
          </button>
        ))}
        <button type="button" className={`chip ${lights.length === 3 ? "on" : ""}`} onClick={() => { setUserLights(["green", "amber", "red"]); setPage(0); }}>
          Todos <b>{counts.total}</b>
        </button>
        {openedByFarol && lights.length < 3 && <span style={{ color: "#555", fontSize: 13, marginLeft: 16 }}>Aberto pelo farol da caixa {title} ({lightsLabel})</span>}
      </div>

      <section className="card" style={{ marginBottom: 30 }}>
        <div className="card-head">
          <h2>{title} · {Math.min(filtered.length, shownTotal)} de {counts.total}</h2>
          <div className="right">
            <button type="button" className="head-badge" onClick={exportCsv}>Exportar</button>
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl hover">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>
                    {c.sortable ? (
                      <button type="button" className="sort" style={{ border: 0, padding: 0, background: "none", color: "inherit", fontWeight: 600 }} onClick={() => setSort((s) => (s?.key === c.key ? { key: c.key, dir: s.dir === 1 ? -1 : 1 } : { key: c.key, dir: 1 }))}>
                        {c.label} <Icon name="sort" size={14} />
                      </button>
                    ) : c.label}
                  </th>
                ))}
                <th aria-label="Abrir" />
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={`${Object.values(r.data)[0]}-${i}`} onClick={() => setDetail(r)}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.strong ? "strong" : ""}>{r.tones?.[c.key] ? <Pill tone={r.tones[c.key]}>{r.data[c.key]}</Pill> : r.data[c.key]}</td>
                  ))}
                  <td className="right"><button type="button" className="link-red" style={{ fontSize: 14 }} onClick={(e) => { e.stopPropagation(); setDetail(r); }}>Abrir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <div className="empty">Nenhum registro com esses filtros.</div>}
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span style={{ color: "#555", fontSize: 14 }}>Mostrando {visible.length} de {counts.total} · ordenado por {sort ? columns.find((c) => c.key === sort.key)?.label.toLowerCase() : "vencimento"}</span>
        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" className="btn btn-sm" style={{ minWidth: 40, border: `1px solid ${i === current ? "var(--red)" : "var(--input-line)"}`, color: i === current ? "var(--red)" : "#333", background: "#fff" }} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button type="button" className="btn btn-sm" style={{ border: "1px solid var(--input-line)", background: "#fff" }} onClick={() => setPage(current + 1 < pages ? current + 1 : current)} disabled={current + 1 >= pages}>Próxima <Icon name="arrow" size={16} /></button>
        </div>
      </div>

      {detail && <DetailModal title={Object.values(detail.data)[0]} subtitle={title} data={detail.data} onClose={() => setDetail(null)} />}
    </Shell>
  );
}
