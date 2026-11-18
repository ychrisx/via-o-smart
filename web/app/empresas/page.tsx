"use client";

import { useMemo, useState } from "react";
import { Card, DetailModal, Farol, FilterInput, FormModal, Icon, PageHead, Pill, Shell, ViewAll, useToast, type Tone } from "../_components/ui";

type Empresa = { nome: string; cnpj: string; vigencia: string; situacao: "Ativo" | "Inativo" | "Incompleto"; contato?: string; veiculos?: string; escalas?: string };
type Categoria = { nome: string; empresas: Empresa[] };

const sublocacao: Empresa[] = [
  { nome: "Rota Sul Fretamentos", cnpj: "12.345.111/0001-20", contato: "(11) 3100-2020", veiculos: "3 ônibus · 1 van", escalas: "6 linhas", vigencia: "01/04/2026 a 31/03/2027", situacao: "Ativo" },
  { nome: "TransVale Locações", cnpj: "23.456.222/0001-31", contato: "(19) 3200-4040", veiculos: "2 micros", escalas: "2 linhas", vigencia: "01/09/2026 a 31/08/2027", situacao: "Ativo" },
  { nome: "Expresso Leste", cnpj: "34.567.333/0001-42", contato: "(11) 3300-6060", veiculos: "—", escalas: "—", vigencia: "01/08/2025 a 31/07/2026", situacao: "Inativo" },
];

const categoriasIniciais: Categoria[] = [
  { nome: "Limpeza", empresas: [{ nome: "Limpa Brasil", cnpj: "66.777.888/0001-99", vigencia: "até 31/12/2026", situacao: "Ativo" }, { nome: "Lava Rápido Zona Norte", cnpj: "77.888.999/0001-00", vigencia: "até 31/05/2027", situacao: "Ativo" }] },
  { nome: "Manutenção", empresas: [{ nome: "Mecânica Paulista", cnpj: "88.999.000/0001-11", vigencia: "até 28/02/2027", situacao: "Ativo" }, { nome: "Auto Elétrica Central", cnpj: "99.000.111/0001-22", vigencia: "venceu 31/07/2026", situacao: "Inativo" }] },
  { nome: "Seguradoras", empresas: [{ nome: "Seguradora Horizonte", cnpj: "10.111.222/0001-33", vigencia: "até 31/01/2027", situacao: "Ativo" }, { nome: "Proteção Total Seguros", cnpj: "21.222.333/0001-44", vigencia: "até 30/04/2027", situacao: "Ativo" }] },
  { nome: "Borracharia", empresas: [{ nome: "Borracharia Anhanguera", cnpj: "31.333.444/0001-55", vigencia: "até 30/06/2027", situacao: "Ativo" }, { nome: "Pneu Forte Cajamar", cnpj: "42.444.555/0001-66", vigencia: "—", situacao: "Incompleto" }] },
  { nome: "Rastreamento", empresas: [{ nome: "ABM Bus", cnpj: "53.555.666/0001-77", vigencia: "até 31/12/2027", situacao: "Ativo" }] },
];

const tone: Record<Empresa["situacao"], Tone> = { Ativo: "green", Inativo: "amber", Incompleto: "red" };
const farolOf = (list: Empresa[]) => ({ g: list.filter((e) => e.situacao === "Ativo").length, a: list.filter((e) => e.situacao === "Inativo").length, r: list.filter((e) => e.situacao === "Incompleto").length });
const plural = (n: number) => `Ver todas as ${n} empresas`;

export default function EmpresasPage() {
  const [query, setQuery] = useState("");
  const [categorias, setCategorias] = useState(categoriasIniciais);
  const [subs, setSubs] = useState(sublocacao);
  const [detail, setDetail] = useState<Empresa | null>(null);
  const [modal, setModal] = useState<"empresa" | "categoria" | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, showToast] = useToast();

  const q = query.trim().toLowerCase();
  const match = (e: Empresa, cat: string) => !q || `${e.nome} ${e.cnpj} ${cat}`.toLowerCase().includes(q);
  const subsFiltered = useMemo(() => subs.filter((e) => match(e, "sublocação")), [subs, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const fSub = farolOf(subs);

  return (
    <Shell toast={toast}>
      <PageHead
        title="Empresas terceirizadas"
        subtitle="Prestadoras de serviço por função. Sublocação em destaque."
        hint="Farol: verde = ativo · amarelo = cadastro incompleto · vermelho = inativo. Cada caixa mostra as 5 primeiras."
      />

      <div className="filters" style={{ justifyContent: "space-between", marginBottom: 20 }}>
        <FilterInput label="Filtrar empresas · digite para buscar" placeholder="Nome, CNPJ ou função.." value={query} onChange={setQuery} width={388} />
        <button type="button" className="btn btn-gold btn-lg" onClick={() => setModal("empresa")}><Icon name="plus" /> Nova empresa</button>
      </div>

      <Card title={<>Sublocação <span className="head-tag">Ligada a Escalas e Motoristas</span></>} right={<Farol g={fSub.g} a={fSub.a} r={fSub.r} />} footer={<ViewAll label={plural(subs.length)} onClick={() => setQuery("")} />}>
        <div className="tbl-wrap">
          <table className="tbl hover">
            <thead><tr><th>Empresa</th><th>CNPJ</th><th>Contato</th><th>Veículos sublocados</th><th>Escalas vinculadas</th><th>Vigência</th><th>Situação</th></tr></thead>
            <tbody>
              {subsFiltered.map((e) => (
                <tr key={e.cnpj} onClick={() => setDetail(e)}>
                  <td>{e.nome}</td><td>{e.cnpj}</td><td>{e.contato}</td><td>{e.veiculos}</td><td>{e.escalas}</td><td>{e.vigencia}</td><td><Pill tone={tone[e.situacao]}>{e.situacao}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!subsFiltered.length && <div className="empty">Nenhuma empresa encontrada.</div>}
        </div>
      </Card>

      <div className="company-grid">
        {categorias.map((c) => {
          const list = c.empresas.filter((e) => match(e, c.nome));
          const f = farolOf(c.empresas);
          const shown = expanded === c.nome ? list : list.slice(0, 5);
          return (
            <Card key={c.nome} title={c.nome} right={<Farol g={f.g} a={f.a} r={f.r} />} footer={<ViewAll label={plural(c.empresas.length)} onClick={() => setExpanded(expanded === c.nome ? null : c.nome)} />}>
              <div className="tbl-wrap">
                <table className="tbl hover">
                  <thead><tr><th>Empresa</th><th>CNPJ</th><th>Vigência</th><th>Situação</th></tr></thead>
                  <tbody>
                    {shown.map((e) => (
                      <tr key={e.cnpj} onClick={() => setDetail(e)}>
                        <td>{e.nome}</td><td>{e.cnpj}</td><td>{e.vigencia}</td><td><Pill tone={tone[e.situacao]}>{e.situacao}</Pill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!shown.length && <div className="empty">{c.empresas.length ? "Nenhuma empresa encontrada." : "Nenhuma empresa nesta categoria ainda."}</div>}
              </div>
            </Card>
          );
        })}
        <div className="add-category">
          <button type="button" className="btn btn-outline btn-lg" onClick={() => setModal("categoria")}><Icon name="plus" /> Criar nova categoria (tabela)</button>
          <span>Ex.: guincho, vistoria, despachante</span>
        </div>
      </div>

      {detail && <DetailModal title={detail.nome} subtitle="Empresa terceirizada" data={{ CNPJ: detail.cnpj, Contato: detail.contato ?? "—", "Veículos sublocados": detail.veiculos ?? "—", "Escalas vinculadas": detail.escalas ?? "—", Vigência: detail.vigencia, Situação: detail.situacao }} onClose={() => setDetail(null)} />}
      {modal === "categoria" && (
        <FormModal title="Nova categoria" fields={[{ label: "Nome da categoria", placeholder: "Ex.: Guincho", required: true }]} onClose={() => setModal(null)}
          onSave={(v) => { setCategorias((p) => [...p, { nome: v["Nome da categoria"], empresas: [] }]); setModal(null); showToast(`Categoria ${v["Nome da categoria"]} criada.`); }} submitLabel="Criar categoria" />
      )}
      {modal === "empresa" && (
        <FormModal title="Nova empresa" fields={[{ label: "Nome", required: true }, { label: "CNPJ" }, { label: `Categoria (Sublocação, ${categorias.map((c) => c.nome).join(", ")})`, value: "Limpeza" }, { label: "Vigência", placeholder: "até dd/mm/aaaa" }]}
          onClose={() => setModal(null)}
          onSave={(v) => {
            const catKey = Object.keys(v).find((k) => k.startsWith("Categoria"))!;
            const empresa: Empresa = { nome: v.Nome, cnpj: v.CNPJ || "—", vigencia: v["Vigência"] || "—", situacao: v.CNPJ && v["Vigência"] ? "Ativo" : "Incompleto" };
            if (/subloc/i.test(v[catKey])) setSubs((p) => [...p, { ...empresa, contato: "—", veiculos: "—", escalas: "—" }]);
            else setCategorias((p) => { const nome = p.find((c) => c.nome.toLowerCase() === v[catKey].trim().toLowerCase())?.nome ?? p[0].nome; return p.map((c) => (c.nome === nome ? { ...c, empresas: [...c.empresas, empresa] } : c)); });
            setModal(null); showToast(`${v.Nome} cadastrada.`);
          }} submitLabel="Salvar empresa" />
      )}
    </Shell>
  );
}
