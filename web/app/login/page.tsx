"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import SmartLogo from "../_components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("abastecedor");
  const [password, setPassword] = useState("smart2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function enter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user.trim() || !password) {
      setError("Informe usuário e senha.");
      return;
    }
    router.push("/");
  }

  return (
    <main className="login">
      <section className="login-brand">
        <SmartLogo />
        <h1>Sistema de Abastecimento</h1>
        <p>Acesso do abastecedor da garagem.</p>
        <p>Ao entrar, abre somente a tela de abastecimento.</p>
      </section>

      <section className="login-side">
        <div className="login-card">
          <h2>Entrar</h2>
          <p className="site">www.viacaosmart.com.br</p>
          <form onSubmit={enter}>
            <label className="field">
              <span>Usuário</span>
              <div className="control"><input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" /></div>
            </label>
            <label className="field">
              <span>Senha</span>
              <div className="control">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" className="toggle" onClick={() => setShowPassword((v) => !v)}>{showPassword ? "ocultar" : "mostrar"}</button>
              </div>
            </label>
            {error && <span className="login-error" role="alert">{error}</span>}
            <button type="submit" className="btn btn-red btn-lg btn-block" style={{ marginTop: 6, fontWeight: 600 }}>Entrar</button>
          </form>
          <div className="login-note">Perfil <strong>Abastecedor</strong>: sem acesso ao restante do ERP.</div>
        </div>
      </section>
    </main>
  );
}
