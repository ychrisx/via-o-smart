"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Farol, FormModal, Icon, PageHead, SearchBar, Shell, useToast } from "../_components/ui";

type Box = { title: string; href: string; total: number; farol: [number, number, number]; rows: [string, string][] };

const boxes: Box[] = [
  { title: "Fornecedores", href: "/fornecedores", total: 8, farol: [6, 1, 1], rows: [["Auto Peças Vale", "Peças"], ["Pneus Brasil", "Pneus"], ["Lubrax Distribuidora", "Lubrificantes"], ["Vidraçaria Central", "Vidros"], ["Posto Rodovia Sul", "Combustível"]] },
  { title: "Linhas escaladas", href: "/programacao", total: 14, farol: [11, 2, 1], rows: [["São Paulo · Barra Funda → Cajamar", "Fixa"], ["São Paulo → Aeroporto GRU", "Eventual"], ["Osasco → Barueri", "Fixa"], ["Cajamar → Jundiaí", "Fixa"], ["Campinas → Viracopos", "Eventual"]] },
  { title: "Motoristas", href: "/motoristas", total: 32, farol: [27, 4, 1], rows: [["Carlos Almeida", "CNH D"], ["Marcos Souza", "CNH D"], ["Renata Lima", "CNH D"], ["João Pereira", "CNH E"], ["Fernanda Costa", "CNH D"]] },
  { title: "Veículos", href: "/veiculos", total: 24, farol: [19, 3, 2], rows: [["Ônibus 204 · FRT-2J48", "Ônibus normal"], ["Ônibus 187 · GHT-4B21", "Ônibus normal"], ["Van 12 · GKL-3D19", "Van"], ["Ônibus Turismo 07 · GBX-1F66", "Turismo"], ["Micro 31 · HRP-9C27", "Micro executivo"]] },
  { title: "Clientes", href: "/clientes", total: 46, farol: [38, 5, 3], rows: [["Logística Cajamar Ltda", "PJ"], ["Ana Beatriz Rocha", "PF"], ["Associação Vila Nova", "CNPJ"], ["Paulo Mendes", "PF"], ["Colégio Nova Geração", "PJ"]] },
  { title: "Empresas", href: "/empresas", total: 9, farol: [7, 1, 1], rows: [["Limpa Brasil", "Limpeza"], ["Mecânica Paulista", "Manutenção"], ["Seguradora Horizonte", "Seguradora"], ["Lava Rápido Zona Norte", "Limpeza"], ["Auto Elétrica Dias", "Manutenção"]] },
];

const farolParam = { green: "verde", amber: "amarelo", red: "vermelho" } as const;

export default function CadastrosGeraisPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState<string | null>(null);
  const [toast, showToast] = useToast();
  const q = query.trim().toLowerCase();

  return (
    <Shell toast={toast}>
      <PageHead
        title="Cadastros Gerais"
        subtitle="Tudo o que está cadastrado, por categoria."
        hint="Farol de cada caixa: verde = tudo nos conformes ou no prazo · amarelo = atenção ou possível atraso · vermelho = pendente ou em atraso. Clique em uma cor para abrir a tabela já filtrada."
      />
      <SearchBar value={query} onChange={setQuery} />

      <div className="boxes">
        {boxes.map((box) => {
          const rows = q ? box.rows.filter(([n, c]) => `${n} ${c}`.toLowerCase().includes(q)) : box.rows;
          return (
            <Card
              key={box.title}
              className="box"
              title={box.title}
              right={<Farol g={box.farol[0]} a={box.farol[1]} r={box.farol[2]} onPick={(tone) => router.push(`${box.href}?origem=cadastros&farol=${farolParam[tone]}`)} />}
            >
              <div className="box-list">
                {rows.length ? rows.map(([name, cat]) => (
                  <Link key={name} href={`${box.href}?origem=cadastros&busca=${encodeURIComponent(name)}`} className="box-row"><span>{name}</span><small>{cat}</small></Link>
                )) : <div className="empty">Nada encontrado nesta caixa.</div>}
              </div>
              <div className="box-all"><Link className="link-red" href={`${box.href}?origem=cadastros`}>Ver todos os {box.total} cadastros →</Link></div>
              <button type="button" className="btn btn-gold" onClick={() => setCreating(box.title)}><Icon name="plus" size={18} /> Novo cadastro</button>
            </Card>
          );
        })}
      </div>

      {creating && (
        <FormModal
          title="Novo cadastro"
          subtitle={creating}
          fields={[{ label: "Nome / descrição", placeholder: "Digite o nome", required: true }, { label: "Documento / referência", placeholder: "CPF, CNPJ, placa ou código" }, { label: "Contato", placeholder: "Telefone ou e-mail" }]}
          onClose={() => setCreating(null)}
          onSave={(v) => { setCreating(null); showToast(`${v["Nome / descrição"]} cadastrado em ${creating}.`); }}
          submitLabel="Salvar cadastro"
        />
      )}
    </Shell>
  );
}
