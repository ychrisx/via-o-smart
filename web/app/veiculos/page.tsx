"use client";

import CadastroTable, { type CadRow } from "../_components/cadastro-table";
import type { Tone } from "../_components/ui";

const sit: Record<string, Tone> = { "Em operação": "green", "Em manutenção": "amber", "Em viagem": "amber", Parado: "gray" };
const doc: Record<string, Tone> = { red: "red", amber: "amber", green: "green" };

function v(farol: CadRow["farol"], frota: string, placa: string, modelo: string, tipo: string, motorista: string, documento: string, situacao: string): CadRow {
  return { farol, data: { frota, placa, modelo, tipo, motorista, documento, situacao }, tones: { documento: doc[farol], situacao: sit[situacao] } };
}

const rows: CadRow[] = [
  v("red", "Van 18", "BXR-2041", "Sprinter 515", "Executiva", "Renata Lima", "Emdec · vencido 02/10", "Em operação"),
  v("red", "Ônibus 112", "CZQ-9087", "Marcopolo Viale", "Trucado", "Marcos Souza", "Emtu · vencido 15/10", "Em operação"),
  v("amber", "Van 15", "FQW-7A52", "Master Minibus", "Convencional", "—", "IPVA · vence 20/11", "Em manutenção"),
  v("amber", "Ônibus 187", "GHT-4B21", "Marcopolo Viale", "Semi-leito", "Carlos Almeida", "Artesp · vence 15/11", "Em operação"),
  v("amber", "Micro 35", "CKD-4410", "Volare Fly 9", "Convencional", "Renata Lima", "ANTT · vence 28/11", "Em operação"),
  v("amber", "Ônibus Turismo 09", "FKR-8H30", "Paradiso 1550", "Executivo", "Fernanda Costa", "ANTT · vence 30/11", "Em viagem"),
  v("green", "Ônibus 204", "FRT-2J48", "Torino", "Convencional", "Carlos Almeida", "CRLV · vence 03/2027", "Em operação"),
  v("green", "Ônibus 231", "FZP-9C07", "Paradiso 1200", "Executivo", "Renata Lima", "ANTT · vence 05/2027", "Em viagem"),
  v("green", "Ônibus 245", "FYC-3A15", "Marcopolo Viale", "Convencional", "João Pereira", "CRLV · vence 04/2027", "Em operação"),
  v("green", "Van 12", "GKL-3D19", "Sprinter 416", "Executiva", "Marcos Souza", "CRLV · vence 02/2027", "Em operação"),
  v("green", "Micro 31", "HRP-9C27", "Volare W9 · com WC", "Executivo", "João Pereira", "ANTT · vence 06/2027", "Em operação"),
  v("green", "Ônibus Turismo 07", "GBX-1F66", "Paradiso 1200", "Turismo", "—", "CRLV · vence 01/2027", "Parado"),
];

export default function VeiculosPage() {
  return (
    <CadastroTable
      title="Veículos"
      subtitle="Tabela completa aberta pelo “Ver todos” ou por uma cor do farol. Serve de modelo para todas as caixas."
      searchPlaceholder="Placa, prefixo, modelo ou motorista"
      selects={[
        { label: "Tipo", column: "tipo", all: "Todos os tipos" },
        { label: "Documento", column: "documento", all: "Todos", options: ["Emdec", "Emtu", "Artesp", "ANTT", "IPVA", "CRLV"] },
      ]}
      columns={[
        { key: "frota", label: "Frota", sortable: true },
        { key: "placa", label: "Placa" },
        { key: "modelo", label: "Modelo" },
        { key: "tipo", label: "Tipo", sortable: true },
        { key: "motorista", label: "Motorista atual" },
        { key: "documento", label: "Documento", sortable: true },
        { key: "situacao", label: "Situação" },
      ]}
      rows={rows}
      counts={{ green: 19, amber: 4, red: 2, total: 24 }}
    />
  );
}
