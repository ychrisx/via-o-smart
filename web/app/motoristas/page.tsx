"use client";

import CadastroTable, { type CadRow } from "../_components/cadastro-table";
import type { Tone } from "../_components/ui";

const hojeTone: Record<string, Tone> = { "Em escala": "green", Livre: "gray", "Conflito de escala": "red", Folga: "gray", Férias: "blue" };

function m(farol: CadRow["farol"], motorista: string, cnh: string, validade: string, veiculos: string, hoje: string, situacao: string): CadRow {
  const tone: Tone = farol === "red" ? "red" : farol === "amber" ? "amber" : "green";
  return { farol, data: { motorista, cnh, validade, veiculos, hoje, situacao }, tones: { validade: tone, hoje: hojeTone[hoje.split(" às")[0]] ?? "gray", situacao: situacao === "Ativo" ? "green" : situacao === "Inativo" ? "gray" : "amber" } };
}

const rows: CadRow[] = [
  m("red", "Marcos Souza", "D", "CNH vencida 02/11/2026", "Ônibus 187 · Ônibus 112", "Em escala", "Ativo"),
  m("amber", "Renata Lima", "D", "Exame vence 15/01/2027", "Ônibus 231 · Van 18", "Conflito de escala", "Ativo"),
  m("amber", "Paulo Dias", "D", "CNH vence 30/11/2026", "Van 21 · Van 12", "Em escala", "Ativo"),
  m("amber", "Luciana Prado", "D", "Curso TPP vence 10/12/2026", "Micro 35", "Em escala", "Ativo"),
  m("amber", "Anderson Lopes", "D", "Exame vence 20/12/2026", "Ônibus 204", "Em escala", "Ativo"),
  m("green", "Carlos Almeida", "D", "CNH válida até 09/2027", "Ônibus 204 · Ônibus 187", "Em escala", "Ativo"),
  m("green", "João Pereira", "E", "CNH válida até 03/2027", "Micro 31 · Ônibus 245", "Livre às 18:30", "Ativo"),
  m("green", "Fernanda Costa", "D", "CNH válida até 11/2027", "Ônibus Turismo 09", "Em escala", "Ativo"),
  m("green", "Ana Paula Reis", "D", "CNH válida até 08/2028", "Van 15", "Folga", "Ativo"),
];

export default function MotoristasPage() {
  return (
    <CadastroTable
      title="Motoristas"
      subtitle="Tabela completa aberta pelo “Ver todos” ou por uma cor do farol."
      searchPlaceholder="Nome, CNH ou veículo"
      selects={[
        { label: "Categoria CNH", column: "cnh", all: "Todas", options: ["D", "E"] },
        { label: "Hoje", column: "hoje", all: "Todos", options: ["Em escala", "Livre", "Conflito de escala", "Folga"] },
      ]}
      columns={[
        { key: "motorista", label: "Motorista", sortable: true, strong: true },
        { key: "cnh", label: "CNH" },
        { key: "validade", label: "Documento", sortable: true },
        { key: "veiculos", label: "Veículos operados" },
        { key: "hoje", label: "Hoje" },
        { key: "situacao", label: "Situação" },
      ]}
      rows={rows}
      counts={{ green: 27, amber: 4, red: 1, total: 32 }}
    />
  );
}
