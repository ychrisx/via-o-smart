"use client";

import ContractTypePage, { statusTone, type CtRow } from "../_components/contract-type-page";
import { Pill, type Tone } from "../_components/ui";

type Ev = { numero: string; cliente: string; viagem: string; rota: string; veiculo: string; terceiro?: string; valor: number; nf: [string, Tone] | null; situacao: string; pagar?: string };

const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

function toRow(e: Ev): CtRow {
  return {
    id: e.numero,
    status: e.situacao,
    tipo: e.numero.startsWith("OS") ? "Ordem de serviço" : "Fretamento eventual",
    execucao: e.terceiro ? "Terceiro" : "Própria",
    text: `${e.numero} ${e.cliente} ${e.rota} ${e.veiculo}`,
    selectedText: `Selecionado: ${e.numero} · ${e.cliente} · ${e.terceiro ? `Terceirizado (${e.terceiro})${e.pagar ? ` · ${e.pagar}` : ""}` : `Frota própria (${e.veiculo})`}`,
    cells: {
      numero: e.numero, cliente: e.cliente, viagem: e.viagem, rota: e.rota,
      veiculo: e.terceiro ? <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>{e.veiculo} <Pill tone="blue">Terceiro</Pill></span> : e.veiculo,
      valor: brl(e.valor),
      nf: e.nf ? <Pill tone={e.nf[1]}>{e.nf[0]}</Pill> : "—",
      situacao: <Pill tone={statusTone(e.situacao)}>{e.situacao}</Pill>,
    },
    detail: { Cliente: e.cliente, Viagem: e.viagem, "Origem → destino": e.rota, Veículo: e.veiculo, Execução: e.terceiro ? `Terceiro · ${e.terceiro}` : "Própria", Valor: brl(e.valor), "NF · financeiro": e.nf?.[0] ?? "—", Situação: e.situacao, Etapas: "Orçamento aprovado → Contrato → Escala → Viagem → Faturamento" },
  };
}

const eventos: Ev[] = [
  { numero: "EV-2026-031", cliente: "Associação Vila Nova", viagem: "24/10/2026", rota: "Osasco → Aparecida/SP", veiculo: "Ônibus 245", valor: 4800, nf: ["NF emitida · lançado", "green"], situacao: "Programado" },
  { numero: "EV-2026-030", cliente: "Eventos Silva MEI", viagem: "25/10/2026", rota: "SP → Campos do Jordão", veiculo: "Rota Sul", terceiro: "Rota Sul", valor: 6840, nf: ["NF pendente", "amber"], situacao: "Agendado", pagar: "pagar R$ 4.900 em 30/10" },
  { numero: "EV-2026-029", cliente: "Paulo Mendes", viagem: "18/10/2026", rota: "São Paulo → Santos", veiculo: "Van 12", valor: 2750, nf: ["NF emitida · lançado", "green"], situacao: "Realizado" },
  { numero: "OS-2026-104", cliente: "Eventos Silva MEI", viagem: "25/10/2026", rota: "Barueri → Holambra", veiculo: "Micro 31", valor: 2100, nf: null, situacao: "Agendado" },
  { numero: "OS-2026-098", cliente: "Ana Beatriz Rocha", viagem: "12/10/2026", rota: "São Paulo → Olímpia", veiculo: "Ônibus Turismo 09", valor: 1350, nf: ["Pagto. atrasado 6 d", "red"], situacao: "Realizado" },
];

export default function ContratosEventuaisPage() {
  return (
    <ContractTypePage
      title="Contratos eventuais"
      subtitle="Fretamentos eventuais e ordens de serviço. Muito mais numerosos que os fixos, por isso ficam separados."
      hint="Farol: verde = faturado e lançado · amarelo = pendente · vermelho = atraso de pagamento."
      kpis={[
        { value: 6, label: "Agendados", filter: "Agendado" },
        { value: 18, label: "Realizados no mês", primary: true, filter: "Realizado" },
        { value: 1, label: "Cancelados", filter: "Cancelado" },
        { value: 3, label: "Realizados a faturar", redNumber: true },
      ]}
      filterPlaceholder="Número, cliente ou destino."
      periodo="Outubro/2026"
      statusOptions={["Programado", "Agendado", "Realizado", "Cancelado"]}
      tipoOptions={["Fretamento eventual", "Ordem de serviço"]}
      execOptions={["Própria e terceiro", "Própria", "Terceiro"]}
      newLabel="Novo eventual"
      note="Orçamento aprovado em Comercial vira um eventual aqui automaticamente."
      cardTitle="Fretamentos eventuais e ordens de serviço"
      farol={[19, 7, 2]}
      columns={[{ key: "numero", label: "Número" }, { key: "cliente", label: "Cliente" }, { key: "viagem", label: "Viagem" }, { key: "rota", label: "Origem → destino" }, { key: "veiculo", label: "Veículo · execução" }, { key: "valor", label: "Valor" }, { key: "nf", label: "NF · financeiro" }, { key: "situacao", label: "Situação" }]}
      rows={eventos.map(toRow)}
      total={29}
      totalLabel="registros"
      extraButton={{ label: "Copiar estrutura", icon: "copy" }}
      newFields={[{ label: "Cliente", required: true }, { label: "Data da viagem (dd/mm/aaaa)", required: true }, { label: "Origem → destino", required: true }, { label: "Veículo" }, { label: "Valor (R$)" }]}
      buildRow={(v, n) => toRow({ numero: `EV-2026-${String(32 + n).padStart(3, "0")}`, cliente: v.Cliente, viagem: v["Data da viagem (dd/mm/aaaa)"], rota: v["Origem → destino"], veiculo: v["Veículo"] || "A definir", valor: Number(v["Valor (R$)"].replace(/\D/g, "")) || 0, nf: null, situacao: "Agendado" })}
    />
  );
}
