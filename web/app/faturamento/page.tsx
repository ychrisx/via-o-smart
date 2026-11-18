"use client";

import { useMemo, useState } from "react";
import { Card, DateField, DetailModal, Farol, FilterInput, Icon, Kpi, PageHead, Pill, SelectField, SelectedBar, Shell, ViewAll, useToast, type Tone } from "../_components/ui";

type Pendente = { origem: "Contrato fixo" | "Eventual"; numero: string; cliente: string; servico: string; regra: string; valor: number };
type Fatura = { fatura: string; cliente: string; origem: string; emissao: string; vencimento: string; valor: number; nf: string; cobranca: string; financeiro: string; contaAzul: string; situacao: string };

const pendentesIniciais: Pendente[] = [
  { origem: "Contrato fixo", numero: "CT-2026-018", cliente: "Aeroporto GRU Serviços", servico: "Linha GRU · Nov/2026", regra: "Mensal fixo · vence dia 15", valor: 22900 },
  { origem: "Eventual", numero: "EV-2026-030", cliente: "Eventos Silva MEI", servico: "Viagem 25/10 · Campos do Jordão", regra: "100% até 7 dias antes", valor: 6840 },
  { origem: "Eventual", numero: "EV-2026-031", cliente: "Associação Vila Nova", servico: "Viagem 14/11 · Aparecida (sinal)", regra: "50% na reserva", valor: 2400 },
];

const faturasIniciais: Fatura[] = [
  { fatura: "FAT-2026-118", cliente: "Logística Cajamar Ltda", origem: "CT-2026-014", emissao: "01/11/2026", vencimento: "10/11/2026", valor: 48600, nf: "Emitida", cobranca: "Boleto enviado", financeiro: "Lançado", contaAzul: "Anexado", situacao: "Aguardando" },
  { fatura: "FAT-2026-117", cliente: "Logística Cajamar Ltda", origem: "CT-2026-009", emissao: "26/10/2026", vencimento: "05/11/2026", valor: 36200, nf: "Emitida", cobranca: "Boleto enviado", financeiro: "Lançado", contaAzul: "Anexado", situacao: "Atrasado 2 dias" },
  { fatura: "FAT-2026-116", cliente: "Indústria Barueri S.A.", origem: "CT-2026-019", emissao: "01/11/2026", vencimento: "20/11/2026", valor: 31400, nf: "Pendente", cobranca: "Não enviada", financeiro: "Lançado", contaAzul: "Pendente", situacao: "Aguardando" },
  { fatura: "FAT-2026-115", cliente: "Paulo Mendes", origem: "EV-2026-029", emissao: "10/10/2026", vencimento: "11/10/2026", valor: 2750, nf: "Emitida", cobranca: "Pix", financeiro: "Lançado", contaAzul: "Anexado", situacao: "Pago" },
  { fatura: "FAT-2026-114", cliente: "Ana Beatriz Rocha", origem: "OS-2026-098", emissao: "06/10/2026", vencimento: "13/10/2026", valor: 1350, nf: "Emitida", cobranca: "Boleto enviado", financeiro: "Lançado", contaAzul: "Anexado", situacao: "Atrasado 25 dias" },
];

const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
function tone(v: string): Tone {
  if (/atrasad/i.test(v)) return "red";
  if (/pendente|aguardando/i.test(v)) return "amber";
  if (/não enviada/i.test(v)) return "gray";
  return "green";
}

export default function FaturamentoPage() {
  const [pendentes, setPendentes] = useState(pendentesIniciais);
  const [faturas, setFaturas] = useState(faturasIniciais);
  const [query, setQuery] = useState("");
  const [periodo, setPeriodo] = useState("Novembro/2026");
  const [origem, setOrigem] = useState("Fixos, eventuais e OS");
  const [situacao, setSituacao] = useState("Todas");
  const [selected, setSelected] = useState("FAT-2026-118");
  const [view, setView] = useState<Fatura | null>(null);
  const [toast, showToast] = useToast();

  const q = query.trim().toLowerCase();
  const matchOrigem = (code: string) => origem === "Fixos, eventuais e OS" || (origem === "Fixos" && code.startsWith("CT")) || (origem === "Eventuais" && code.startsWith("EV")) || (origem === "Ordens de serviço" && code.startsWith("OS"));
  const pend = pendentes.filter((p) => matchOrigem(p.numero) && (!q || `${p.numero} ${p.cliente}`.toLowerCase().includes(q)));
  const fats = useMemo(() => faturas.filter((f) =>
    matchOrigem(f.origem) &&
    (situacao === "Todas" || f.situacao.toLowerCase().startsWith(situacao.toLowerCase().slice(0, 6))) &&
    (!q || `${f.fatura} ${f.cliente} ${f.origem}`.toLowerCase().includes(q)),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [faturas, situacao, q, origem]);
  const sel = faturas.find((f) => f.fatura === selected);
  const totalPendente = pendentes.reduce((s, p) => s + p.valor, 0);

  function gerar(p: Pendente) {
    const num = 119 + (faturas.length - faturasIniciais.length);
    const nova: Fatura = { fatura: `FAT-2026-${num}`, cliente: p.cliente, origem: p.numero, emissao: "18/11/2026", vencimento: p.origem === "Contrato fixo" ? "15/12/2026" : "25/11/2026", valor: p.valor, nf: "Pendente", cobranca: "Não enviada", financeiro: "Lançado", contaAzul: "Pendente", situacao: "Aguardando" };
    setFaturas((f) => [nova, ...f]);
    setPendentes((list) => list.filter((x) => x.numero !== p.numero));
    setSelected(nova.fatura);
    showToast(`${nova.fatura} gerada e enviada ao Financeiro.`);
  }

  function salvarPdf(f: Fatura) {
    const w = window.open("", "_blank", "width=720,height=820");
    if (!w) { showToast("Permita pop-ups para salvar o PDF."); return; }
    w.document.write(`<html><head><title>${f.fatura}</title><style>body{font-family:Arial;padding:40px;color:#222}h1{color:#be3237}td{padding:6px 12px;border-bottom:1px solid #eee}</style></head><body><h1>Viação Smart</h1><h2>Fatura ${f.fatura}</h2><table>${Object.entries({ Cliente: f.cliente, Origem: f.origem, Emissão: f.emissao, Vencimento: f.vencimento, Valor: brl(f.valor), NF: f.nf, Situação: f.situacao }).map(([k, v]) => `<tr><td><b>${k}</b></td><td>${v}</td></tr>`).join("")}</table></body></html>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <Shell toast={toast}>
      <PageHead
        title="Faturamento"
        subtitle="O que está para faturar, o que já foi cobrado e o que entrou no financeiro. Ao gerar a fatura, o título vai para o Financeiro."
        hint="Farol: verde = pago · amarelo = aguardando pagamento · vermelho = em atraso."
      />

      <div className="kpis">
        <Kpi primary value={pendentes.length} label={`Para faturar · R$ ${totalPendente.toLocaleString("pt-BR")}`} />
        <Kpi dot="amber" value={faturas.filter((f) => f.situacao === "Aguardando").length + 4} label="Faturadas · aguardando pagamento" />
        <Kpi dot="red" value={2} label="Em atraso · R$ 37.550" />
        <Kpi dot="green" value={21} label="Pagas no mês" />
        <Kpi value={faturas.filter((f) => f.contaAzul === "Pendente").length} label="Não constado no conta azul ainda" />
      </div>

      <div className="filters" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1fr 1fr", gap: 24 }}>
        <FilterInput label="Filtrar · digite para buscar" placeholder="Fatura, cliente ou contrato." value={query} onChange={setQuery} />
        <DateField label="Período" value={periodo} onChange={setPeriodo} />
        <SelectField label="Origem" value={origem} options={["Fixos, eventuais e OS", "Fixos", "Eventuais", "Ordens de serviço"]} onChange={setOrigem} />
        <SelectField label="Situação" value={situacao} options={["Todas", "Aguardando", "Atrasado", "Pago"]} onChange={setSituacao} />
      </div>

      <Card title="Para faturar · vindos de Contratos e de Fretamentos eventuais" right={<span className="head-badge">{pendentes.length} pendentes</span>} style={{ marginBottom: 14 }}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Origem</th><th>Nº</th><th>Cliente</th><th>Serviço · competência</th><th>Regra de faturamento</th><th>Valor</th><th /></tr></thead>
            <tbody>
              {pend.map((p) => (
                <tr key={p.numero}>
                  <td><Pill tone={p.origem === "Eventual" ? "blue" : "gray"}>{p.origem}</Pill></td>
                  <td>{p.numero}</td><td>{p.cliente}</td><td>{p.servico}</td><td>{p.regra}</td><td>{brl(p.valor)}</td>
                  <td className="right"><button type="button" className="btn btn-gold" onClick={() => gerar(p)}>Gerar fatura</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!pend.length && <div className="empty">Nada pendente para faturar.</div>}
        </div>
      </Card>
      <p className="note-line" style={{ margin: "0 0 30px" }}><Icon name="lock" size={17} /> O valor segue a regra do contrato ou do orçamento aprovado. Ajuste manual exige a senha master e fica no histórico.</p>

      <Card title="Faturas emitidas" right={<Farol g={21} a={6} r={2} />} footer={<ViewAll label="Ver todas as 29 faturas" onClick={() => { setSituacao("Todas"); setQuery(""); }} />}>
        <div className="tbl-wrap">
          <table className="tbl tbl-xs hover">
            <thead><tr><th>Fatura</th><th>Cliente</th><th>Origem</th><th>Emissão</th><th>Vencimento</th><th>Valor</th><th>NF</th><th>Cobrança</th><th>Financeiro</th><th>Conta Azul</th><th>Situação</th></tr></thead>
            <tbody>
              {fats.map((f) => (
                <tr key={f.fatura} className={f.fatura === selected ? "sel" : ""} onClick={() => setSelected(f.fatura)}>
                  <td>{f.fatura}</td><td>{f.cliente}</td><td>{f.origem}</td><td>{f.emissao}</td><td>{f.vencimento}</td><td>{brl(f.valor)}</td>
                  <td><Pill tone={tone(f.nf)}>{f.nf}</Pill></td>
                  <td><Pill tone={tone(f.cobranca)}>{f.cobranca}</Pill></td>
                  <td><Pill tone={tone(f.financeiro)}>{f.financeiro}</Pill></td>
                  <td><Pill tone={tone(f.contaAzul)}>{f.contaAzul}</Pill></td>
                  <td><Pill tone={tone(f.situacao)}>{f.situacao}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!fats.length && <div className="empty">Nenhuma fatura com esses filtros.</div>}
        </div>
      </Card>

      {sel && (
        <SelectedBar start text={`Selecionada: ${sel.fatura} · ${sel.cliente} · ${brl(sel.valor)}`}>
          <button type="button" className="btn btn-outline btn-lg" onClick={() => setView(sel)}><Icon name="eye" /> Ver fatura</button>
          <button type="button" className="btn btn-outline btn-lg" onClick={() => salvarPdf(sel)}><Icon name="download" /> Salvar PDF</button>
        </SelectedBar>
      )}

      {view && <DetailModal title={view.fatura} subtitle={view.cliente} data={{ Origem: view.origem, Emissão: view.emissao, Vencimento: view.vencimento, Valor: brl(view.valor), NF: view.nf, Cobrança: view.cobranca, Financeiro: view.financeiro, "Conta Azul": view.contaAzul, Situação: view.situacao }} onClose={() => setView(null)} />}
    </Shell>
  );
}
