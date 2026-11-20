"use client";

import { useMemo, useState } from "react";
import { Farol, Modal, PageHead, SearchBar, Segmented, SelectField, Shell, useToast } from "../_components/ui";

type Tipo = "fixo" | "eventual";
type Bar = { label: string; tipo: Tipo; from: number; to: number; conflito?: boolean; veiculo: string };
type Linha = { motorista: string; bars: Bar[] };
type Aberta = { id: string; titulo: string; detalhe: string; tipo: Tipo; from: number; to: number; dia: string; veiculo: string };

const START = 4, END = 22; // janela do dia
const hours = [5, 7, 9, 11, 13, 15, 17, 19, 21];

const linhasIniciais: Linha[] = [
  { motorista: "Anderson Lopes", bars: [{ label: "Fixo · Alphaville", tipo: "fixo", from: 14.5, to: 19, veiculo: "Ônibus 204" }] },
  { motorista: "Carlos Almeida", bars: [{ label: "Fixo · Cajamar", tipo: "fixo", from: 14, to: 18.5, veiculo: "Ônibus 204" }] },
  { motorista: "Fernanda Costa", bars: [{ label: "Eventual · Campos do Jordão", tipo: "eventual", from: 5.5, to: 13.5, veiculo: "Ônibus Turismo 09" }] },
  { motorista: "João Pereira", bars: [{ label: "Fixo · Osasco", tipo: "fixo", from: 14.5, to: 17.5, veiculo: "Ônibus 245" }] },
  { motorista: "Marcos Souza", bars: [{ label: "Fixo · Barueri", tipo: "fixo", from: 5, to: 8.5, veiculo: "Ônibus 187" }, { label: "Fixo · Jundiaí", tipo: "fixo", from: 14.5, to: 18.5, veiculo: "Ônibus 112" }] },
  { motorista: "Renata Lima", bars: [{ label: "Eventual · GRU", tipo: "eventual", from: 6, to: 11, veiculo: "Ônibus 231" }, { label: "CONFLITO · Fixo · Cotia", tipo: "fixo", from: 9.5, to: 13.5, conflito: true, veiculo: "Van 18" }] },
  { motorista: "Paulo Dias", bars: [{ label: "Fixo · Embu", tipo: "fixo", from: 14.5, to: 19.5, veiculo: "Van 21" }] },
  { motorista: "Luciana Prado", bars: [{ label: "Eventual · Santos", tipo: "eventual", from: 13.5, to: 17.5, veiculo: "Micro 35" }] },
];

const abertasIniciais: Aberta[] = [
  { id: "a1", titulo: "Eventual · SP → Aparecida", detalhe: "23/10 · 07:00–19:00 · Ônibus Turismo", tipo: "eventual", from: 7, to: 19, dia: "23/10", veiculo: "Ônibus Turismo 07" },
  { id: "a2", titulo: "Fixo · Cotia → Embu (reforço)", detalhe: "23/10 · 14:30–19:00 · Van", tipo: "fixo", from: 14.5, to: 19, dia: "23/10", veiculo: "Van 12" },
  { id: "a3", titulo: "Eventual · Campinas → Viracopos", detalhe: "24/10 · 05:30–09:00 · Van", tipo: "eventual", from: 5.5, to: 9, dia: "24/10", veiculo: "Van 15" },
];

/** Motoristas sem nenhuma escala no dia (não aparecem na grade até receberem uma). */
const reservas = ["Ana Paula Reis", "Diego Martins"];

const pct = (h: number) => ((h - START) / (END - START)) * 100;
const free = (l: Linha, from: number, to: number) => l.bars.every((b) => b.to <= from || b.from >= to);

export default function ProgramacaoPage() {
  const [linhas, setLinhas] = useState(linhasIniciais);
  const [abertas, setAbertas] = useState(abertasIniciais);
  const [query, setQuery] = useState("");
  const [motorista, setMotorista] = useState("Todos");
  const [veiculo, setVeiculo] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [visao, setVisao] = useState("Dia");
  const [livres, setLivres] = useState("Só livres");
  const [assoc, setAssoc] = useState<Aberta | null>(null);
  const [escolhido, setEscolhido] = useState("");
  const [toast, showToast] = useToast();

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => linhas
    .filter((l) => motorista === "Todos" || l.motorista === motorista)
    .map((l) => ({ ...l, bars: l.bars.filter((b) => (tipo === "Todos" || (tipo === "Fixos" ? b.tipo === "fixo" : b.tipo === "eventual")) && (veiculo === "Todos" || b.veiculo === veiculo)) }))
    .filter((l) => (!q || `${l.motorista} ${l.bars.map((b) => `${b.label} ${b.veiculo}`).join(" ")}`.toLowerCase().includes(q)) && (veiculo === "Todos" || l.bars.length)),
  [linhas, motorista, veiculo, tipo, q]);

  const conflitos = linhas.filter((l) => l.bars.some((b) => b.conflito));
  const farol = { g: linhas.length, a: abertas.filter((a) => a.dia === "23/10").length, r: conflitos.length };
  const pool: Linha[] = [...linhas, ...reservas.filter((r) => !linhas.some((l) => l.motorista === r)).map((motorista) => ({ motorista, bars: [] }))];
  const candidatos = assoc ? pool.filter((l) => (livres === "Só livres" ? free(l, assoc.from, assoc.to) : true)) : [];

  function abrirAssociar(a: Aberta) {
    setAssoc(a);
    const first = linhas.find((l) => free(l, a.from, a.to)) ?? { motorista: reservas.find((r) => !linhas.some((l) => l.motorista === r)) ?? "" };
    setEscolhido(first?.motorista ?? "");
  }

  function confirmar() {
    if (!assoc || !escolhido) return;
    const destino = assoc.titulo.split(" · ")[1].split(" → ").pop()?.replace(" (reforço)", "") ?? "";
    if (assoc.dia === "23/10") {
      const bar: Bar = { label: `${assoc.tipo === "fixo" ? "Fixo" : "Eventual"} · ${destino}`, tipo: assoc.tipo, from: assoc.from, to: assoc.to, veiculo: assoc.veiculo };
      setLinhas((ls) => (ls.some((l) => l.motorista === escolhido) ? ls.map((l) => (l.motorista === escolhido ? { ...l, bars: [...l.bars, bar] } : l)) : [...ls, { motorista: escolhido, bars: [bar] }]));
    }
    setAbertas((as) => as.filter((x) => x.id !== assoc.id));
    showToast(`${escolhido} associado a ${assoc.titulo}.`);
    setAssoc(null);
  }

  function resolverConflito() {
    const alvo = linhas.find((l) => l.motorista !== "Renata Lima" && free(l, 9.5, 13.5));
    if (!alvo) return showToast("Nenhum motorista livre entre 10:00 e 13:30.");
    setLinhas((ls) => ls.map((l) => {
      if (l.motorista === "Renata Lima") return { ...l, bars: l.bars.filter((b) => !b.conflito) };
      if (l.motorista === alvo.motorista) return { ...l, bars: [...l.bars, { label: "Fixo · Cotia", tipo: "fixo", from: 10, to: 13.5, veiculo: "Van 18" }] };
      return l;
    }));
    showToast(`Fixo · Cotia passou para ${alvo.motorista}. Conflito resolvido.`);
  }

  return (
    <Shell toast={toast}>
      <PageHead
        title="Programação"
        subtitle="Programe as escalas futuras e associe escalas em aberto a motoristas livres, sem conflito de horário."
        hint="Barras: vermelho = fretamento fixo · dourado = eventual · preto com contorno = conflito de horário."
      />
      <SearchBar placeholder="Buscar motorista, veículo, cliente, escala..." value={query} onChange={setQuery} width={572} />

      <div className="prog-filters">
        <SelectField label="Motorista" value={motorista} options={["Todos", ...linhasIniciais.map((l) => l.motorista)]} onChange={setMotorista} />
        <SelectField label="Veículo" value={veiculo} options={["Todos", ...Array.from(new Set(linhasIniciais.flatMap((l) => l.bars.map((b) => b.veiculo))))]} onChange={setVeiculo} />
        <Segmented variant="boxed" showLabel label="Tipo" options={["Fixos", "Eventuais", "Todos"]} value={tipo} onChange={setTipo} />
        <Segmented variant="boxed" showLabel label="Visão" options={["Dia", "Semana", "Mês"]} value={visao} onChange={(v) => { setVisao(v); if (v !== "Dia") showToast(`Visão por ${v.toLowerCase()} mostra a mesma grade agrupada por dia.`); }} />
        <SelectField label="Motoristas livres" value={livres} options={["Só livres", "Todos"]} onChange={setLivres} />
      </div>

      <div className="prog-layout">
        <div>
          <h3>Escalas em aberto</h3>
          {abertas.map((a) => (
            <div key={a.id} className={`open-scale ${a.tipo === "fixo" ? "fixo" : ""}`}>
              <strong>{a.titulo}</strong>
              <span>{a.detalhe}</span>
              <button type="button" className="btn btn-gold btn-sm" onClick={() => abrirAssociar(a)}>Associar motorista</button>
            </div>
          ))}
          {!abertas.length && <p style={{ color: "#666", fontSize: 14 }}>Nenhuma escala em aberto.</p>}
          {conflitos.length > 0 && (
            <div className="conflict-box">
              <b>Conflito detectado:</b> Renata Lima está em dois serviços entre 10:00 e 11:00. Escolha outro motorista livre para um deles.
            </div>
          )}
        </div>

        <section className="card" style={{ marginBottom: 0 }}>
          <div className="card-head" style={{ minHeight: 54 }}><h2 style={{ fontSize: 17 }}>Sexta-feira, 23/10/2026</h2><Farol g={farol.g} a={farol.a} r={farol.r} /></div>
          <div className="timeline">
            <div className="tl-hours"><span /><div className="tl-track">{hours.map((h) => <span key={h} className="tick" style={{ left: `${pct(h)}%` }}>{String(h).padStart(2, "0")}:00</span>)}</div></div>
            {visible.map((l) => (
              <div className="tl-row" key={l.motorista}>
                <span>{l.motorista}</span>
                <div className="tl-track">
                  {l.bars.map((b) => (
                    <button
                      type="button"
                      key={b.label}
                      className={`tl-bar ${b.conflito ? "conflito" : b.tipo}`}
                      style={{ left: `${pct(b.from)}%`, width: `${pct(b.to) - pct(b.from)}%` }}
                      title={`${b.conflito ? "Clique para passar a um motorista livre · " : ""}${b.label} · ${b.veiculo} · ${String(Math.floor(b.from)).padStart(2, "0")}:${b.from % 1 ? "30" : "00"}–${String(Math.floor(b.to)).padStart(2, "0")}:${b.to % 1 ? "30" : "00"}`}
                      onClick={() => (b.conflito ? resolverConflito() : showToast(`${l.motorista} · ${b.label} · ${b.veiculo}`))}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!visible.length && <div className="empty">Nenhuma escala com esses filtros.</div>}
          </div>
        </section>
      </div>

      {assoc && (
        <Modal title="Associar motorista" subtitle={`${assoc.titulo} · ${assoc.detalhe}`} onClose={() => setAssoc(null)}
          actions={<><button type="button" className="btn btn-outline btn-sm" onClick={() => setAssoc(null)}>Cancelar</button><button type="button" className="btn btn-gold btn-sm" disabled={!escolhido} onClick={confirmar}>Associar</button></>}>
          {candidatos.length ? (
            <SelectField label={livres === "Só livres" ? "Motoristas livres nesse horário" : "Motoristas"} value={escolhido} options={candidatos.map((c) => c.motorista)} onChange={setEscolhido} />
          ) : <p style={{ margin: 0 }}>Nenhum motorista livre nesse horário.</p>}
        </Modal>
      )}
    </Shell>
  );
}
