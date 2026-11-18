"use client";

import { useEffect, useMemo, useState } from "react";
import { DetailModal, Icon, Kpi, PageHead, Segmented, Shell, useToast } from "../_components/ui";

type Stop = { nome: string; hora: string; estado: "done" | "now" | "next" };
type Trip = { id: string; tipo: "fixo" | "eventual"; cliente: string; fonte: "ABM Bus" | "App do motorista"; status: { label: string; tone: "green" | "red" | "blue" }; veiculo: string; sinal: string; stops: Stop[]; finalizado?: boolean };

const tripsIniciais: Trip[] = [
  { id: "t1", tipo: "fixo", cliente: "Logística Cajamar Ltda", fonte: "ABM Bus", status: { label: "No horário", tone: "green" }, veiculo: "Ônibus 204 · FRT-2J48 · Carlos Almeida", sinal: "Último sinal 15:49 · 62 km/h",
    stops: [{ nome: "Barra Funda", hora: "15:01", estado: "done" }, { nome: "Av. Inajar de Souza", hora: "15:22", estado: "done" }, { nome: "Rod. Anhanguera km 32", hora: "15:48", estado: "now" }, { nome: "Cajamar · Portaria", hora: "Previsto 16:10", estado: "next" }, { nome: "Centro logístico", hora: "Previsto 16:25", estado: "next" }] },
  { id: "t2", tipo: "fixo", cliente: "Indústria Barueri S.A.", fonte: "ABM Bus", status: { label: "No horário", tone: "green" }, veiculo: "Ônibus 187 · GHT-4B21 · Marcos Souza", sinal: "Último sinal 15:32 · 38 km/h",
    stops: [{ nome: "Osasco · Terminal", hora: "15:05", estado: "done" }, { nome: "Av. dos Autonomistas", hora: "15:31", estado: "now" }, { nome: "Alphaville", hora: "Previsto 15:50", estado: "next" }, { nome: "Barueri · Fábrica", hora: "Previsto 16:05", estado: "next" }] },
  { id: "t3", tipo: "eventual", cliente: "Aeroporto GRU Serviços", fonte: "App do motorista", status: { label: "Atrasado 18 min", tone: "red" }, veiculo: "Ônibus 231 · FZP-9C07 · Renata Lima", sinal: "Último sinal 16:09 · 74 km/h",
    stops: [{ nome: "Terminal Tietê", hora: "14:50", estado: "done" }, { nome: "Marginal Tietê", hora: "15:20", estado: "done" }, { nome: "Rod. Ayrton Senna", hora: "16:08", estado: "now" }, { nome: "Aeroporto GRU", hora: "Previsto 16:40", estado: "next" }] },
  { id: "t4", tipo: "eventual", cliente: "Colégio Nova Geração", fonte: "App do motorista", status: { label: "Aguardando início", tone: "blue" }, veiculo: "Ônibus 245 · FYC-3A15 · João Pereira", sinal: "Sem sinal · saída prevista 17:00",
    stops: [{ nome: "Garagem", hora: "Previsto 17:00", estado: "next" }, { nome: "Barueri · Colégio", hora: "Previsto 17:30", estado: "next" }, { nome: "Hopi Hari", hora: "Previsto 18:40", estado: "next" }] },
];

const statusStyle = { green: { color: "var(--green)" }, red: { color: "var(--red)" }, blue: { color: "var(--blue)" } };

function TripCard({ t, onMap, onAction }: { t: Trip; onMap: () => void; onAction: (a: string) => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);
  return (
    <section className="trip">
      <div className="card-head">
        <h2 style={{ fontSize: 16 }}>Fretamento {t.tipo} · {t.cliente}</h2>
        <div className="right">
          <span className="trip-tag-ghost">via {t.fonte}</span>
          <button type="button" className="head-badge" style={{ fontWeight: 500, fontSize: 13 }} onClick={onMap}>Ver mapa</button>
          <span className="rel">
            <button type="button" className="head-badge" style={{ fontWeight: 500, fontSize: 13 }} aria-haspopup="menu" aria-expanded={open} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>Ações ▾</button>
            {open && (
              <div className="menu" role="menu">
                {["Ligar para o motorista", "Avisar o cliente", "Marcar como interrompido", "Finalizar viagem"].map((a) => <button key={a} type="button" role="menuitem" onClick={() => onAction(a)}>{a}</button>)}
              </div>
            )}
          </span>
          <span className="head-badge" style={statusStyle[t.status.tone]}>{t.status.label}</span>
        </div>
      </div>
      <div className="trip-body">
        <div className="trip-sub"><span>{t.veiculo}</span><b>{t.sinal}</b></div>
        <div className="stepper">
          {t.stops.map((s) => (
            <div key={s.nome} className={`step ${s.estado}`}>
              <span className="ball">{s.estado === "done" ? <Icon name="check" size={14} stroke={3} /> : null}</span>
              <strong>{s.nome}</strong>
              <small>{s.hora}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function EscalasPage() {
  const [trips, setTrips] = useState(tripsIniciais);
  const [tipo, setTipo] = useState("Ambos");
  const [periodo, setPeriodo] = useState("Dia");
  const [status, setStatus] = useState("Ao vivo");
  const [mapa, setMapa] = useState<Trip | null>(null);
  const [toast, showToast] = useToast();

  const visible = useMemo(() => trips.filter((t) =>
    (tipo === "Ambos" || (tipo === "Fixos" ? t.tipo === "fixo" : t.tipo === "eventual")) &&
    (status === "Ao vivo" ? !t.finalizado : t.finalizado),
  ), [trips, tipo, status]);

  function action(t: Trip, a: string) {
    if (a === "Finalizar viagem") {
      setTrips((ts) => ts.map((x) => (x.id === t.id ? { ...x, finalizado: true, status: { label: "Finalizado", tone: "green" }, stops: x.stops.map((s) => ({ ...s, estado: "done" })) } : x)));
      showToast(`Viagem ${t.cliente} finalizada.`);
    } else if (a === "Marcar como interrompido") {
      setTrips((ts) => ts.map((x) => (x.id === t.id ? { ...x, status: { label: "Interrompido", tone: "red" } } : x)));
      showToast(`Viagem ${t.cliente} marcada como interrompida.`);
    } else {
      showToast(`${a}: ${t.veiculo.split(" · ").pop()}`);
    }
  }

  const atrasados = trips.filter((t) => t.status.tone === "red" && !t.finalizado).length;
  const finalizados = 9 + trips.filter((t) => t.finalizado).length;

  return (
    <Shell toast={toast}>
      <PageHead
        title="Escalas e Fretamentos"
        subtitle="Acompanhamento em tempo real · quinta-feira, 22/10/2026."
        hint="Fixos são acompanhados pelo ABM Bus; eventuais, pela atualização do app do motorista."
      />

      <div className="live-controls">
        <Segmented variant="sm" showLabel label="Tipo" options={["Fixos", "Eventuais", "Ambos"]} value={tipo} onChange={setTipo} />
        <Segmented variant="sm" showLabel label="Período" options={["Dia", "3 dias", "Semana", "Mês", "Bimestre"]} value={periodo} onChange={setPeriodo} />
        <Segmented variant="sm" showLabel label="Status" options={["Ao vivo", "Terminados"]} value={status} onChange={setStatus} />
        <span className="note">Sem status selecionado, mostra os ao vivo.</span>
      </div>

      <div className="kpis">
        <Kpi value={12} label="Fretamentos fixos" active={tipo === "Fixos" || tipo === "Ambos"} onClick={() => setTipo(tipo === "Fixos" ? "Ambos" : "Fixos")} />
        <Kpi value={3} label="Fretamentos eventuais" active={tipo === "Eventuais"} onClick={() => setTipo(tipo === "Eventuais" ? "Ambos" : "Eventuais")} />
        <Kpi value={2} label="Ordens de serviço" />
        <Kpi value={atrasados} redNumber label="Atrasados / interrompidos" />
        <Kpi value={finalizados} label="Finalizados" onClick={() => setStatus("Terminados")} />
      </div>

      <h3 className="section-h">{status === "Ao vivo" ? "Em andamento agora" : "Terminados hoje"}</h3>
      {visible.map((t) => <TripCard key={t.id} t={t} onMap={() => setMapa(t)} onAction={(a) => action(t, a)} />)}
      {!visible.length && <div className="empty">Nenhuma viagem {status === "Ao vivo" ? "em andamento" : "terminada"} com esses filtros.</div>}

      {mapa && <DetailModal title={`Mapa · ${mapa.cliente}`} subtitle={`via ${mapa.fonte}`} data={{ Veículo: mapa.veiculo, Sinal: mapa.sinal, Posição: mapa.stops.find((s) => s.estado === "now")?.nome ?? mapa.stops[0].nome, Próxima: mapa.stops.find((s) => s.estado === "next")?.nome ?? "—", Status: mapa.status.label }} onClose={() => setMapa(null)} />}
    </Shell>
  );
}
