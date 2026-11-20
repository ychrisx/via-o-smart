"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { Card, Farol, Kpi, PageHead, Pill, SearchBar, SelectField, Shell, ViewAll, useToast, type Tone } from "../_components/ui";

type Proxima = { veiculo: string; item: string; proxima: string; faltam: string; escala: [string, Tone] | null; situacao: "Atrasado" | "Próximo" | "Em dia" };
type ItemPlano = { item: string; grupo: "Chassi" | "Carroceria"; intervalo: number; ultima: number; proxima: string; faltam: number; situacao: "Em dia" | "Atrasado" | "Próximo" | "Vida útil estendida" };

const proximas: Proxima[] = [
  { veiculo: "Ônibus 231 · FZP-9C07", item: "Lonas de freio", proxima: "120.000", faltam: "−1.870 km", escala: ["Escalado 24/10 · Aeroporto GRU", "red"], situacao: "Atrasado" },
  { veiculo: "Ônibus 112 · CZQ-9087", item: "Troca de óleo do motor", proxima: "320.000", faltam: "−550 km", escala: ["Livre 23/10", "green"], situacao: "Atrasado" },
  { veiculo: "Ônibus 245 · FYC-3A15", item: "Correia do alternador", proxima: "49.000", faltam: "1.020 km", escala: ["Escalado 24/10 · 412 km de viagem", "amber"], situacao: "Próximo" },
  { veiculo: "Van 21 · GNV-5E88", item: "Pastilhas de freio", proxima: "60.000", faltam: "1.660 km", escala: null, situacao: "Próximo" },
  { veiculo: "Micro 35 · CKD-4410", item: "Revisão geral", proxima: "135.000", faltam: "2.500 km", escala: null, situacao: "Em dia" },
];

const KM_ATUAL = 121870;
const plano0: ItemPlano[] = [
  { item: "Troca de óleo do motor", grupo: "Chassi", intervalo: 20000, ultima: 110000, proxima: "130.000", faltam: 8130, situacao: "Em dia" },
  { item: "Filtro de combustível", grupo: "Chassi", intervalo: 20000, ultima: 110000, proxima: "130.000", faltam: 8130, situacao: "Em dia" },
  { item: "Lonas de freio", grupo: "Chassi", intervalo: 40000, ultima: 80000, proxima: "120.000", faltam: -1870, situacao: "Atrasado" },
  { item: "Correia do alternador", grupo: "Chassi", intervalo: 50000, ultima: 73000, proxima: "123.000", faltam: 1130, situacao: "Próximo" },
  { item: "Óleo do câmbio", grupo: "Chassi", intervalo: 60000, ultima: 60000, proxima: "120.000 → 125.000", faltam: 3130, situacao: "Vida útil estendida" },
  { item: "Ar-condicionado · revisão", grupo: "Carroceria", intervalo: 30000, ultima: 90000, proxima: "120.000", faltam: -1870, situacao: "Atrasado" },
  { item: "Portas e mecanismos", grupo: "Carroceria", intervalo: 20000, ultima: 110000, proxima: "130.000", faltam: 8130, situacao: "Em dia" },
];

const sitTone: Record<string, Tone> = { Atrasado: "red", Próximo: "amber", "Em dia": "green", "Vida útil estendida": "blue" };
const km = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("pt-BR")}`;
const veiculos = ["Ônibus 231 · FZP-9C07 · km atual 121.870", "Ônibus 204 · FRT-2J48 · km atual 148.650", "Ônibus 112 · CZQ-9087 · km atual 320.550"];
const planos = ["Chassi Iveco 17280 + carroceria Busscar · 20 mil km", "Chassi Mercedes O500 + carroceria Marcopolo · 15 mil km"];

export default function AgendadasPage() {
  const [query, setQuery] = useState("");
  const [veiculo, setVeiculo] = useState(veiculos[0]);
  const [plano, setPlano] = useState(planos[0]);
  const [itens, setItens] = useState(plano0);
  const [form, setForm] = useState({ veiculo: "Ônibus 204 · FRT-2J48", item: "Óleo do motor e filtros", data: "07/11/2026", km: "148.650", oficina: "Mecânica Paulista", estender: "Não", obs: "" });
  const [highlight, setHighlight] = useState("Lonas de freio");
  const formRef = useRef<HTMLDivElement>(null);
  const [toast, showToast] = useToast();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return proximas.filter((p) => !q || `${p.veiculo} ${p.item}`.toLowerCase().includes(q));
  }, [query]);
  const nomeVeiculo = veiculo.split(" · ")[0];
  const placaVeiculo = veiculo.split(" · ").slice(0, 2).join(" · ");
  const farolPlano = { g: itens.filter((i) => i.situacao === "Em dia" || i.situacao === "Vida útil estendida").length, a: itens.filter((i) => i.situacao === "Próximo").length, r: itens.filter((i) => i.situacao === "Atrasado").length };

  function preencher(i: ItemPlano) {
    setHighlight(i.item);
    setForm((f) => ({ ...f, veiculo: placaVeiculo, item: i.item, km: KM_ATUAL.toLocaleString("pt-BR") }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function registrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const kmNum = Number(form.km.replace(/\D/g, ""));
    if (!kmNum) return showToast("Informe o km na revisão.");
    setItens((list) => list.map((i) => {
      if (!form.veiculo.startsWith(nomeVeiculo) || i.item !== form.item) return i;
      const prox = kmNum + i.intervalo + (form.estender === "Sim" ? 5000 : 0);
      return { ...i, ultima: kmNum, proxima: prox.toLocaleString("pt-BR"), faltam: prox - KM_ATUAL, situacao: form.estender === "Sim" ? "Vida útil estendida" : "Em dia" };
    }));
    showToast(`Revisão registrada: ${form.item} · ${form.veiculo} (${form.km} km).`);
    setForm((f) => ({ ...f, obs: "" }));
  }

  return (
    <Shell toast={toast}>
      <PageHead
        title="Manutenções e reparos agendados"
        subtitle="Rotina gerada pelo plano de manutenção de cada veículo: o sistema pega o km atual e projeta os próximos."
        hint="Farol: verde = em dia · amarelo = faltam até 2.000 km · vermelho = atrasado. Conflito = manutenção vencendo em veículo escalado."
      />
      <SearchBar value={query} onChange={setQuery} width={716} />

      <div className="kpis k4" style={{ padding: "0 4px" }}>
        <Kpi dot="green" value={132} label="Itens em dia" />
        <Kpi dot="amber" value={9} label="Próximos (até 2.000 km)" />
        <Kpi dot="red" value={3} label="Atrasados" />
        <Kpi value={2} label="Conflitos com a escala" />
      </div>

      <Card title="Próximas manutenções da frota" right={<Farol g={132} a={9} r={3} />} footer={<ViewAll label="Ver todos os 144 itens" onClick={() => setQuery("")} />}>
        <div className="tbl-wrap">
          <table className="tbl tbl-sm">
            <thead><tr><th>Veículo</th><th>Item</th><th>Próxima (km)</th><th>Faltam</th><th>Escala nos próximos dias</th><th>Situação</th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={`${p.veiculo}-${p.item}`}>
                  <td>{p.veiculo}</td><td>{p.item}</td><td>{p.proxima}</td><td>{p.faltam}</td>
                  <td>{p.escala ? <Pill tone={p.escala[1]}>{p.escala[0]}</Pill> : "—"}</td>
                  <td><Pill tone={sitTone[p.situacao]}>{p.situacao}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty">Nada encontrado.</div>}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 1020, marginBottom: 20 }}>
        <SelectField label="Veículo" value={veiculo} options={veiculos} onChange={setVeiculo} />
        <SelectField label="Plano de manutenção" value={plano} options={planos} onChange={setPlano} />
      </div>
      <p style={{ margin: "0 0 8px", color: "#555", fontSize: 12 }}>Itens do plano (Vencimentos) : verde = válido · amarelo = vence em até 30 dias · vermelho = vencido</p>

      <Card title={`Itens do plano · ${nomeVeiculo}`} right={<Farol g={farolPlano.g} a={farolPlano.a} r={farolPlano.r} />}>
        <div className="tbl-wrap">
          <table className="tbl tbl-sm">
            <thead><tr><th>Item do plano</th><th>Grupo</th><th>Intervalo</th><th>Última (km)</th><th>Próxima (km)</th><th>Faltam</th><th>Situação</th><th /></tr></thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.item} className={i.item === highlight ? "sel" : ""}>
                  <td>{i.item}</td><td>{i.grupo}</td><td>{i.intervalo.toLocaleString("pt-BR")} km</td><td>{i.ultima.toLocaleString("pt-BR")}</td><td>{i.proxima}</td>
                  <td style={i.faltam < 0 ? { color: "var(--red)", fontWeight: 700 } : undefined}>{km(i.faltam)} km</td>
                  <td><Pill tone={sitTone[i.situacao]}>{i.situacao}</Pill></td>
                  <td className="right"><button type="button" className="link-red" style={{ fontSize: 14 }} onClick={() => preencher(i)}>Registrar revisão</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div ref={formRef} style={{ scrollMarginTop: 20 }}>
        <Card title="Registrar revisão">
          <form className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "18px 28px" }} onSubmit={registrar}>
            <SelectField label="Veículo" invalid value={form.veiculo} options={Array.from(new Set([form.veiculo, "Ônibus 204 · FRT-2J48", "Ônibus 231 · FZP-9C07", "Ônibus 112 · CZQ-9087"]))} onChange={(v) => setForm({ ...form, veiculo: v })} />
            <SelectField label="Item que precisa de revisão" value={form.item} options={Array.from(new Set([form.item, "Óleo do motor e filtros", ...itens.map((i) => i.item)]))} onChange={(v) => setForm({ ...form, item: v })} />
            <label className="field"><span>Data da revisão</span><div className="control" style={{ borderColor: "transparent" }}><input value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></div></label>
            <label className="field"><span>Km na revisão</span><div className="control"><input inputMode="numeric" value={form.km} onChange={(e) => setForm({ ...form, km: e.target.value })} /></div></label>
            <SelectField label="Oficina" value={form.oficina} options={["Mecânica Paulista", "Auto Elétrica Dias", "Borracharia Anhanguera"]} onChange={(v) => setForm({ ...form, oficina: v })} />
            <SelectField label="Estender vida útil?" value={form.estender} options={["Não", "Sim"]} onChange={(v) => setForm({ ...form, estender: v })} />
            <label className="field" style={{ gridColumn: "1 / -1" }}><span>Observações</span><textarea className="control" placeholder="Escreva aqui o que foi trocado ou verificado..." value={form.obs} onChange={(e) => setForm({ ...form, obs: e.target.value })} /></label>
            <div style={{ gridColumn: "1 / -1" }}><button type="submit" className="btn btn-gold btn-lg">Registrar revisão</button></div>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
