"use client";

import CadastroTable, { type CadRow } from "../_components/cadastro-table";

function f(farol: CadRow["farol"], fornecedor: string, categoria: string, cnpj: string, contato: string, contrato: string, situacao: string): CadRow {
  return { farol, data: { fornecedor, categoria, cnpj, contato, contrato, situacao }, tones: { contrato: farol, situacao: situacao === "Ativo" ? "green" : situacao === "Inativo" ? "gray" : "amber" } };
}

const rows: CadRow[] = [
  f("red", "Distribuidora Norte", "Peças", "56.789.012/0001-34", "(11) 3901-2200", "Contrato vencido 30/09/2026", "Inativo"),
  f("amber", "Vidraçaria Central", "Vidros", "34.567.890/0001-22", "(11) 3333-1212", "Contrato vence 30/11/2026", "Ativo"),
  f("green", "Auto Peças Vale", "Peças", "12.345.678/0001-90", "(11) 3333-4400", "Válido até 06/2027", "Ativo"),
  f("green", "Pneus Brasil", "Pneus", "98.765.432/0001-10", "(11) 4002-8922", "Válido até 03/2027", "Ativo"),
  f("green", "Lubrax Distribuidora", "Lubrificantes", "45.678.901/0001-23", "(11) 2455-3000", "Válido até 12/2027", "Ativo"),
  f("green", "Posto Rodovia Sul", "Combustível", "23.456.789/0001-11", "(11) 4444-7000", "Válido até 08/2027", "Ativo"),
  f("green", "Fras-le Distribuidor", "Freios", "67.890.123/0001-45", "(54) 3239-1000", "Válido até 05/2027", "Ativo"),
  f("green", "Paraflu Revenda", "Fluidos", "78.901.234/0001-56", "(11) 2088-4500", "Válido até 10/2027", "Ativo"),
];

export default function FornecedoresPage() {
  return (
    <CadastroTable
      title="Fornecedores"
      subtitle="Tabela completa aberta pelo “Ver todos” ou por uma cor do farol."
      searchPlaceholder="Nome, CNPJ ou categoria"
      selects={[
        { label: "Categoria", column: "categoria", all: "Todas as categorias" },
        { label: "Situação", column: "situacao", all: "Todas", options: ["Ativo", "Inativo"] },
      ]}
      columns={[
        { key: "fornecedor", label: "Fornecedor", sortable: true, strong: true },
        { key: "categoria", label: "Categoria", sortable: true },
        { key: "cnpj", label: "CNPJ" },
        { key: "contato", label: "Contato" },
        { key: "contrato", label: "Contrato", sortable: true },
        { key: "situacao", label: "Situação" },
      ]}
      rows={rows}
      counts={{ green: 6, amber: 1, red: 1, total: 8 }}
    />
  );
}
