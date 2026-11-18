"use client";

import { useMemo, useState } from "react";
import { Card, DateField, DetailModal, FormModal, Icon, PageHead, Pill, SelectField, SelectedBar, Shell, dateKey, useToast, type Tone } from "../_components/ui";

type Contrato = { numero: string; cliente: string; tipo: "Fretamento fixo" | "Fretamento eventual" | "Ordem de serviço"; inicio: string; termino: string; valor: number; situacao: "Ativo" | "Agendado" | "Concluído" };

const iniciais: Contrato[] = [
  { numero: "CT-2026-014", cliente: "Logística Cajamar Ltda", tipo: "Fretamento fixo", inicio: "01/03/2026", termino: "28/02/2027", valor: 48600, situacao: "Ativo" },
  { numero: "CT-2026-009", cliente: "Logística Cajamar Ltda", tipo: "Fretamento fixo", inicio: "01/02/2026", termino: "31/01/2027", valor: 36200, situacao: "Ativo" },
  { numero: "CT-2026-021", cliente: "Associação Vila Nova", tipo: "Fretamento eventual", inicio: "24/10/2026", termino: "24/10/2026", valor: 4800, situacao: "Agendado" },
  { numero: "CT-2026-018", cliente: "Aeroporto GRU Serviços", tipo: "Fretamento fixo", inicio: "01/06/2026", termino: "31/05/2027", valor: 22900, situacao: "Ativo" },
  { numero: "OS-2026-098", cliente: "Ana Beatriz Rocha", tipo: "Ordem de serviço", inicio: "12/10/2026", termino: "12/10/2026", valor: 1350, situacao: "Concluído" },
  { numero: "OS-2026-104", cliente: "Eventos Silva MEI", tipo: "Ordem de serviço", inicio: "25/10/2026", termino: "25/10/2026", valor: 2100, situacao: "Agendado" },
  { numero: "CT-2026-019", cliente: "Indústria Barueri S.A.", tipo: "Fretamento fixo", inicio: "15/05/2026", termino: "14/05/2027", valor: 31400, situacao: "Ativo" },
  { numero: "CT-2026-020", cliente: "Paulo Mendes", tipo: "Fretamento eventual", inicio: "18/10/2026", termino: "18/10/2026", valor: 2750, situacao: "Concluído" },
];

const tone: Record<Contrato["situacao"], Tone> = { Ativo: "green", Agendado: "amber", Concluído: "gray" };
const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const tipos = ["Todos os tipos", "Fretamento fixo", "Fretamento eventual", "Ordem de serviço"];

export default function ContratosPage() {
  const [contratos, setContratos] = useState(iniciais);
  const [inicio, setInicio] = useState("01/10/2026");
  const [fim, setFim] = useState("31/10/2026");
  const [tipo, setTipo] = useState("Todos os tipos");
  const [selected, setSelected] = useState("CT-2026-014");
  const [modal, setModal] = useState<"novo" | "editar" | "ver" | null>(null);
  const [toast, showToast] = useToast();

  const rows = useMemo(() => {
    const a = dateKey(inicio), b = dateKey(fim);
    return contratos.filter((c) => {
      const ci = dateKey(c.inicio), cf = dateKey(c.termino);
      const inRange = (isNaN(a) || cf >= a) && (isNaN(b) || ci <= b); // vigente em algum momento do período
      return inRange && (tipo === "Todos os tipos" || c.tipo === tipo);
    });
  }, [contratos, inicio, fim, tipo]);
  const sel = contratos.find((c) => c.numero === selected);

  function baixar(c: Contrato) {
    const txt = `VIAÇÃO SMART — CONTRATO ${c.numero}\n\nCliente: ${c.cliente}\nTipo: ${c.tipo}\nVigência: ${c.inicio} a ${c.termino}\nValor: ${brl(c.valor)}\nSituação: ${c.situacao}\n`;
    const url = URL.createObjectURL(new Blob([txt], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${c.numero}.txt`; a.click();
    URL.revokeObjectURL(url);
    showToast(`${c.numero} baixado.`);
  }

  return (
    <Shell toast={toast}>
      <PageHead title="Contratos" subtitle="Filtre por data e tipo e selecione um contrato." />

      <div className="filters" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <DateField label="Data inicial" value={inicio} onChange={setInicio} />
        <DateField label="Data final" value={fim} onChange={setFim} />
        <SelectField label="Tipo" value={tipo} options={tipos} onChange={setTipo} />
      </div>

      <div className="actions">
        <button type="button" className="btn btn-gold btn-lg" onClick={() => setModal("novo")}><Icon name="plus" /> Criar contrato</button>
        <button type="button" className="btn btn-outline btn-lg" onClick={() => (sel ? setModal("editar") : showToast("Selecione um contrato."))}><Icon name="edit" /> Editar contrato</button>
      </div>

      <Card title="Contratos" right={<span className="head-badge">{rows.length} resultados</span>}>
        <div className="tbl-wrap">
          <table className="tbl tbl-sm hover">
            <thead><tr><th>Número</th><th>Cliente</th><th>Tipo</th><th>Início</th><th>Término</th><th>Valor</th><th>Situação</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.numero} className={c.numero === selected ? "sel" : ""} onClick={() => setSelected(c.numero)} onDoubleClick={() => { setSelected(c.numero); setModal("ver"); }}>
                  <td>{c.numero}</td><td>{c.cliente}</td><td>{c.tipo}</td><td>{c.inicio}</td><td>{c.termino}</td><td>{brl(c.valor)}</td><td><Pill tone={tone[c.situacao]}>{c.situacao}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty">Nenhum contrato nesse período.</div>}
        </div>
      </Card>

      {sel && (
        <SelectedBar text={`Selecionado: ${sel.numero} · ${sel.cliente} · ${sel.tipo}`}>
          <button type="button" className="btn btn-outline btn-lg" onClick={() => setModal("ver")}><Icon name="eye" /> Visualizar</button>
          <button type="button" className="btn btn-gold btn-lg" onClick={() => baixar(sel)}><Icon name="download" /> Baixar</button>
        </SelectedBar>
      )}

      {modal === "ver" && sel && <DetailModal title={sel.numero} subtitle={sel.cliente} data={{ Tipo: sel.tipo, Início: sel.inicio, Término: sel.termino, Valor: brl(sel.valor), Situação: sel.situacao }} onClose={() => setModal(null)} />}
      {modal === "novo" && (
        <FormModal title="Criar contrato" fields={[{ label: "Cliente", required: true }, { label: `Tipo (${tipos.slice(1).join(", ")})`, value: "Fretamento fixo" }, { label: "Início (dd/mm/aaaa)", value: "01/11/2026", required: true }, { label: "Término (dd/mm/aaaa)", value: "31/10/2027", required: true }, { label: "Valor (R$)", placeholder: "Ex.: 12000" }]}
          onClose={() => setModal(null)}
          onSave={(v) => {
            const tk = Object.keys(v).find((k) => k.startsWith("Tipo"))!;
            const t = (tipos.slice(1).find((x) => x.toLowerCase() === v[tk].trim().toLowerCase()) ?? "Fretamento fixo") as Contrato["tipo"];
            const prefix = t === "Ordem de serviço" ? "OS" : "CT";
            const numero = `${prefix}-2026-${String(22 + contratos.length - iniciais.length).padStart(3, "0")}`;
            setContratos((p) => [{ numero, cliente: v.Cliente, tipo: t, inicio: v["Início (dd/mm/aaaa)"], termino: v["Término (dd/mm/aaaa)"], valor: Number(v["Valor (R$)"].replace(/\D/g, "")) || 0, situacao: "Agendado" }, ...p]);
            setSelected(numero); setModal(null); showToast(`${numero} criado.`);
          }} submitLabel="Criar contrato" />
      )}
      {modal === "editar" && sel && (
        <FormModal title={`Editar ${sel.numero}`} fields={[{ label: "Término (dd/mm/aaaa)", value: sel.termino, required: true }, { label: "Valor (R$)", value: String(sel.valor) }, { label: "Situação (Ativo, Agendado, Concluído)", value: sel.situacao }]}
          onClose={() => setModal(null)}
          onSave={(v) => {
            const s = (["Ativo", "Agendado", "Concluído"] as const).find((x) => x.toLowerCase() === v["Situação (Ativo, Agendado, Concluído)"].trim().toLowerCase()) ?? sel.situacao;
            setContratos((p) => p.map((c) => (c.numero === sel.numero ? { ...c, termino: v["Término (dd/mm/aaaa)"], valor: Number(v["Valor (R$)"].replace(/\D/g, "")) || c.valor, situacao: s } : c)));
            setModal(null); showToast(`${sel.numero} atualizado.`);
          }} />
      )}
    </Shell>
  );
}
