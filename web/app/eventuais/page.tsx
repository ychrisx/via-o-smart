"use client";

import { useMemo, useState } from "react";
import { Card, Farol, FilterInput, FormModal, Icon, PageHead, Pill, SearchBar, SelectField, Shell, ViewAll, useToast, type Tone } from "../_components/ui";

type Chamado = { n: string; origem: string; veiculo: string; tipo: string; descricao: string; abertura: string; motorista: "Solicitada" | "Retirado"; oficina: "Aberto" | "Em reparo" | "Atrasado" | "Fechado"; fonte: "App" | "Gestor" };

const tipos = ["Mecânica", "Elétrica", "Funilaria e Pintura", "Acessórios", "Pedido de peças"];
const initial: Chamado[] = [
  { n: "MR-0143", origem: "Carlos Almeida", veiculo: "Ônibus 204 · FRT-2J48", tipo: "Mecânica", descricao: "Pneus dianteiros desgastados", abertura: "22/10/2026", motorista: "Solicitada", oficina: "Aberto", fonte: "App" },
  { n: "MR-0142", origem: "Carlos Almeida", veiculo: "Ônibus 204 · FRT-2J48", tipo: "Mecânica", descricao: "Ruído no freio dianteiro", abertura: "21/10/2026", motorista: "Retirado", oficina: "Em reparo", fonte: "App" },
  { n: "MR-0141", origem: "Checklist · Renata Lima", veiculo: "Ônibus 231 · FZP-9C07", tipo: "Elétrica", descricao: "Farol baixo queimado (checklist de saída)", abertura: "22/10/2026", motorista: "Solicitada", oficina: "Aberto", fonte: "App" },
  { n: "MR-0140", origem: "Marcos Souza", veiculo: "Ônibus 187 · GHT-4B21", tipo: "Acessórios", descricao: "Ar-condicionado com baixo rendimento", abertura: "20/10/2026", motorista: "Solicitada", oficina: "Atrasado", fonte: "App" },
  { n: "MR-0138", origem: "João Pereira", veiculo: "Ônibus Turismo 09 · FKR-8H30", tipo: "Elétrica", descricao: "Lâmpada do farol queimada", abertura: "10/10/2026", motorista: "Retirado", oficina: "Fechado", fonte: "App" },
  { n: "MR-0139", origem: "Paulo Dias", veiculo: "Van 21 · GNV-5E88", tipo: "Pedido de peças", descricao: "Retrovisor direito trincado", abertura: "19/10/2026", motorista: "Solicitada", oficina: "Aberto", fonte: "App" },
];
const oficinaTone: Record<Chamado["oficina"], Tone> = { Aberto: "amber", "Em reparo": "amber", Atrasado: "red", Fechado: "green" };

export default function EventuaisPage() {
  const [chamados, setChamados] = useState(initial);
  const [global, setGlobal] = useState("");
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState("Todos os tipos");
  const [origem, setOrigem] = useState("App + gestor");
  const [selected, setSelected] = useState("MR-0143");
  const [showAll, setShowAll] = useState(false);
  const [modal, setModal] = useState<"novo" | "editar" | null>(null);
  const [toast, showToast] = useToast();

  const rows = useMemo(() => {
    const q = `${global} ${query}`.trim().toLowerCase();
    return chamados.filter((c) =>
      (tipo === "Todos os tipos" || c.tipo === tipo) &&
      (origem === "App + gestor" || (origem === "Somente app" ? c.fonte === "App" : c.fonte === "Gestor")) &&
      (!q || q.split(" ").every((w) => `${c.n} ${c.origem} ${c.veiculo} ${c.descricao}`.toLowerCase().includes(w))),
    );
  }, [chamados, global, query, tipo, origem]);
  const sel = chamados.find((c) => c.n === selected);
  const count = { g: chamados.filter((c) => c.oficina === "Fechado").length, a: chamados.filter((c) => c.oficina === "Aberto" || c.oficina === "Em reparo").length, r: chamados.filter((c) => c.oficina === "Atrasado").length };

  function gerarOS() {
    if (!sel) return showToast("Selecione um chamado na tabela.");
    if (sel.oficina === "Fechado") return showToast(`${sel.n} já está fechado.`);
    setChamados((p) => p.map((c) => (c.n === sel.n ? { ...c, oficina: "Em reparo", motorista: "Retirado" } : c)));
    showToast(`OS gerada para ${sel.n} · ${sel.veiculo}. Custos serão baixados do estoque.`);
  }

  return (
    <Shell toast={toast}>
      <PageHead
        title="Manutenções eventuais"
        subtitle="Chamados abertos pelos motoristas no app (e itens Não OK dos checklists)."
        hint="Farol: verde = fechado · amarelo = aberto / em reparo · vermelho = atrasado."
      />
      <SearchBar value={global} onChange={setGlobal} width={560} />

      <div className="filters" style={{ gap: 26 }}>
        <FilterInput label="Filtrar · digite para buscar" placeholder="Nº, veículo ou descrição." value={query} onChange={setQuery} width={300} />
        <SelectField label="Tipo" value={tipo} options={["Todos os tipos", ...tipos]} onChange={setTipo} width={262} />
        <SelectField label="Origem" value={origem} options={["App + gestor", "Somente app", "Somente gestor"]} onChange={setOrigem} width={262} />
      </div>

      <div className="actions">
        <button type="button" className="btn btn-gold btn-lg" onClick={() => setModal("novo")}><Icon name="plus" /> Novo chamado</button>
        <button type="button" className="btn btn-outline btn-lg" onClick={() => (sel ? setModal("editar") : showToast("Selecione um chamado."))}>Editar chamado</button>
        <button type="button" className="btn btn-red btn-lg" onClick={gerarOS}>Gerar manutenção (OS)</button>
      </div>

      <Card title="Chamados eventuais" right={<Farol g={count.g} a={count.a} r={count.r} />} footer={<ViewAll label={showAll ? "Mostrar só os 5 primeiros" : "Ver todos os 43 chamados"} onClick={() => setShowAll((v) => !v)} />} style={{ marginBottom: 14 }}>
        <div className="tbl-wrap">
          <table className="tbl tbl-xs hover">
            <thead><tr><th>Nº</th><th>Origem · aberto por</th><th>Veículo</th><th>Tipo</th><th>Descrição</th><th>Abertura</th><th>Situação · motorista</th><th>Situação · oficina</th></tr></thead>
            <tbody>
              {(showAll ? rows : rows.slice(0, 5)).map((c) => (
                <tr key={c.n} className={c.n === selected ? "sel" : ""} onClick={() => setSelected(c.n)}>
                  <td>{c.n}</td>
                  <td><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Pill tone="dark">{c.fonte === "App" ? "APP" : "GESTOR"}</Pill>{c.origem}</span></td>
                  <td>{c.veiculo}</td><td>{c.tipo}</td><td className="wrap" style={{ minWidth: 190, maxWidth: 230 }}>{c.descricao}</td><td>{c.abertura}</td>
                  <td><Pill tone={c.motorista === "Retirado" ? "green" : "amber"}>{c.motorista}</Pill></td>
                  <td><Pill tone={oficinaTone[c.oficina]}>{c.oficina}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty">Nenhum chamado com esses filtros.</div>}
        </div>
      </Card>
      <p style={{ margin: 0, color: "#555", fontSize: 14 }}>Tipos vêm da lista fixa do gestor (Mecânica, Elétrica, Funilaria e Pintura, Acessórios, Pedido de peças). O motorista não cria opções novas. Custos vêm do estoque.</p>

      {modal === "novo" && (
        <FormModal
          title="Novo chamado"
          subtitle="Aberto pelo gestor"
          fields={[{ label: "Veículo", placeholder: "Ex.: Ônibus 204 · FRT-2J48", required: true }, { label: `Tipo (${tipos.join(", ")})`, value: "Mecânica" }, { label: "Descrição", required: true }]}
          onClose={() => setModal(null)}
          onSave={(v) => {
            const t = tipos.find((x) => x.toLowerCase() === v[`Tipo (${tipos.join(", ")})`].trim().toLowerCase()) ?? "Mecânica";
            const n = `MR-0${144 + chamados.length - initial.length}`;
            setChamados((p) => [{ n, origem: "Gestor", veiculo: v["Veículo"], tipo: t, descricao: v["Descrição"], abertura: "18/11/2026", motorista: "Solicitada", oficina: "Aberto", fonte: "Gestor" }, ...p]);
            setSelected(n); setModal(null); showToast(`Chamado ${n} aberto.`);
          }}
          submitLabel="Abrir chamado"
        />
      )}
      {modal === "editar" && sel && (
        <FormModal
          title={`Editar ${sel.n}`}
          fields={[{ label: "Descrição", value: sel.descricao, required: true }, { label: "Situação · oficina (Aberto, Em reparo, Atrasado, Fechado)", value: sel.oficina }]}
          onClose={() => setModal(null)}
          onSave={(v) => {
            const of = (["Aberto", "Em reparo", "Atrasado", "Fechado"] as const).find((x) => x.toLowerCase() === v["Situação · oficina (Aberto, Em reparo, Atrasado, Fechado)"].trim().toLowerCase()) ?? sel.oficina;
            setChamados((p) => p.map((c) => (c.n === sel.n ? { ...c, descricao: v["Descrição"], oficina: of } : c)));
            setModal(null); showToast(`${sel.n} atualizado.`);
          }}
        />
      )}
    </Shell>
  );
}
