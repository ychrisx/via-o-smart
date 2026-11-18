"use client";

import { useMemo, useState } from "react";
import { Card, DetailModal, Farol, FilterInput, FormModal, Icon, PageHead, Pill, Shell, ViewAll, useToast, type Tone } from "../_components/ui";

type Cliente = { nome: string; tipo: "PF" | "PJ" | "Associação" | "MEI"; documento: string; contato: string; contratos: number; ultima: string; cadastro: "Ativo" | "Inativo" | "Cadastro incompleto"; cidade: string };

const initial: Cliente[] = [
  { nome: "Logística Cajamar Ltda", tipo: "PJ", documento: "CNPJ 11.222.333/0001-44", contato: "(11) 4444-1000", contratos: 2, ultima: "24/10/2026", cadastro: "Ativo", cidade: "Cajamar" },
  { nome: "Ana Beatriz Rocha", tipo: "PF", documento: "CPF 123.456.789-00", contato: "(11) 98765-4321", contratos: 1, ultima: "12/10/2026", cadastro: "Ativo", cidade: "São Paulo" },
  { nome: "Aeroporto GRU Serviços", tipo: "PJ", documento: "CNPJ 22.333.444/0001-55", contato: "(11) 2445-2000", contratos: 1, ultima: "18/10/2026", cadastro: "Ativo", cidade: "Guarulhos" },
  { nome: "Associação Vila Nova", tipo: "Associação", documento: "CNPJ 44.555.666/0001-77", contato: "(11) 3322-4000", contratos: 1, ultima: "24/10/2026", cadastro: "Ativo", cidade: "Osasco" },
  { nome: "Indústria Barueri S.A.", tipo: "PJ", documento: "CNPJ 33.444.555/0001-66", contato: "(11) 4166-3000", contratos: 1, ultima: "01/10/2026", cadastro: "Ativo", cidade: "Barueri" },
  { nome: "Paulo Mendes", tipo: "PF", documento: "CPF 987.654.321-00", contato: "(11) 97654-3210", contratos: 1, ultima: "18/10/2026", cadastro: "Ativo", cidade: "São Paulo" },
  { nome: "Eventos Silva MEI", tipo: "MEI", documento: "CNPJ 55.666.777/0001-88", contato: "(11) 95555-6000", contratos: 0, ultima: "há 4 meses", cadastro: "Inativo", cidade: "São Paulo" },
  { nome: "Fernanda Costa", tipo: "PF", documento: "CPF 456.789.123-00", contato: "—", contratos: 0, ultima: "—", cadastro: "Cadastro incompleto", cidade: "—" },
];

const tipos = [["Todos", 46], ["PF", 18], ["PJ", 22], ["Associação", 4], ["MEI", 2]] as const;
const cadastroTone: Record<Cliente["cadastro"], Tone> = { Ativo: "green", Inativo: "gray", "Cadastro incompleto": "amber" };

export default function ClientesPage() {
  const [clientes, setClientes] = useState(initial);
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState<string>("Todos");
  const [detail, setDetail] = useState<Cliente | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, showToast] = useToast();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clientes.filter((c) => (tipo === "Todos" || c.tipo === tipo) && (!q || `${c.nome} ${c.documento} ${c.cidade}`.toLowerCase().includes(q)));
  }, [clientes, query, tipo]);

  return (
    <Shell toast={toast}>
      <PageHead
        title="Clientes"
        subtitle="Uma tabela só, filtrada por tipo. Clique em um cliente para abrir a ficha."
        hint="Farol: verde = ativo · amarelo = cadastro incompleto · vermelho = inativo. Linha muda de cor ao passar o mouse (exemplo na 3ª linha)."
      />

      <div className="filters" style={{ gap: 24, marginBottom: 22 }}>
        <FilterInput label="Filtrar clientes · digite para buscar" placeholder="Nome, documento ou cidade." value={query} onChange={setQuery} width={420} />
        <div className="field">
          <span>Tipo de cliente</span>
          <div className="chips" style={{ gap: 8 }}>
            {tipos.map(([t, n]) => (
              <button key={t} type="button" className={`chip ${tipo === t ? "on" : ""}`} style={{ minHeight: 34 }} onClick={() => setTipo(t)} aria-pressed={tipo === t}>{t} <b>{n}</b></button>
            ))}
          </div>
        </div>
        <button type="button" className="btn btn-gold btn-lg" style={{ marginLeft: "auto" }} onClick={() => setCreating(true)}><Icon name="plus" /> Novo cliente</button>
      </div>

      <Card title="Clientes" right={<Farol g={38} a={5} r={3} />} footer={<ViewAll label="Ver todos os 46 clientes" onClick={() => { setTipo("Todos"); setQuery(""); }} />}>
        <div className="tbl-wrap">
          <table className="tbl tbl-sm hover">
            <thead><tr><th>Cliente</th><th>Tipo</th><th>Documento</th><th>Contato</th><th>Contratos ativos</th><th>Última compra</th><th>Cadastro</th><th>Dados gerais</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.documento} onClick={() => setDetail(c)}>
                  <td><span className="cell-name"><i className="avatar" />{c.nome}</span></td>
                  <td><Pill tone={c.tipo === "PJ" ? "blue" : "gray"}>{c.tipo}</Pill></td>
                  <td>{c.documento}</td>
                  <td>{c.contato}</td>
                  <td>{c.contratos}</td>
                  <td>{c.ultima.startsWith("há") ? <Pill tone="red">{c.ultima}</Pill> : c.ultima}</td>
                  <td><Pill tone={cadastroTone[c.cadastro]}>{c.cadastro}</Pill></td>
                  <td><button type="button" className="link-red" style={{ fontSize: 14 }} onClick={(e) => { e.stopPropagation(); setDetail(c); }}>Abrir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty">Nenhum cliente encontrado.</div>}
        </div>
      </Card>

      {detail && (
        <DetailModal
          title={detail.nome}
          subtitle="Ficha do cliente"
          data={{ Tipo: detail.tipo, Documento: detail.documento, Contato: detail.contato, Cidade: detail.cidade, "Contratos ativos": detail.contratos, "Última compra": detail.ultima, Cadastro: detail.cadastro }}
          onClose={() => setDetail(null)}
        />
      )}
      {creating && (
        <FormModal
          title="Novo cliente"
          fields={[{ label: "Nome / razão social", required: true }, { label: "Tipo (PF, PJ, Associação, MEI)", value: "PJ" }, { label: "CPF / CNPJ" }, { label: "Contato" }, { label: "Cidade" }]}
          onClose={() => setCreating(false)}
          onSave={(v) => {
            const t = (["PF", "PJ", "Associação", "MEI"].includes(v["Tipo (PF, PJ, Associação, MEI)"]) ? v["Tipo (PF, PJ, Associação, MEI)"] : "PJ") as Cliente["tipo"];
            const completo = Boolean(v["CPF / CNPJ"] && v.Contato);
            setClientes((p) => [{ nome: v["Nome / razão social"], tipo: t, documento: v["CPF / CNPJ"] || "—", contato: v.Contato || "—", contratos: 0, ultima: "—", cadastro: completo ? "Ativo" : "Cadastro incompleto", cidade: v.Cidade || "—" }, ...p]);
            setCreating(false);
            showToast("Cliente cadastrado.");
          }}
          submitLabel="Salvar cliente"
        />
      )}
    </Shell>
  );
}
