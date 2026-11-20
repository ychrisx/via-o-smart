export type Screen =
  | "Cadastros Gerais"
  | "Fornecedores"
  | "Motoristas"
  | "Veículos"
  | "Clientes"
  | "Empresas"
  | "Contratos"
  | "Contratos fixos"
  | "Contratos eventuais"
  | "Financeiro"
  | "Faturamento"
  | "Programação"
  | "Escalas e Fretamentos"
  | "Checklists"
  | "Manutenções e Reparos"
  | "Eventuais"
  | "Agendadas"
  | "Estoque"
  | "Documentos e RH"
  | "Comercial e Orçamentos";

export const screenPaths: Record<Screen, string> = {
  "Cadastros Gerais": "/cadastros-gerais",
  Fornecedores: "/fornecedores",
  Motoristas: "/motoristas",
  Veículos: "/veiculos",
  Clientes: "/clientes",
  Empresas: "/empresas",
  Contratos: "/contratos",
  "Contratos fixos": "/contratos-fixos",
  "Contratos eventuais": "/contratos-eventuais",
  Financeiro: "/financeiro",
  Faturamento: "/faturamento",
  Programação: "/programacao",
  "Escalas e Fretamentos": "/escalas-e-fretamentos",
  Checklists: "/checklists",
  "Manutenções e Reparos": "/manutencoes-e-reparos",
  Eventuais: "/eventuais",
  Agendadas: "/agendadas",
  Estoque: "/estoque",
  "Documentos e RH": "/documentos-e-rh",
  "Comercial e Orçamentos": "/comercial-e-orcamentos",
};
