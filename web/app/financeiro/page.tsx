"use client";

import { useState } from "react";
import { Card, DetailModal, Donut, Farol, HBars, LineChart, PageHead, SearchBar, Segmented, Shell } from "../_components/ui";

const months = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"];
type Series = { title: string; value: string; values: number[]; suffix?: string; composition: Record<string, string> };

const charts: Series[] = [
  { title: "Lucro (receita bruta − despesas)", value: "R$ 58 mil", values: [42, 48, 51, 46, 55, 58], composition: { "Receita bruta": "R$ 107.000", Despesas: "R$ 49.000", Lucro: "R$ 58.000" } },
  { title: "Despesas", value: "R$ 37 mil", values: [31, 33, 35, 34, 36, 37], composition: { Combustível: "R$ 18.400", Manutenção: "R$ 7.200", Pedágio: "R$ 4.600", Administrativo: "R$ 6.800" } },
  { title: "Gastos com terceiros", value: "R$ 12 mil", values: [8, 9, 9, 10, 11, 12], composition: { "Rota Sul Fretamentos": "R$ 7.900", "TransVale Locações": "R$ 4.100" } },
  { title: "Desempenho mensal", value: "91%", values: [78, 82, 85, 81, 88, 91], suffix: "%", composition: { "Viagens no horário": "91%", "Atrasos": "7%", "Interrompidas": "2%" } },
];

const periods: Record<string, { labels: string[]; factor: number; sub: string }> = {
  Semanal: { labels: ["S1", "S2", "S3", "S4", "S5", "S6"], factor: 0.25, sub: "Semana 43" },
  Mensal: { labels: months, factor: 1, sub: "Out/2026" },
  Anual: { labels: ["2021", "2022", "2023", "2024", "2025", "2026"], factor: 12, sub: "2026" },
};

function BarChartCard({ s, onOpen }: { s: Series; onOpen: () => void }) {
  const [period, setPeriod] = useState("Mensal");
  const p = periods[period];
  const vals = s.suffix ? s.values : s.values.map((v) => Math.round(v * p.factor));
  const max = Math.max(...vals);
  return (
    <Card title={s.title}>
      <div className="card-body" style={{ paddingBottom: 14 }}>
        <div className="mini-head">
          <button type="button" className="chart-click" onClick={onOpen}>
            <p className="big-value">{s.suffix ? s.value : period === "Mensal" ? s.value : `R$ ${vals[5]} mil`}</p>
            <span className="big-sub">{p.sub} · clique para ver a composição</span>
          </button>
          <Segmented variant="sm" options={["Semanal", "Mensal", "Anual"]} value={period} onChange={setPeriod} label={`Período de ${s.title}`} />
        </div>
        <button type="button" className="chart-click" style={{ width: "100%" }} onClick={onOpen} aria-label={`Ver dados de ${s.title}`}>
          <div className="vbars" style={{ height: 156 }}>
            {vals.map((v, i) => (
              <div key={i} className={`vbar ${i === vals.length - 1 ? "last" : ""}`}>
                <b>{v}{s.suffix ?? ""}</b>
                <i style={{ height: `${(v / max) * 108}px` }} />
                <span>{p.labels[i]}</span>
              </div>
            ))}
          </div>
        </button>
      </div>
    </Card>
  );
}

export default function FinanceiroPage() {
  const [query, setQuery] = useState("");
  const [venc, setVenc] = useState("Mês");
  const [cat, setCat] = useState("Mês");
  const [imp, setImp] = useState("Mensal");
  const [rel, setRel] = useState("Mês");
  const [detail, setDetail] = useState<Series | null>(null);

  return (
    <Shell>
      <PageHead
        title="Financeiro"
        subtitle="Indicadores do período. Clique em um gráfico para ver os dados."
        hint="Farol dos vencimentos: verde = em dia · amarelo = vence em até 3 dias · vermelho = em atraso."
      />
      <SearchBar value={query} onChange={setQuery} width={430} />

      <div className="fin-grid">
        {charts.map((s) => <BarChartCard key={s.title} s={s} onOpen={() => setDetail(s)} />)}
      </div>

      <Card title="Vencimentos" right={<><Segmented variant="head" options={["Dia", "Semana", "Mês", "Ano"]} value={venc} onChange={setVenc} label="Período dos vencimentos" /><Farol g={14} a={4} r={2} /></>}>
        <div className="card-body">
          <div className="due-boxes">
            <div className="due"><span>A pagar hoje</span><strong>R$ 8.420</strong><small>em 3 dias: <b>R$ 21.300</b></small></div>
            <div className="due"><span>A receber hoje</span><strong>R$ 12.900</strong><small>em 3 dias: <b>R$ 48.600</b></small></div>
            <div className="due bad"><span>Em atraso a receber</span><strong>R$ 37.550</strong><small>2 títulos · CT-2026-009, OS-2026-098</small></div>
            <div className="due warn"><span>Em atraso a pagar</span><strong>R$ 3.150</strong><small>1 título · Auto Elétrica Central</small></div>
          </div>
          <HBars red items={[["Vence hoje", 8420, "R$ 8.420"], ["Vence em 1 dia", 6100, "R$ 6.100"], ["Vence em 2 dias", 4300, "R$ 4.300"], ["Vence em 3 dias", 10900, "R$ 10.900"]]} />
        </div>
      </Card>

      <div className="fin-grid">
        <Card title="Totais por categoria · Out/2026" right={<Segmented variant="head" options={["Dia", "Semana", "Mês", "Ano"]} value={cat} onChange={setCat} label="Período das categorias" />}>
          <div className="card-body">
            <HBars compact items={[["Folha de pagamento", 142000, "R$ 142.000"], ["Diesel", 98400, "R$ 98.400"], ["Financiamentos", 61200, "R$ 61.200"], ["Empréstimos", 24800, "R$ 24.800"], ["Pedágio", 18300, "R$ 18.300"], ["Vales", 12600, "R$ 12.600"]]} />
          </div>
        </Card>
        <Card title="Impostos · Out/2026" right={<Segmented variant="head" options={["Semanal", "Mensal", "Anual"]} value={imp} onChange={setImp} label="Período dos impostos" />} style={{ alignSelf: "start" }}>
          <div className="card-body">
            <HBars red compact items={[["Impostos federais", 21400, "R$ 21.400"], ["Impostos estaduais", 9800, "R$ 9.800"], ["Impostos municipais", 4100, "R$ 4.100"]]} />
            <p className="tax-foot">Lucro bruto do mês: receita R$ 107.000 − despesas R$ 49.000 = <b>R$ 58.000</b></p>
          </div>
        </Card>
      </div>

      <Card title="Relatório de faturamento · Out/2026" right={<Segmented variant="head" options={["Dia", "Semana", "Mês", "Ano"]} value={rel} onChange={setRel} label="Período do relatório" />}>
        <div className="card-body">
          <div className="report-kpis">
            <div><span>Total faturado</span><strong>R$ 107.000</strong></div>
            <div><span>Clientes atendidos</span><strong>7</strong></div>
            <div><span>Fretamentos e OS</span><strong>29</strong></div>
            <div><span>Média de passageiros</span><strong>36</strong></div>
            <div><span>Destino mais frequente</span><strong>Cajamar</strong></div>
          </div>
          <div className="report-cols">
            <div>
              <p className="section-title">Faturado por cliente</p>
              <div className="hbars" style={{ gap: 8 }}>
                {([["Logística Cajamar", 52400], ["Indústria Barueri", 21300], ["Aeroporto GRU", 15800], ["Eventos Silva MEI", 8940], ["Associação Vila Nova", 4800], ["Paulo Mendes", 2750], ["Ana Beatriz Rocha", 1010]] as [string, number][]).map(([n, v]) => (
                  <div key={n} className="hbar" style={{ gridTemplateColumns: "150px 1fr 90px" }}>
                    <span>{n}</span>
                    <div className="track"><div className="fill" style={{ width: `${Math.max(2, (v / 52400) * 100)}%` }} /></div>
                    <span className="val">R$ {v.toLocaleString("pt-BR")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="section-title">Status de pagamento</p>
              <div className="donut-wrap">
                <Donut size={160} parts={[[21, "#2f9e5c"], [6, "#d99a2b"], [2, "#be3237"], [1, "#a5a5a5"]]} center={<span>30<br />títulos</span>} />
                <div className="legend" style={{ flex: 1 }}>
                  <div><i style={{ background: "#2f9e5c" }} />Pago<b>21</b></div>
                  <div><i style={{ background: "#d99a2b" }} />Pendente<b>6</b></div>
                  <div><i style={{ background: "#be3237" }} />Atrasado<b>2</b></div>
                  <div><i style={{ background: "#a5a5a5" }} />Cancelado<b>1</b></div>
                </div>
              </div>
            </div>
            <div>
              <p className="section-title">Faturamento por semana</p>
              <LineChart values={[24.1, 26.8, 25.3, 30.8]} labels={["Sem 1", "Sem 2", "Sem 3", "Sem 4"]} valueLabels={["R$ 24,1 mil", "R$ 26,8 mil", "R$ 25,3 mil", "R$ 30,8 mil"]} color="#be3237" fill="rgba(190,50,55,.08)" />
            </div>
          </div>
        </div>
      </Card>

      {detail && <DetailModal title={detail.title} subtitle="Composição · Out/2026" data={{ ...detail.composition, ...Object.fromEntries(months.map((m, i) => [`${m}/2026`, `${detail.suffix ? "" : "R$ "}${detail.values[i]}${detail.suffix ?? " mil"}`])) }} onClose={() => setDetail(null)} />}
    </Shell>
  );
}
