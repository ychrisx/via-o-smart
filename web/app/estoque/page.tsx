"use client";

import { useMemo, useState } from "react";
import { FilterInput, Modal, Pill, PageHead, SelectField, Shell, useToast } from "../_components/ui";

type Produto = { cod: string; nome: string; tipo: string; marcas: [string, number][]; unidade: string; min: number; max: number };

const iniciais: Produto[] = [
  { cod: "PN-0295", nome: "Pneu 295/80 R22.5", tipo: "Pneus", marcas: [["Goodyear", 8], ["Apollo", 2]], unidade: "un", min: 8, max: 24 },
  { cod: "FL-0110", nome: "Filtro de óleo", tipo: "Filtros", marcas: [["Mann", 30], ["Tecfil", 18]], unidade: "un", min: 20, max: 60 },
  { cod: "OL-1540", nome: "Óleo 15W40", tipo: "Lubrificantes", marcas: [["Lubrax", 24]], unidade: "baldes", min: 10, max: 30 },
  { cod: "FR-0032", nome: "Pastilha de freio", tipo: "Freios", marcas: [["Fras-le", 20], ["Cobreq", 12]], unidade: "jogos", min: 12, max: 40 },
  { cod: "EL-0007", nome: "Lâmpada de farol H7", tipo: "Elétrica", marcas: [["Osram", 40], ["Philips", 20]], unidade: "un", min: 30, max: 80 },
  { cod: "VD-0204", nome: "Para-brisa Torino", tipo: "Vidros", marcas: [["Vidroforte", 3]], unidade: "un", min: 4, max: 8 },
  { cod: "LP-0050", nome: "Detergente automotivo", tipo: "Limpeza", marcas: [["Limpa Brasil", 40]], unidade: "L", min: 20, max: 80 },
  { cod: "FL-0300", nome: "Fluido de arrefecimento", tipo: "Fluidos", marcas: [["Paraflu", 18]], unidade: "L", min: 20, max: 60 },
];

const total = (p: Produto) => p.marcas.reduce((s, m) => s + m[1], 0);
function situacao(p: Produto): { label: string; tone: "green" | "amber" | "red"; color: string } {
  const q = total(p);
  if (q < p.min) return { label: "Abaixo do mínimo", tone: "red", color: "var(--red)" };
  if (q <= p.min * 1.3) return { label: "Perto do mínimo", tone: "amber", color: "var(--gold)" };
  return { label: "Estoque ok", tone: "green", color: "#2f9e5c" };
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState(iniciais);
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState("Todos os tipos");
  const [marca, setMarca] = useState("Todas");
  const [sit, setSit] = useState("Todas");
  const [chip, setChip] = useState<"Todos" | "Abaixo do mínimo" | "Perto do mínimo">("Todos");
  const [selected, setSelected] = useState("PN-0295");
  const [mov, setMov] = useState<Produto | null>(null);
  const [qtd, setQtd] = useState(1);
  const [marcaMov, setMarcaMov] = useState("");
  const [toast, showToast] = useToast();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return produtos.filter((p) => {
      const s = situacao(p).label;
      return (tipo === "Todos os tipos" || p.tipo === tipo) &&
        (marca === "Todas" || p.marcas.some(([m]) => m === marca)) &&
        (sit === "Todas" || s === sit) &&
        (chip === "Todos" || s === chip) &&
        (!q || `${p.cod} ${p.nome} ${p.marcas.map((m) => m[0]).join(" ")}`.toLowerCase().includes(q));
    });
  }, [produtos, query, tipo, marca, sit, chip]);

  function movimentar(sinal: 1 | -1) {
    if (!mov) return;
    setProdutos((ps) => ps.map((p) => (p.cod === mov.cod ? { ...p, marcas: p.marcas.map(([m, n]) => [m, m === marcaMov ? Math.max(0, n + sinal * qtd) : n] as [string, number]) } : p)));
    showToast(`${sinal > 0 ? "Entrada" : "Saída"} de ${qtd} ${mov.unidade} · ${mov.nome} (${marcaMov}).`);
    setMov(null);
  }

  return (
    <Shell toast={toast}>
      <PageHead title="Estoque" subtitle={`${48 + produtos.length - iniciais.length} produtos diferentes no armazém.`} />

      <div className="filters" style={{ display: "grid", gridTemplateColumns: "1.85fr 1fr 1fr 1fr", gap: 26 }}>
        <FilterInput label="Buscar produto · filtra enquanto digita" placeholder="Nome, código próprio ou código do fornecedor" value={query} onChange={setQuery} />
        <SelectField label="Tipo de produto" value={tipo} options={["Todos os tipos", ...Array.from(new Set(iniciais.map((p) => p.tipo)))]} onChange={setTipo} />
        <SelectField label="Marca / fornecedor" value={marca} options={["Todas", ...Array.from(new Set(iniciais.flatMap((p) => p.marcas.map((m) => m[0]))))]} onChange={setMarca} />
        <SelectField label="Situação" value={sit} options={["Todas", "Estoque ok", "Perto do mínimo", "Abaixo do mínimo"]} onChange={setSit} />
      </div>

      <div className="stock-head-row">
        <div className="chips">
          {([["Todos", 48], ["Abaixo do mínimo", 2], ["Perto do mínimo", 5]] as const).map(([c, n]) => (
            <button key={c} type="button" className={`chip ${chip === c ? "on" : ""}`} onClick={() => setChip(c)} aria-pressed={chip === c}>{c} <b>{n}</b></button>
          ))}
        </div>
        <span className="note">Um cadastro por item. Marcas e códigos de fornecedores ficam dentro do item.</span>
      </div>

      <div className="stock-grid">
        {rows.map((p) => {
          const s = situacao(p);
          const q = total(p);
          return (
            <button
              type="button"
              key={p.cod}
              className={`stock ${selected === p.cod ? "sel" : ""}`}
              onClick={() => { if (selected === p.cod) { setMov(p); setMarcaMov(p.marcas[0][0]); setQtd(1); } else setSelected(p.cod); }}
              title={selected === p.cod ? "Clique para dar entrada ou saída" : "Clique para selecionar"}
            >
              <div className="stock-top"><span>Cód. <b>{p.cod}</b></span><Pill tone={s.tone}>{s.label}</Pill></div>
              <div className="stock-body">
                <h3>{p.nome}</h3>
                <div className="brands">{p.marcas.map(([m, n]) => `${m} ${n}`).join(" · ")}</div>
                <div className="stock-qty"><b>{q} {p.unidade}</b><span>mín {p.min} · máx {p.max}</span></div>
                <div className="stock-track"><i style={{ width: `${Math.min(100, (q / p.max) * 100)}%`, background: s.color }} /></div>
              </div>
            </button>
          );
        })}
      </div>
      {!rows.length && <div className="empty">Nenhum produto com esses filtros.</div>}

      {mov && (
        <Modal title={mov.nome} subtitle={`Cód. ${mov.cod} · ${total(mov)} ${mov.unidade} em estoque`} onClose={() => setMov(null)}
          actions={<><button type="button" className="btn btn-outline btn-sm" onClick={() => movimentar(-1)}>Registrar saída</button><button type="button" className="btn btn-gold btn-sm" onClick={() => movimentar(1)}>Registrar entrada</button></>}>
          <SelectField label="Marca / fornecedor" value={marcaMov} options={mov.marcas.map((m) => m[0])} onChange={setMarcaMov} />
          <label className="field"><span>Quantidade ({mov.unidade})</span><div className="control"><input type="number" min={1} value={qtd} onChange={(e) => setQtd(Math.max(1, Number(e.target.value) || 1))} /></div></label>
        </Modal>
      )}
    </Shell>
  );
}
