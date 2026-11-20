"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { screenPaths, type Screen } from "../screen-routes";
import SmartLogo from "./logo";
import { useLocationSearch } from "./use-location-search";

const items: { name: Screen; badge?: string; nested?: boolean }[] = [
  { name: "Cadastros Gerais" },
  { name: "Motoristas" },
  { name: "Veículos" },
  { name: "Clientes" },
  { name: "Empresas" },
  { name: "Contratos" },
  { name: "Contratos fixos", nested: true },
  { name: "Contratos eventuais", nested: true },
  { name: "Financeiro" },
  { name: "Faturamento", nested: true },
  { name: "Programação" },
  { name: "Escalas e Fretamentos", badge: "APP" },
  { name: "Checklists", badge: "APP" },
  { name: "Manutenções e Reparos", badge: "APP" },
  { name: "Eventuais", badge: "APP", nested: true },
  { name: "Agendadas", nested: true },
  { name: "Estoque" },
  { name: "Documentos e RH" },
  { name: "Comercial e Orçamentos" },
];

/** Telas que só abrem a partir de Cadastros Gerais (ou com ?origem=cadastros). */
const fromCadastros = ["/fornecedores"];

export default function RedSidebar() {
  const pathname = usePathname();
  const viaCadastros = new URLSearchParams(useLocationSearch()).get("origem") === "cadastros";

  const activePath = viaCadastros || fromCadastros.includes(pathname) ? "/cadastros-gerais" : pathname;

  return (
    <aside className="sidebar">
      <Link href="/cadastros-gerais" className="brand" aria-label="Viação Smart — início">
        <SmartLogo />
      </Link>
      <nav aria-label="Menu principal">
        {items.map((item) => {
          const href = screenPaths[item.name];
          const active = href === activePath;
          return (
            <Link
              key={item.name}
              href={href}
              className={`nav-item ${active ? "active" : ""} ${item.nested ? "nav-subitem" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="nav-text">{item.name}</span>
              {item.badge && <span className="app-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-foot">
        <div><span className="app-badge">APP</span> Dados vindos do app</div>
        <small>Sem marcação = dados do CRM/ERP</small>
      </div>
    </aside>
  );
}
