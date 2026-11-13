# Viação Smart

Sistema de gestão (ERP) da **Viação Smart — Transporte e Turismo**: cadastros gerais
(fornecedores, linhas, motoristas, veículos, clientes, empresas), abastecimento, checklists
de saída e entrega, e futuramente recursos de IA com LangChain.

---

## Arquitetura

```
Navegador ──► web/ (Next.js, localhost:3000)        ← telas do painel (login, cadastros)
                │  fetch no servidor do Next
                ▼
             backend/ (Django + DRF, localhost:8000) ← regras de negócio, login (JWT), API
                │  DATABASE_URL
                ▼
             PostgreSQL no Supabase                  ← dados (tabelas criadas pelas migrations do Django)

Celular ───► frontend/app/ (Expo / React Native)    ← app de campo: abastecimento e checklists
```

| Parte | Tecnologia | Responsabilidade |
|---|---|---|
| `backend/` | Python 3.12, Django 5.2, Django REST Framework, SimpleJWT | API JSON em `/api/...`, admin em `/admin`, autenticação |
| `web/` | Next.js 16, React 19, TypeScript, Tailwind CSS | Painel web: telas e chamadas à API |
| `frontend/app/` | Expo, React Native, Expo Router | App mobile: abastecimento, checklist de saída e de entrega |
| Banco | PostgreSQL 17 (Supabase) | Armazenamento. Extensão `vector` disponível para o LangChain |
| Infra | Docker + Docker Compose | Roda o backend igual em qualquer máquina |

**Regra de ouro:** só o Django fala com o banco. O Next e o app mobile pedem dados ao Django
pela API. As tabelas nascem dos `models.py` do Django (`makemigrations` + `migrate`), nunca à mão.

---

## Estrutura de pastas

```
viacaosmart/
├── backend/                 Django
│   ├── setup/               configurações do projeto (settings.py, urls.py)
│   ├── accounts/            usuário customizado (com perfil) e API de login
│   ├── manage.py
│   ├── requirements.txt     bibliotecas Python (versões exatas, geradas por pip freeze)
│   ├── Dockerfile           receita da imagem do backend
│   └── .dockerignore
├── web/                     Next.js (painel web)
├── frontend/app/            Expo (app mobile)
├── docs/
│   └── aula-docker.md       Docker do zero, aplicado neste projeto
├── docker-compose.yml       sobe o backend
├── .env.example             modelo das variáveis de ambiente (sem segredos)
└── .env                     variáveis reais (NUNCA vai para o Git)
```

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (com "Engine running")
- [Node.js 22+](https://nodejs.org/) (para o Next e o Expo)
- Python 3.12+ (opcional: só para a `.venv` do VS Code e para `pip freeze`)
- Git

---

## Como rodar

### 1. Clonar e configurar o `.env`

```powershell
git clone https://github.com/Gotheus2/viacaosmart.git
cd viacaosmart
copy .env.example .env
```

Edite o `.env`:

| Variável | O que é |
|---|---|
| `DJANGO_SECRET_KEY` | Chave secreta. Gere com `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DJANGO_DEBUG` | `1` em desenvolvimento, `0` em produção |
| `DJANGO_ALLOWED_HOSTS` | Endereços aceitos pelo Django, separados por vírgula |
| `DATABASE_URL` | Endereço do banco. No Supabase: **Connect → Session pooler**. A senha deve ter só letras e números |

> Algumas redes (faculdade, empresa) bloqueiam as portas 5432/6543 do Supabase.
> Se o Django não conectar, teste em outra rede.

### 2. Backend (Django no Docker)

```powershell
docker compose up --build
```

Em outro terminal:

```powershell
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin

> Todo comando do Django roda **dentro do container** (`docker compose exec backend ...`).
> Rodar `python manage.py` direto no Windows não lê o `.env` e dá `KeyError`.

### 3. Painel web (Next.js)

```powershell
cd web
npm install
npm run dev
```

Abra http://localhost:3000

### 4. App mobile (Expo)

```powershell
cd frontend/app
npm install
npm start
```

---

## Autenticação

Login por **usuário e senha** com tokens **JWT**. Cada usuário tem um **perfil**, que define
para qual tela ele vai depois do login (ex.: o motorista acessa só a tela de abastecimento).

| Método | Rota | Corpo / cabeçalho | Resposta |
|---|---|---|---|
| `POST` | `/api/auth/login/` | `{"username": "...", "password": "..."}` | `{"access", "refresh", "usuario": {id, username, nome, perfil}}` |
| `POST` | `/api/auth/refresh/` | `{"refresh": "..."}` | `{"access"}` novo |
| `GET` | `/api/auth/me/` | `Authorization: Bearer <access>` | dados do usuário logado |

Por padrão, toda rota da API exige o token (`IsAuthenticated`). O token de acesso vale 8 horas.

---

## Comandos úteis

| Para... | Comando |
|---|---|
| Subir o backend | `docker compose up --build` |
| Ver logs | `docker compose logs -f backend` |
| Criar migrations após mudar um model | `docker compose exec backend python manage.py makemigrations` |
| Aplicar migrations no banco | `docker compose exec backend python manage.py migrate` |
| Shell do Django | `docker compose exec backend python manage.py shell` |
| Desligar | `docker compose down` |
| Adicionar biblioteca Python | `pip install <pacote>` na `.venv`, depois `pip freeze \| Out-File -Encoding utf8 backend/requirements.txt` e `docker compose up --build` |

---

## Trabalho em equipe (Git)

1. **Antes de começar:** `git pull` para pegar o que os colegas enviaram.
2. Faça suas alterações e confira com `git status` (o `.env` nunca pode aparecer).
3. `git add .` → `git commit -m "mensagem clara"`
4. `git pull` de novo (se der conflito, resolva no VS Code: *Accept Current / Incoming / Both*).
5. `git push`

**Segredos:** senhas e chaves só no `.env`. O `.env.example` leva apenas valores de exemplo.

---

## Documentação de estudo

- [docs/aula-docker.md](docs/aula-docker.md) — Docker do zero, explicado com os arquivos deste projeto.

---

## Próximos passos

- [ ] Tela de login no Next conectada à API
- [ ] Models dos cadastros gerais (fornecedores, linhas, motoristas, veículos, clientes, empresas)
- [ ] Endpoints de cadastros no DRF
- [ ] Integrar o app mobile (Expo) com a API
- [ ] LangChain + pgvector
