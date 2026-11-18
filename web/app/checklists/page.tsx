"use client";

import { useMemo, useState } from "react";
import { Card, DateField, DetailModal, Farol, Kpi, PageHead, Pill, SearchBar, Segmented, SelectField, Shell, ViewAll, type Tone } from "../_components/ui";

type Check = { hora: string; tipo: "Saída" | "Entrega"; veiculo: string; motorista: string; escala: string; naoOk: string; situacao: "Em preenchimento" | "Concluído" | "Concluído · gerou OS" | "Pendente" };

const checks: Check[] = [
  { hora: "14:30", tipo: "Saída", veiculo: "Ônibus 204", motorista: "Carlos Almeida", escala: "Barra Funda → Cajamar", naoOk: "0", situacao: "Em preenchimento" },
  { hora: "14:32", tipo: "Saída", veiculo: "Ônibus 187", motorista: "Marcos Souza", escala: "Osasco → Barueri", naoOk: "0", situacao: "Concluído" },
  { hora: "14:35", tipo: "Saída", veiculo: "Ônibus 231", motorista: "Renata Lima", escala: "Eventual · Aeroporto GRU", naoOk: "1 · farol baixo", situacao: "Concluído · gerou OS" },
  { hora: "14:40", tipo: "Saída", veiculo: "Van 12", motorista: "Marcos Souza", escala: "Paulo Mendes · Santos", naoOk: "0", situacao: "Concluído" },
  { hora: "14:41", tipo: "Saída", veiculo: "Micro 31", motorista: "João Pereira", escala: "Eventos Silva · Holambra", naoOk: "—", situacao: "Pendente" },
  { hora: "06:12", tipo: "Entrega", veiculo: "Ônibus 245", motorista: "João Pereira", escala: "Barueri → Osasco", naoOk: "2 · pneu, limpador", situacao: "Concluído · gerou OS" },
  { hora: "06:20", tipo: "Entrega", veiculo: "Ônibus 112", motorista: "Marcos Souza", escala: "Cajamar → Barra Funda", naoOk: "0", situacao: "Concluído" },
  { hora: "06:25", tipo: "Entrega", veiculo: "Ônibus Turismo 09", motorista: "Fernanda Costa", escala: "Olímpia → São Paulo", naoOk: "0", situacao: "Concluído" },
];

const sitTone: Record<Check["situacao"], Tone> = { "Em preenchimento": "amber", Concluído: "green", "Concluído · gerou OS": "red", Pendente: "gray" };
const sitFilter: Record<string, (c: Check) => boolean> = {
  Todas: () => true,
  Concluídos: (c) => c.situacao.startsWith("Concluído"),
  "Em preenchimento": (c) => c.situacao === "Em preenchimento",
  Pendentes: (c) => c.situacao === "Pendente",
  "Com avaria": (c) => c.situacao.includes("OS"),
};

export default function ChecklistsPage() {
  const [query, setQuery] = useState("");
  const [visao, setVisao] = useState("Dia");
  const [data, setData] = useState("22/10/2026");
  const [motorista, setMotorista] = useState("Todos");
  const [veiculo, setVeiculo] = useState("Todos");
  const [tipo, setTipo] = useState("Saída + entrega");
  const [situacao, setSituacao] = useState("Todas");
  const [detail, setDetail] = useState<Check | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return checks.filter((c) =>
      (motorista === "Todos" || c.motorista === motorista) &&
      (veiculo === "Todos" || c.veiculo === veiculo) &&
      (tipo === "Saída + entrega" || c.tipo === tipo) &&
      sitFilter[situacao](c) &&
      (!q || `${c.veiculo} ${c.motorista} ${c.escala}`.toLowerCase().includes(q)),
    );
  }, [query, motorista, veiculo, tipo, situacao]);

  return (
    <Shell>
      <PageHead
        title="Checklists de Entrada e Saída"
        subtitle="Visão por dia em tabela, para aguentar o volume real (170 escalas por dia)."
        hint="Farol: verde = concluído · amarelo = em preenchimento / pendente · vermelho = item Não OK (gera OS)."
      />
      <SearchBar placeholder="Buscar cliente, motorista, veículo, contrato..." value={query} onChange={setQuery} />

      <div className="filters" style={{ display: "grid", gridTemplateColumns: "auto repeat(5, minmax(0, 1fr))", gap: 18, marginBottom: 24 }}>
        <Segmented showLabel label="Visão" options={["Dia", "Semana", "Mês"]} value={visao} onChange={setVisao} />
        <DateField label="Data" value={data} onChange={setData} />
        <SelectField label="Motorista" value={motorista} options={["Todos", ...Array.from(new Set(checks.map((c) => c.motorista)))]} onChange={setMotorista} />
        <SelectField label="Veículo" value={veiculo} options={["Todos", ...Array.from(new Set(checks.map((c) => c.veiculo)))]} onChange={setVeiculo} />
        <SelectField label="Tipo" value={tipo} options={["Saída + entrega", "Saída", "Entrega"]} onChange={setTipo} />
        <SelectField label="Situação" value={situacao} options={Object.keys(sitFilter)} onChange={setSituacao} />
      </div>

      <div className="kpis">
        <Kpi value={170} label="Programados no dia" onClick={() => setSituacao("Todas")} />
        <Kpi dot="green" value={112} label="Concluídos" onClick={() => setSituacao("Concluídos")} />
        <Kpi dot="amber" value={9} label="Em preenchimento" onClick={() => setSituacao("Em preenchimento")} />
        <Kpi dot="gray" value={46} label="Pendentes" onClick={() => setSituacao("Pendentes")} />
        <Kpi dot="red" value={3} label="Com avaria · geraram OS" onClick={() => setSituacao("Com avaria")} />
      </div>

      <Card title={`Checklists de ${data} · 55 veículos · 70 motoristas`} right={<Farol g={112} a={55} r={3} />} footer={<ViewAll label="Ver todos os 170 checklists do dia" onClick={() => { setSituacao("Todas"); setQuery(""); }} />}>
        <div className="tbl-wrap">
          <table className="tbl hover">
            <thead><tr><th>Horário</th><th>Tipo</th><th>Veículo</th><th>Motorista</th><th>Escala · cliente</th><th>Itens Não OK</th><th>Situação</th><th /></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={`${c.hora}-${c.veiculo}`} onClick={() => setDetail(c)}>
                  <td className="strong">{c.hora}</td>
                  <td><Pill tone={c.tipo === "Saída" ? "gray" : "blue"}>{c.tipo}</Pill></td>
                  <td>{c.veiculo}</td><td>{c.motorista}</td><td>{c.escala}</td><td>{c.naoOk}</td>
                  <td><Pill tone={sitTone[c.situacao]}>{c.situacao}</Pill></td>
                  <td className="right"><button type="button" className="link-red" style={{ fontSize: 14 }} onClick={(e) => { e.stopPropagation(); setDetail(c); }}>Abrir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty">Nenhum checklist com esses filtros.</div>}
        </div>
      </Card>

      {detail && <DetailModal title={`Checklist ${detail.tipo.toLowerCase()} · ${detail.hora}`} subtitle={`${detail.veiculo} · ${detail.motorista}`} data={{ Escala: detail.escala, "Itens Não OK": detail.naoOk, Situação: detail.situacao, Data: data }} onClose={() => setDetail(null)} />}
    </Shell>
  );
}
