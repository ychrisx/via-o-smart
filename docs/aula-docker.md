# Docker do zero, aplicado no Viação Smart

Este arquivo é para reler sempre que bater dúvida. Cada conceito aparece primeiro
explicado e depois **apontado no nosso projeto**.

---

## 1. O problema

O backend precisa de: Python 3.12, Django 5.2, DRF, psycopg, as variáveis do `.env`...
No seu Windows tem Python 3.14. No servidor, talvez nada instalado.
Docker empacota **o sistema + tudo que ele precisa** e roda igual em qualquer lugar.

## 2. As peças no seu Windows

```
Terminal: "docker ..."          Docker Desktop (o app)
      │  (controle remoto)            │ liga o motor
      ▼                               ▼
  Docker CLI  ─────────────►  Docker Engine  ──► containers
                               (roda dentro do WSL2,
                                um Linux escondido no Windows)
```

| Erro que você já viu | Tradução |
|---|---|
| `failed to connect to the docker API` | O controle remoto não achou o motor. Abra o Docker Desktop. |
| `Wsl/.../ERROR_TIMEOUT` ou `docker info` travado | O Linux escondido travou. `wsl --shutdown` e abra o Docker Desktop de novo. |

**Teste:** `docker version` mostra duas partes: **Client** (CLI) e **Server** (Engine).
Se o Server der erro, o motor está desligado.

## 3. Imagem x Container

| | Imagem | Container |
|---|---|---|
| O que é | Molde congelado (sistema + programas) | Imagem **rodando** |
| Python | Uma classe | Um objeto |
| No projeto | `viacaosmart-backend` (criada pelo nosso Dockerfile) | `viacaosmart-backend-1` |

**Veja no projeto:**

```powershell
docker images            # aparece viacaosmart-backend e python:3.12-slim
docker compose ps        # aparece viacaosmart-backend-1 rodando
```

## 4. O Dockerfile do backend, linha por linha (`backend/Dockerfile`)

```dockerfile
FROM python:3.12-slim
```
Parte da imagem oficial do Python 3.12 (um Debian Linux enxuto). Toda imagem nasce de outra.

```dockerfile
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
```
Variáveis fixas na imagem: não criar `.pyc` e mostrar os logs na hora (sem "balde" de buffer).
O `\` continua o comando na linha de baixo.

```dockerfile
WORKDIR /app
```
"cd /app" — tudo daqui para baixo acontece nessa pasta (ela é criada se não existir).

```dockerfile
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
```
Copia **só** a lista de bibliotecas e instala. `RUN` executa **durante o build** e grava o
resultado na imagem.

```dockerfile
COPY . .
```
Copia o resto do código (tudo de `backend/`, menos o que está no `.dockerignore`).

```dockerfile
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```
`EXPOSE` só documenta a porta. `CMD` é o comando que roda **toda vez que o container sobe**.
`0.0.0.0` = aceitar conexões de fora do container (do seu navegador).

### O cache de camadas (o conceito mais importante)

Cada linha vira uma **camada** guardada em cache. Quando uma camada muda, **ela e todas
abaixo** são refeitas:

```
FROM python:3.12-slim          ← igual → CACHED
ENV ...                        ← igual → CACHED
WORKDIR /app                   ← igual → CACHED
COPY requirements.txt .        ← o arquivo mudou?   NÃO → CACHED
RUN pip install ...            ←                    NÃO → CACHED (economiza minutos)
COPY . .                       ← código mudou → refaz daqui pra baixo
```

**Você vai ver isso acontecer na prática** quando adicionarmos o DRF ao `requirements.txt`:
o `COPY requirements.txt` muda → o `pip install` roda de novo. Já quando você mexe só num
`.py`, o build termina em segundos.

## 5. O `.dockerignore` (`backend/.dockerignore`)

Igual ao `.gitignore`, mas para o `COPY . .`. Ele fica **dentro de `backend/`** porque o
contexto do build é `./backend`.

```text
.venv/        a .venv é do Windows; o container instala as próprias bibliotecas
.git/         histórico não serve lá dentro
.env          senhas NUNCA dentro da imagem (entram pelo env_file, quando o container sobe)
__pycache__/  lixo do Python
*.pyc
```

## 6. O `docker-compose.yml`, linha por linha

```yaml
services:            # lista de containers do projeto
  backend:           # nome do serviço (vira o "nome de máquina" na rede interna)
    build: ./backend # construa a imagem com o Dockerfile de ./backend
    env_file: .env   # entregue todas as variáveis do .env ao container
    volumes:
      - ./backend:/app   # bind mount: a pasta backend do Windows espelhada em /app
    ports:
      - "8000:8000"      # porta_do_Windows:porta_do_container
```

É exatamente o mesmo que este comando gigante, só que organizado:

```text
docker build -t viacaosmart-backend ./backend
docker run -p 8000:8000 --env-file .env -v ./backend:/app viacaosmart-backend
```

### Por que o banco não está aqui?

Porque ele está no **Supabase** (nuvem). O container do Django fala com o Supabase pela
internet usando a `DATABASE_URL` do `.env`. Se um dia quisermos um Postgres local, ele vira
mais um serviço neste arquivo.

### Volume nomeado x bind mount

| | Bind mount (`./backend:/app`) | Volume nomeado (`dados:/var/lib/...`) |
|---|---|---|
| Onde fica | Numa pasta sua | O Docker guarda |
| Para quê | **Código** (você salva no VS Code, o Django recarrega) | **Dados** (sobrevivem ao container) |
| No projeto | ✅ usamos | Não usamos (o banco está no Supabase) |

## 7. A vida de um `docker compose up --build` no nosso projeto

```
1. Lê docker-compose.yml + .env
2. build: executa o backend/Dockerfile → imagem viacaosmart-backend
3. Cria a rede viacaosmart_default
4. Cria o container viacaosmart-backend-1 com:
   - as variáveis do .env
   - a pasta backend espelhada em /app
   - a porta 8000 ligada ao Windows
5. Roda o CMD: python manage.py runserver 0.0.0.0:8000
6. O Django lê DATABASE_URL e conecta no Supabase
```

## 8. Os comandos do dia a dia, decifrados

```text
docker compose   exec      backend    python manage.py migrate
└─ ferramenta ─┘ └─ ação ┘ └serviço┘  └── comando que roda LÁ DENTRO ──┘
```

| Comando | O que faz |
|---|---|
| `docker compose up --build` | Constrói a imagem e sobe, mostrando os logs |
| `docker compose up -d` | Sobe em segundo plano. Também **recria** o container se o `.env` mudou |
| `docker compose logs -f backend` | Logs ao vivo (Ctrl+C sai só dos logs) |
| `docker compose ps` | O que está rodando |
| `docker compose exec backend <cmd>` | Roda um comando **no container que já está rodando** |
| `docker compose run --rm backend <cmd>` | Cria um container **temporário** só para o comando |
| `docker compose restart backend` | Reinicia, mas **não** relê o `.env` |
| `docker compose down` | Para e apaga os containers (o código e o Supabase ficam intactos) |
| `docker compose exec backend bash` | "Entra" no Linux do container (saia com `exit`) |

**Por que todo comando do Django passa pelo Docker?** Porque é lá dentro que estão o
Python 3.12, as bibliotecas e as variáveis do `.env`. No Windows dá `KeyError`.

**Quando preciso de `--build`?** Sempre que mudar o `Dockerfile` ou o `requirements.txt`.
Mudou só código `.py`? Não precisa: o bind mount entrega na hora e o Django recarrega.

## 9. Exercícios no próprio projeto

1. `docker compose up --build` e leia o log: ache as linhas `CACHED` e a linha
   `Starting development server`.
2. `docker compose exec backend bash`, e lá dentro:
   - `pwd` → `/app` (o WORKDIR)
   - `ls` → seus arquivos (bind mount)
   - `python --version` → 3.12, não o 3.14 do Windows
   - `env | grep DJANGO` → variáveis vindas do `env_file`
   - `exit`
3. Com o `up` rodando, adicione uma linha em branco em `backend/setup/urls.py` e salve.
   Veja no log: `changed, reloading`.
4. `docker images` e `docker system df`: quanto espaço o Docker está usando?
