"use client";

import { useMemo, useState } from "react";
import { Card, DateField, DetailModal, Donut, Farol, Icon, Kpi, LineChart, PageHead, Pill, SearchBar, Segmented, SelectField, Shell, ViewAll, useToast, type Tone } from "../_components/ui";

type Cotacao = { n: string; data: string; cliente: string; destino: string; tipo: string; veiculo: string; pass: number; total: number; margem: number; pagamento: string; resp: string; status: string; obs: string };

const avisos = [
  { cliente: "Eventos Silva MEI", meses: 4, aviso: 3, ultima: "25/06/2026" },
  { cliente: "Colégio Nova Geração", meses: 3, aviso: 3, ultima: "18/07/2026" },
  { cliente: "Fernanda Costa", meses: 6, aviso: 6, ultima: "20/04/2026" },
];

const cotacoesIniciais: Cotacao[] = [
  { n: "ORC-0042", data: "14/11/2026", cliente: "Associação Vila Nova", destino: "Aparecida/SP", tipo: "Excursão", veiculo: "Ônibus 245 · João", pass: 42, total: 4800, margem: 35, pagamento: "Pix", resp: "Ana", status: "Aguardando", obs: "Viagem religiosa" },
  { n: "ORC-0041", data: "25/10/2026", cliente: "Eventos Silva MEI", destino: "Campos do Jordão", tipo: "Excursão", veiculo: "Terceiro · Rota Sul", pass: 38, total: 6840, margem: 29, pagamento: "Dinheiro", resp: "Ana", status: "Aprovado", obs: "Inclui city tour" },
  { n: "ORC-0040", data: "05/11/2026", cliente: "Colégio Nova Geração", destino: "Holambra", tipo: "Bate-volta", veiculo: "Micro 31 · João", pass: 24, total: 2900, margem: 31, pagamento: "Boleto", resp: "Roberto", status: "Reprovado · preço", obs: "Festival das Flores" },
  { n: "ORC-0039", data: "18/10/2026", cliente: "Paulo Mendes", destino: "Santos", tipo: "Bate-volta", veiculo: "Van 12 · Marcos", pass: 14, total: 2750, margem: 33, pagamento: "Pix", resp: "Ana", status: "Aprovado", obs: "Passeio de um dia" },
  { n: "ORC-0038", data: "12/11/2026", cliente: "Indústria Barueri S.A.", destino: "Olímpia", tipo: "Fretamento", veiculo: "—", pass: 44, total: 10120, margem: 27, pagamento: "Transferência", resp: "Luciana", status: "Reprovado · sem veículo", obs: "Evento corporativo · parque" },
];

const MSG = "“Boa tarde! Precisamos de um ônibus para 42 pessoas, saindo de Osasco (Igreja Matriz) no sábado 14/11 às 6h para Aparecida, voltando no mesmo dia às 18h. Pode mandar o orçamento? — Márcia, Associação Vila Nova”";
const clientes = ["Associação Vila Nova", "Eventos Silva MEI", "Colégio Nova Geração", "Paulo Mendes", "Indústria Barueri S.A."];
const statusTone = (s: string): Tone => (s.startsWith("Aprov") ? "green" : s.startsWith("Reprov") ? "red" : "amber");
const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;
const perVeiculo = { Van: { diesel: 0.9, cap: 15 }, Micro: { diesel: 1.6, cap: 26 }, Ônibus: { diesel: 2.5, cap: 46 } } as const;

export default function ComercialPage() {
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState(MSG);
  const [dados, setDados] = useState({ cliente: "Associação Vila Nova", categoria: "Ônibus", origem: "Osasco · Igreja Matriz", destino: "Aparecida/SP", saida: "14/11 · 06:00", retorno: "14/11 · 18:00", km: 412, pass: 42 });
  const [cotacoes, setCotacoes] = useState(cotacoesIniciais);
  const [periodo, setPeriodo] = useState("Dia");
  const [ficha, setFicha] = useState<string | null>(null);
  const [toast, showToast] = useToast();

  const calc = useMemo(() => {
    const v = perVeiculo[dados.categoria as keyof typeof perVeiculo];
    const diesel = Math.round(dados.km * v.diesel);
    const motorista = 420;
    const pedagio = 186;
    const agua = 60;
    const custo = diesel + motorista + pedagio + agua + (dados.categoria === "Ônibus" ? 1424 : dados.categoria === "Micro" ? 900 : 600);
    const preco = Math.round(custo / 0.65 / 100) * 100;
    return { diesel, motorista, pedagio, agua, custo, preco, margem: Math.round((1 - custo / preco) * 100) };
  }, [dados]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cotacoes.filter((c) => !q || `${c.n} ${c.cliente} ${c.destino} ${c.veiculo}`.toLowerCase().includes(q));
  }, [cotacoes, query]);

  function preencher() {
    const pass = Number(msg.match(/(\d+)\s*pessoas/i)?.[1] ?? dados.pass);
    const cli = clientes.find((c) => msg.toLowerCase().includes(c.toLowerCase())) ?? dados.cliente;
    const categoria = pass > 26 ? "Ônibus" : pass > 15 ? "Micro" : "Van";
    setDados((d) => ({ ...d, cliente: cli, pass, categoria }));
    showToast("Campos preenchidos a partir da mensagem. Confira os dados.");
  }

  function gerarProposta() {
    const n = `ORC-00${43 + cotacoes.length - cotacoesIniciais.length}`;
    setCotacoes((c) => [{ n, data: dados.saida.split(" · ")[0] + "/2026", cliente: dados.cliente, destino: dados.destino, tipo: "Excursão", veiculo: "—", pass: dados.pass, total: calc.preco, margem: calc.margem, pagamento: "Pix", resp: "Ana", status: "Aguardando", obs: `${dados.origem} → ${dados.destino}` }, ...c]);
    showToast(`Proposta ${n} gerada · ${brl(calc.preco)}.`);
  }

  return (
    <Shell toast={toast}>
      <PageHead
        title="Comercial e Orçamentos"
        subtitle="Do pedido do cliente ao preço sugerido. Orçamento aprovado vira fretamento eventual."
        hint="Farol: verde = aprovado · amarelo = aguardando · vermelho = reprovado. O prazo de cada aviso é configurado na ficha do cliente."
      />
      <SearchBar value={query} onChange={setQuery} width={446} />

      <div className="kpis">
        <Kpi primary value={42} label="Orçamentos no mês" />
        <Kpi value={18} label="Aprovados (43%)" />
        <Kpi value={16} label="Reprovados" />
        <Kpi value={cotacoes.filter((c) => c.status === "Aguardando").length + 7} label="Aguardando aprovação" />
        <Kpi value="31%" label="Margem média estimada" />
      </div>

      <Card title="Avisos do comercial · clientes sem comprar" right={<span className="head-badge">{avisos.length} avisos</span>}>
        {avisos.map((a) => (
          <div className="alert-row" key={a.cliente}>
            <span style={{ color: "#8a6100" }}><Icon name="warn" size={20} /></span>
            <p><b>{a.cliente}</b> não compra há {a.meses} meses (aviso configurado: {a.aviso} meses).</p>
            <small>última compra {a.ultima}</small>
            <button type="button" className="btn btn-outline btn-sm" style={{ minHeight: 34 }} onClick={() => setFicha(a.cliente)}>Ver ficha</button>
            <button type="button" className="btn btn-gold btn-sm" style={{ minHeight: 34 }} onClick={() => showToast(`Cobrança enviada para ${a.cliente}.`)}>Enviar cobrança</button>
          </div>
        ))}
      </Card>

      <Card title="Novo orçamento" right={<button type="button" className="head-badge" onClick={() => showToast("Tabela de parâmetros: diesel, hora do motorista, pedágios e margem padrão.")}>Tabela de parâmetros</button>}>
        <div className="card-body">
          <div className="quote-grid">
            <div>
              <h4>1 · Cole a mensagem do cliente (WhatsApp ou e-mail)</h4>
              <textarea className="quote-msg" value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Mensagem do cliente" />
              <button type="button" className="btn btn-red" onClick={preencher}>Preencher campos</button>
            </div>
            <div>
              <h4>2 · Confira os dados</h4>
              <div className="pair">
                <SelectField label="Cliente" value={dados.cliente} options={clientes} onChange={(v) => setDados({ ...dados, cliente: v })} />
                <div className="field"><span>Categoria</span><Segmented variant="sm" options={["Van", "Micro", "Ônibus"]} value={dados.categoria} onChange={(v) => setDados({ ...dados, categoria: v })} label="Categoria do veículo" /></div>
              </div>
              <div className="pair">
                <label className="field"><span>Origem</span><div className="control"><input value={dados.origem} onChange={(e) => setDados({ ...dados, origem: e.target.value })} /></div></label>
                <label className="field"><span>Destino</span><div className="control"><input value={dados.destino} onChange={(e) => setDados({ ...dados, destino: e.target.value })} /></div></label>
              </div>
              <div className="pair">
                <DateField label="Saída" value={dados.saida} onChange={(v) => setDados({ ...dados, saida: v })} />
                <DateField label="Retorno" value={dados.retorno} onChange={(v) => setDados({ ...dados, retorno: v })} />
              </div>
            </div>
            <div>
              <h4>3 · Cálculo pela tabela de parâmetros</h4>
              <div className="calc-row"><span>Km total (ida e volta)</span><b>{dados.km} km</b></div>
              <div className="calc-row"><span>Diesel</span><b>{brl(calc.diesel)}</b></div>
              <div className="calc-row"><span>Motorista · 14 h</span><b>{brl(calc.motorista)}</b></div>
              <div className="calc-row"><span>Pedágios ida e volta</span><b>{brl(calc.pedagio)}</b></div>
              <div className="calc-row"><span>Água e itens diversos</span><b>{brl(calc.agua)}</b></div>
              <div className="calc-total">
                <div><span>Custo estimado</span><b>{brl(calc.custo)}</b></div>
                <div><span>Margem estimada</span><b>{calc.margem}%</b></div>
              </div>
              <div className="suggested"><span>Preço sugerido</span><b>{brl(calc.preco)}</b></div>
              <div className="quote-btns">
                <button type="button" className="btn btn-outline btn-lg" onClick={() => showToast("Rascunho salvo.")}>Salvar rascunho</button>
                <button type="button" className="btn btn-gold btn-lg" onClick={gerarProposta}>Gerar proposta</button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Cotações realizadas e aguardando aprovação" right={<Farol g={18} a={cotacoes.filter((c) => c.status === "Aguardando").length + 7} r={16} />} footer={<ViewAll label="Ver todas as 42 cotações" onClick={() => setQuery("")} />}>
        <div className="tbl-wrap">
          <table className="tbl tbl-xs">
            <thead><tr><th>Nº · viagem</th><th>Cliente · destino</th><th>Tipo</th><th>Veículo · motorista</th><th>Pass.</th><th>R$/pass.</th><th>Total</th><th>Margem</th><th>Pagamento</th><th>Resp.</th><th>Status</th><th>Observações</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.n}>
                  <td>{c.n}<span className="sub">{c.data}</span></td>
                  <td>{c.cliente}<span className="sub">{c.destino}</span></td>
                  <td>{c.tipo}</td><td className="wrap" style={{ minWidth: 100 }}>{c.veiculo}</td><td>{c.pass}</td>
                  <td>{(c.total / c.pass).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{brl(c.total)}</td><td>{c.margem}%</td><td>{c.pagamento}</td><td>{c.resp}</td>
                  <td><Pill tone={statusTone(c.status)}>{c.status}</Pill></td>
                  <td className="wrap" style={{ minWidth: 110, maxWidth: 150 }}>{c.obs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Relatório de orçamentos" right={<Segmented variant="head" options={["Dia", "Semana", "Mês", "Ano"]} value={periodo} onChange={setPeriodo} label="Período do relatório" />}>
        <div className="card-body">
          <div className="grid-3" style={{ gridTemplateColumns: "1.15fr 1fr 1fr", gap: 40 }}>
            <div>
              <p className="section-title">Orçamentos por dia · últimos 7 dias</p>
              <LineChart values={[3, 1, 2, 4, 2, 3, 1]} labels={["16/10", "17/10", "18/10", "19/10", "20/10", "21/10", "22/10"]} color="#d99a2b" fill="rgba(217,154,43,.10)" height={190} />
            </div>
            <div>
              <p className="section-title">Resultado do mês · 42 orçamentos</p>
              <div className="donut-wrap">
                <Donut size={176} parts={[[18, "#2f9e5c"], [16, "#be3237"], [8, "#d99a2b"]]} center={<span>43%<br /><span style={{ fontSize: 16 }}>aprovação</span></span>} />
                <div className="legend" style={{ flex: 1 }}>
                  <div><i style={{ background: "#2f9e5c" }} />Aprovados<b>18</b></div>
                  <div><i style={{ background: "#be3237" }} />Reprovados<b>16</b></div>
                  <div><i style={{ background: "#d99a2b" }} />Aguardando<b>8</b></div>
                </div>
              </div>
            </div>
            <div>
              <p className="section-title">Motivos de perda (16)</p>
              <div className="hbars">
                {([["Preço", 9], ["Sem veículo", 5], ["Cliente não informou", 2]] as [string, number][]).map(([l, v]) => (
                  <div className="hbar" key={l} style={{ gridTemplateColumns: "150px 1fr 30px" }}>
                    <span>{l}</span><div className="track"><div className="fill red" style={{ width: `${(v / 9) * 100}%` }} /></div><span className="val">{v}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: "14px 0 0", color: "#666", fontSize: 13 }}>Base para estudar como reduzir o % de perda.</p>
            </div>
          </div>
        </div>
      </Card>

      {ficha && <DetailModal title={ficha} subtitle="Ficha do cliente · comercial" data={{ "Última compra": avisos.find((a) => a.cliente === ficha)?.ultima ?? "—", "Aviso configurado": `${avisos.find((a) => a.cliente === ficha)?.aviso} meses`, "Cotações no ano": cotacoes.filter((c) => c.cliente === ficha).length || 1 }} onClose={() => setFicha(null)} />}
    </Shell>
  );
}
