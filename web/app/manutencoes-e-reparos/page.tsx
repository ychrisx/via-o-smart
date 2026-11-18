"use client";

import { useMemo, useState } from "react";
import { Card, FormModal, Icon, PageHead, Pill, Segmented, Shell, useToast } from "../_components/ui";

type Chamado = { n: string; por: string; veiculo: string; descricao: string; data: string; situacao: "Aberto" | "Fechado" };

const initial: Chamado[] = [
  { n: "MR-0143", por: "Carlos Almeida", veiculo: "Ônibus 204 · FRT-2J48", descricao: "Pneus dianteiros desgastados", data: "22/10/2026", situacao: "Aberto" },
  { n: "MR-0142", por: "Carlos Almeida", veiculo: "Ônibus 204 · FRT-2J48", descricao: "Ruído no freio dianteiro", data: "21/10/2026", situacao: "Aberto" },
  { n: "MR-0141", por: "Marcos Souza", veiculo: "Ônibus 187 · GHT-4B21", descricao: "Ar-condicionado com baixo rendimento", data: "20/10/2026", situacao: "Aberto" },
  { n: "MR-0140", por: "Renata Lima", veiculo: "Van 15 · FQW-7A52", descricao: "Troca de embreagem", data: "14/10/2026", situacao: "Aberto" },
  { n: "MR-0139", por: "Carlos Almeida", veiculo: "Ônibus 204 · FRT-2J48", descricao: "Troca de óleo", data: "18/10/2026", situacao: "Fechado" },
  { n: "MR-0138", por: "Carlos Almeida", veiculo: "Ônibus 204 · FRT-2J48", descricao: "Revisão de freios", data: "12/10/2026", situacao: "Fechado" },
  { n: "MR-0137", por: "João Pereira", veiculo: "Ônibus Turismo 09 · FKR-8H30", descricao: "Lâmpada do farol queimada", data: "10/10/2026", situacao: "Fechado" },
  { n: "MR-0136", por: "Marcos Souza", veiculo: "Ônibus 187 · GHT-4B21", descricao: "Troca de palhetas do limpador", data: "07/10/2026", situacao: "Fechado" },
];

export default function ManutencoesPage() {
  const [chamados, setChamados] = useState(initial);
  const [filtro, setFiltro] = useState("Ambos");
  const [selected, setSelected] = useState("MR-0143");
  const [modal, setModal] = useState<"novo" | "editar" | null>(null);
  const [toast, showToast] = useToast();

  const rows = useMemo(() => chamados.filter((c) => filtro === "Ambos" || (filtro === "Abertos" ? c.situacao === "Aberto" : c.situacao === "Fechado")), [chamados, filtro]);
  const sel = chamados.find((c) => c.n === selected);

  return (
    <Shell toast={toast}>
      <PageHead title="Manutenções e Reparos" subtitle="Chamados abertos por motoristas." />

      <div className="actions" style={{ marginTop: -2 }}>
        <button type="button" className="btn btn-gold btn-lg" onClick={() => setModal("novo")}><Icon name="plus" /> Novo chamado</button>
        <button type="button" className="btn btn-outline btn-lg" onClick={() => (sel ? setModal("editar") : showToast("Selecione um chamado na tabela."))}><Icon name="edit" /> Editar chamado</button>
        <div style={{ marginLeft: "auto" }}><Segmented options={["Abertos", "Fechados", "Ambos"]} value={filtro} onChange={setFiltro} label="Filtrar chamados" /></div>
      </div>

      <Card title="Chamados" right={<span className="head-badge">{rows.length} chamados</span>}>
        <div className="tbl-wrap">
          <table className="tbl tbl-sm hover">
            <thead><tr><th>Nº</th><th>Aberto por</th><th>Veículo</th><th>Descrição</th><th>Data de abertura</th><th>Situação</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.n} className={c.n === selected ? "sel" : ""} onClick={() => setSelected(c.n)}>
                  <td>{c.n}</td><td>{c.por}</td><td>{c.veiculo}</td><td>{c.descricao}</td><td>{c.data}</td>
                  <td><Pill tone={c.situacao === "Aberto" ? "amber" : "green"}>{c.situacao}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty">Nenhum chamado.</div>}
        </div>
      </Card>

      {modal === "novo" && (
        <FormModal
          title="Novo chamado"
          fields={[{ label: "Aberto por", required: true }, { label: "Veículo", placeholder: "Ex.: Ônibus 204 · FRT-2J48", required: true }, { label: "Descrição", required: true }]}
          onClose={() => setModal(null)}
          onSave={(v) => {
            const n = `MR-0${144 + chamados.length - initial.length}`;
            setChamados((p) => [{ n, por: v["Aberto por"], veiculo: v["Veículo"], descricao: v["Descrição"], data: "18/11/2026", situacao: "Aberto" }, ...p]);
            setSelected(n); setModal(null); showToast(`Chamado ${n} aberto.`);
          }}
          submitLabel="Abrir chamado"
        />
      )}
      {modal === "editar" && sel && (
        <FormModal
          title={`Editar ${sel.n}`}
          fields={[{ label: "Descrição", value: sel.descricao, required: true }, { label: "Situação (Aberto ou Fechado)", value: sel.situacao }]}
          onClose={() => setModal(null)}
          onSave={(v) => {
            const situacao = /fech/i.test(v["Situação (Aberto ou Fechado)"]) ? "Fechado" : "Aberto";
            setChamados((p) => p.map((c) => (c.n === sel.n ? { ...c, descricao: v["Descrição"], situacao } : c)));
            setModal(null); showToast(`${sel.n} atualizado.`);
          }}
        />
      )}
    </Shell>
  );
}
