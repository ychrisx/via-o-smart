"use client";

import ContractTypePage, { statusTone, type CtRow } from "../_components/contract-type-page";
import { Pill, type Tone } from "../_components/ui";

type Fx = { numero: string; cliente: string; linhas: string; vigencia: string; valor: number; nf: [string, Tone]; fin: [string, Tone]; vencimento: string; situacao: string; terceiro?: string };

const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

function toRow(c: Fx): CtRow {
  return {
    id: c.numero,
    status: c.situacao,
    tipo: "Fretamento fixo",
    execucao: c.terceiro ? "Terceiro" : "Própria",
    text: `${c.numero} ${c.cliente} ${c.linhas}`,
    selectedText: `Selecionado: ${c.numero} · ${c.cliente} · Fretamento fixo · ${brl(c.valor)}/mês`,
    cells: {
      numero: c.numero, cliente: c.cliente, linhas: c.linhas, vigencia: c.vigencia, valor: brl(c.valor),
      nf: c.nf[0] === "—" ? "—" : <Pill tone={c.nf[1]}>{c.nf[0]}</Pill>,
      fin: c.fin[0] === "—" ? "—" : <Pill tone={c.fin[1]}>{c.fin[0]}</Pill>,
      vencimento: c.vencimento.includes("atraso") ? <Pill tone="red">{c.vencimento}</Pill> : c.vencimento,
      situacao: <Pill tone={statusTone(c.situacao)}>{c.situacao}</Pill>,
    },
    detail: { Cliente: c.cliente, Linhas: c.linhas, Vigência: c.vigencia, "Valor mensal": brl(c.valor), "NF do mês": c.nf[0], Financeiro: c.fin[0], Vencimento: c.vencimento, Situação: c.situacao, Etapas: "Contrato → Linhas e horários → Escalas → Faturamento mensal" },
  };
}

const contratos: Fx[] = [
  { numero: "CT-2026-014", cliente: "Logística Cajamar Ltda", linhas: "2 linhas", vigencia: "01/03/2026 a 28/02/2027", valor: 48600, nf: ["Emitida", "green"], fin: ["Lançado", "green"], vencimento: "10/11/2026", situacao: "Ativo" },
  { numero: "CT-2026-009", cliente: "Logística Cajamar Ltda", linhas: "1 linha", vigencia: "01/02/2026 a 31/01/2027", valor: 36200, nf: ["Emitida", "green"], fin: ["Lançado", "green"], vencimento: "05/11 · 2 dias de atraso", situacao: "Ativo" },
  { numero: "CT-2026-018", cliente: "Aeroporto GRU Serviços", linhas: "1 linha", vigencia: "01/06/2026 a 31/05/2027", valor: 22900, nf: ["Pendente", "amber"], fin: ["Não lançado", "amber"], vencimento: "15/11/2026", situacao: "Ativo" },
  { numero: "CT-2026-019", cliente: "Indústria Barueri S.A.", linhas: "2 linhas", vigencia: "15/05/2026 a 14/05/2027", valor: 31400, nf: ["Emitida", "green"], fin: ["Lançado", "green"], vencimento: "20/11/2026", situacao: "Ativo" },
  { numero: "CT-2025-031", cliente: "Colégio Nova Geração", linhas: "1 linha", vigencia: "01/02/2025 a 31/12/2025", valor: 18700, nf: ["—", "gray"], fin: ["—", "gray"], vencimento: "—", situacao: "Inativo" },
];

export default function ContratosFixosPage() {
  return (
    <ContractTypePage
      title="Contratos fixos"
      subtitle="Contratos recorrentes por cliente, com linhas e horários fixos."
      hint="Farol: verde = em dia · amarelo = NF ou lançamento pendente · vermelho = pagamento em atraso."
      kpis={[
        { value: 4, label: "Ativos", primary: true, filter: "Ativo" },
        { value: 1, label: "Inativos", filter: "Inativo" },
        { value: 1, label: "A renovar (até 90 dias)" },
        { value: 1, label: "Com pagamento em atraso", redNumber: true },
        { value: "R$ 139,1 mil", label: "Faturamento do mês" },
      ]}
      filterPlaceholder="Número, cliente ou linha."
      periodo="Outubro/2026"
      statusOptions={["Ativo", "Inativo"]}
      tipoOptions={["Fretamento fixo"]}
      execOptions={["Própria e terceiro", "Própria", "Terceiro"]}
      newLabel="Criar contrato"
      note="Na renovação, o contrato novo herda linhas, horários e regra de faturamento."
      cardTitle="Contratos fixos"
      farol={[3, 1, 1]}
      columns={[{ key: "numero", label: "Número" }, { key: "cliente", label: "Cliente" }, { key: "linhas", label: "Linhas" }, { key: "vigencia", label: "Vigência" }, { key: "valor", label: "Valor mensal" }, { key: "nf", label: "NF do mês" }, { key: "fin", label: "Financeiro" }, { key: "vencimento", label: "Vencimento" }, { key: "situacao", label: "Situação" }]}
      rows={contratos.map(toRow)}
      total={5}
      totalLabel="contratos"
      extraButton={{ label: "Copiar estrutura", icon: "copy" }}
      newFields={[{ label: "Cliente", required: true }, { label: "Linhas", value: "1 linha" }, { label: "Vigência", placeholder: "01/11/2026 a 31/10/2027", required: true }, { label: "Valor mensal (R$)" }]}
      buildRow={(v, n) => toRow({ numero: `CT-2026-${String(22 + n).padStart(3, "0")}`, cliente: v.Cliente, linhas: v.Linhas || "1 linha", vigencia: v["Vigência"], valor: Number(v["Valor mensal (R$)"].replace(/\D/g, "")) || 0, nf: ["Pendente", "amber"], fin: ["Não lançado", "amber"], vencimento: "—", situacao: "Ativo" })}
    />
  );
}
