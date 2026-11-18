"use client";

import { useState } from "react";
import { Card, DetailModal, Farol, PageHead, Pill, SearchBar, Shell, ViewAll, type Tone } from "../_components/ui";

const ocorrencias = [
  { data: "21/10/2026", pessoa: "Carlos Almeida", depto: "Operação", tipo: "Atraso · trânsito", situacao: "Registrado" },
  { data: "17/10/2026", pessoa: "Marcos Souza", depto: "Operação", tipo: "Advertência", situacao: "Em análise" },
  { data: "10/10/2026", pessoa: "Carlos Almeida", depto: "Operação", tipo: "Atestado médico", situacao: "Aprovado" },
  { data: "08/10/2026", pessoa: "Ana Paula Reis", depto: "Financeiro", tipo: "Férias", situacao: "Aprovado" },
  { data: "02/10/2026", pessoa: "Carlos Almeida", depto: "Operação", tipo: "Elogio", situacao: "Registrado" },
];
const departamentos = [
  { depto: "Operação", membros: 12, satisfacao: "Boa · 82%", abertas: 2 },
  { depto: "Manutenção", membros: 8, satisfacao: "Regular · 64%", abertas: 1 },
  { depto: "RH", membros: 4, satisfacao: "Boa · 88%", abertas: 0 },
  { depto: "Financeiro", membros: 5, satisfacao: "Boa · 79%", abertas: 0 },
  { depto: "Comercial", membros: 3, satisfacao: "Baixa · 48%", abertas: 1 },
];
const preventivos = [
  { plano: "Apólice 8841 · frota", empresa: "Seguradora Horizonte", venc: "31/01/2027", pagamento: "Pago" },
  { plano: "Apólice 7710", empresa: "Proteção Total Seguros", venc: "30/04/2027", pagamento: "A vencer" },
  { plano: "Apólice 9020 · vans", empresa: "Seguradora Horizonte", venc: "15/11/2026", pagamento: "Vence em 8 dias" },
  { plano: "Revisão 150 mil km", empresa: "Mecânica Paulista", venc: "14/11/2026", pagamento: "A pagar" },
];
const documentos = [
  { doc: "CNH D · Marcos Souza", vinculo: "Motorista", validade: "02/11/2026", situacao: "Vencido" },
  { doc: "CRLV · Van 15", vinculo: "Veículo · FQW-7A52", validade: "30/11/2026", situacao: "A vencer" },
  { doc: "Licença de fretamento", vinculo: "Empresa", validade: "31/12/2026", situacao: "A vencer" },
  { doc: "Exame · Renata Lima", vinculo: "Motorista", validade: "15/01/2027", situacao: "Válido" },
  { doc: "Contrato CT-2026-014", vinculo: "Cliente", validade: "28/02/2027", situacao: "Válido" },
];

function tone(v: string): Tone {
  if (/registrado/i.test(v)) return "gray";
  if (/vencido|8 dias|baixa/i.test(v)) return "red";
  if (/análise|vencer|pagar|regular/i.test(v)) return "amber";
  return "green";
}

export default function DocumentosRhPage() {
  const [query, setQuery] = useState("");
  const [depto, setDepto] = useState("Todos");
  const [tipoDoc, setTipoDoc] = useState("Todos");
  const [detail, setDetail] = useState<{ title: string; data: Record<string, string | number> } | null>(null);
  const q = query.trim().toLowerCase();
  const has = (o: object) => !q || Object.values(o).join(" ").toLowerCase().includes(q);

  const oc = ocorrencias.filter((o) => (depto === "Todos" || o.depto === depto) && has(o));
  const dp = departamentos.filter(has);
  const pv = preventivos.filter(has);
  const dc = documentos.filter((d) => (tipoDoc === "Todos" || d.vinculo.startsWith(tipoDoc)) && has(d));
  const open = (title: string, data: Record<string, string | number>) => setDetail({ title, data });

  return (
    <Shell>
      <PageHead
        title="Documentos Gerais, RH, Departamentos e Preventivos"
        subtitle="Caixas no mesmo formato das páginas do CRM: 5 primeiros registros e “Ver todos”."
        hint="Farol: verde = válido / pago / aprovado · amarelo = a vencer / em análise · vermelho = vencido / baixa satisfação."
      />
      <SearchBar placeholder="Buscar cliente, motorista, veículo, contrato..." value={query} onChange={setQuery} />

      <div className="grid-2" style={{ alignItems: "start" }}>
        <Card title="Ocorrências" right={<>
          <label className="head-select">Departamento:&nbsp;<select value={depto} onChange={(e) => setDepto(e.target.value)}>{["Todos", ...departamentos.map((d) => d.depto)].map((d) => <option key={d}>{d}</option>)}</select></label>
          <Farol g={3} a={1} r={0} />
        </>} footer={<ViewAll label="Ver todas as 23 ocorrências" onClick={() => { setDepto("Todos"); setQuery(""); }} />}>
          <div className="tbl-wrap"><table className="tbl hover">
            <thead><tr><th>Data</th><th>Pessoa</th><th>Departamento</th><th>Tipo</th><th>Situação</th></tr></thead>
            <tbody>{oc.map((o) => <tr key={o.data + o.tipo} onClick={() => open(`${o.tipo} · ${o.pessoa}`, o)}><td>{o.data}</td><td>{o.pessoa}</td><td>{o.depto}</td><td>{o.tipo}</td><td><Pill tone={tone(o.situacao)}>{o.situacao}</Pill></td></tr>)}</tbody>
          </table>{!oc.length && <div className="empty">Nenhuma ocorrência.</div>}</div>
        </Card>

        <Card title="Departamentos e satisfação" right={<Farol g={3} a={1} r={1} />} footer={<ViewAll label="Ver os 5 departamentos" onClick={() => setQuery("")} />}>
          <div className="tbl-wrap"><table className="tbl hover">
            <thead><tr><th>Departamento</th><th>Membros</th><th>Satisfação</th><th>Ocorrências abertas</th></tr></thead>
            <tbody>{dp.map((d) => <tr key={d.depto} onClick={() => setDepto(d.depto)} title="Filtrar ocorrências deste departamento"><td>{d.depto}</td><td>{d.membros}</td><td><Pill tone={tone(d.satisfacao)}>{d.satisfacao}</Pill></td><td>{d.abertas}</td></tr>)}</tbody>
          </table>{!dp.length && <div className="empty">Nada encontrado.</div>}</div>
        </Card>

        <Card title="Preventivos · seguros a vencer e pagos" right={<Farol g={1} a={2} r={1} />} footer={<ViewAll label="Ver os 9 planos" onClick={() => setQuery("")} />}>
          <div className="tbl-wrap"><table className="tbl hover">
            <thead><tr><th>Plano</th><th>Empresa</th><th>Vencimento</th><th>Pagamento</th></tr></thead>
            <tbody>{pv.map((p) => <tr key={p.plano} onClick={() => open(p.plano, p)}><td>{p.plano}</td><td>{p.empresa}</td><td>{p.venc}</td><td><Pill tone={tone(p.pagamento)}>{p.pagamento}</Pill></td></tr>)}</tbody>
          </table>{!pv.length && <div className="empty">Nada encontrado.</div>}</div>
        </Card>

        <Card title="Documentos gerais" right={<>
          <Farol g={118} a={7} r={3} />
          <label className="head-select">Tipo:&nbsp;<select value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)}>{["Todos", "Motorista", "Veículo", "Empresa", "Cliente"].map((d) => <option key={d}>{d}</option>)}</select></label>
        </>} footer={<ViewAll label="Ver todos os 128 documentos" onClick={() => { setTipoDoc("Todos"); setQuery(""); }} />}>
          <div className="tbl-wrap"><table className="tbl hover">
            <thead><tr><th>Documento</th><th>Vínculo</th><th>Validade</th><th>Situação</th></tr></thead>
            <tbody>{dc.map((d) => <tr key={d.doc} onClick={() => open(d.doc, d)}><td>{d.doc}</td><td>{d.vinculo}</td><td>{d.validade}</td><td><Pill tone={tone(d.situacao)}>{d.situacao}</Pill></td></tr>)}</tbody>
          </table>{!dc.length && <div className="empty">Nenhum documento.</div>}</div>
        </Card>
      </div>

      {detail && <DetailModal title={detail.title} data={detail.data} onClose={() => setDetail(null)} />}
    </Shell>
  );
}
