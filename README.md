# Visão Tech – Plataforma Especializada em Eventos de Tecnologia para Startups

Aplicação completa para coleta, centralização e visualização de eventos de tecnologia voltados para startups, utilizando web scraping, API própria, métricas especializadas e uma interface interativa.

## Índice
1. [Sobre o Projeto](#sobre-o-projeto)
2. [O Problema](#o-problema)
3. [A Solução](#a-solução)
4. [Funcionalidades e Diferenciais](#funcionalidades-e-diferenciais)
5. [Tecnologias](#tecnologias)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Pré-requisitos](#pré-requisitos)
8. [Configuração das Variáveis de Ambiente](#configuração-das-variáveis-de-ambiente)
9. [Como Rodar](#como-rodar)
    - [Rodar com Docker (Recomendado)](#rodar-com-docker-recomendado)
    - [Rodar Localmente](#rodar-localmente-sem-docker)
10. [Evoluções Futuras](#evoluções-futuras)
11. [Contribuindo](#contribuindo)


## Sobre o Projeto

O Visão Tech é um sistema desenvolvido pelo Squad 13 – Brasil Startups para facilitar o acesso a eventos voltados exclusivamente para startups e tecnologia.

A aplicação realiza coleta automatizada de eventos, armazena em um banco estruturado e apresenta métricas e visualizações que ajudam usuários a encontrarem oportunidades rapidamente.

## Problema

A busca por informações sobre eventos é complexa e não atende à necessidade específica de eventos para startups na área de tecnologia. Os portais existentes contêm eventos em todas as áreas, fazendo com que a busca por eventos específicos demande muito tempo.

Além disso, há uma falta de métricas relacionadas a esses eventos, dificultando a análise de relevância. A informação desse nicho é dispersa, sem uma ferramenta de centralização e foco.

## Solução

Uma aplicação que centraliza eventos de tecnologia, oferecendo busca rápida e análise de métricas, totalmente focada na experiência do usuário.

1.  **Coleta:** O sistema realiza Web Scraping semanal no Sympla para coletar dados atualizados.
2.  **Armazenamento:** Os dados são estruturados e salvos no MongoDB.
3.  **API:** O Backend disponibiliza endpoints que servem os eventos e calculam métricas.
4.  **Interface:** O Frontend apresenta os dados de forma clara.
5.  **Interação:** O usuário pode consultar, salvar na agenda e exportar relatórios.

## Funcionalidades e Diferenciais

*   🕷️ **Web Scraping Automatizado:** Coleta periódica de eventos de tecnologia.
*   📊 **Dashboard de Métricas:** Análises específicas sobre o volume e tipos de eventos.
*   📅 **Integração com Google Agenda:** Adicione eventos ao seu calendário com um clique.
*   📄 **Exportação em PDF:** Gere relatórios das métricas e listas de eventos.
*   🎯 **Foco Especializado:** Curadoria exclusiva para startups e tecnologia, economizando o tempo do usuário.

## Evoluções Futuras

- Expansão da Coleta: usar o web scraper para coletar dados de outros sites de eventos.
- Refinamento de Filtros: melhorar a filtragem dos eventos coletados.
- Métricas e Análises: aprimorar métricas existentes e criar novas análises mais complexas usando o volume crescente de dados.

## Tecnologias
O projeto utiliza uma stack moderna baseada em JavaScript/TypeScript:

*   **Coleta de Dados:** Node.js, Puppeteer, Cheerio
*   **Backend:** Node.js, Express
*   **Banco de Dados:** MongoDB (Mongoose)
*   **Frontend:** React.js, Vite, CSS Modules/Tailwind
*   **Infraestrutura:** Docker, Docker Compose

## Estrutura do Projeto
```bash
├── backend/
│ ├── api/ # API REST em Node.js + Express
│ │ ├── src/routes/
│ │ ├── src/controllers/
│ │ └── .env-example
│ └── web-scraping/ # Serviço de coleta automática
│ ├── scraper/
│ └── .env-example
│
├── frontend/ # SPA em React + Vite
│ ├── src/
│ └── .env-example
│
├── docker-compose.yml
└── README.md
```

## Requisitos

- Docker & Docker Compose (recomendado)
- Node.js 18+ e npm (se preferir rodar local sem Docker)
- Conta/cluster MongoDB (Atlas ou local)

## Variáveis de Ambiente (exemplos)

Arquivos de exemplo já estão no repositório dentro de cada serviço:

- `backend/api/.env-example`
- `backend/web-scraping/.env-example`

Valores importantes:

- `MONGO_URI` : string de conexão com MongoDB (ex.: `mongodb+srv://<user>:<pass>@cluster...`).
- `DB_NAME` : nome do banco (ex.: `sympla_db`).
- `PORT` : porta da API (padrão `3000`).
- `BASE_URL` (scraper) : URL base a ser raspada.
- `VITE_API_URL` (frontend) : endpoint da API consumido pela aplicação.


## Rodando com Docker Compose (recomendado)

1. Copie os arquivos de exemplo `.env-example` para `.env` em cada serviço e ajuste valores.
2. No diretório raiz do projeto execute:

```bash
docker compose up --build
```

Isso criará/ligará os containers: `sympla-scraper`, `sympla-backend` e `sympla-frontend`.

Para rodar em background:

```bash
docker compose up -d --build
```

Para parar e remover containers:

```bash
docker compose down
```

## Rodando localmente sem Docker

Backend (API):

```bash
cd backend/api
npm install
node src/index.js
```

Web-scraping:

```bash
cd backend/web-scraping
npm install
node src/index.js
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Observação: garanta que as `ENV` necessárias estejam definidas (ex.: `MONGO_URI`) ao rodar localmente.

## Endpoints Principais

- `GET /events` - lista eventos (endpoint implementado no backend).
- `GET /metricas` - retorna métricas/estatísticas.

Confira os arquivos em `backend/api/src/routes/` para a lista completa de rotas.

## Scripts úteis

- `frontend`: `npm run dev` 
- `backend/api`: `cd backend/web-scraping` -> `node src/index.js`
- `backend/web-scraping`: `cd backend/api` -> `node src/index.js`

## Observação
Este projeto foi desenvolvido em equipe como parte de um desafio acadêmico. Todo o processo envolveu colaboração entre os membros do grupo, com divisão de tarefas entre backend, frontend, design e integrações necessárias.

## Contribuindo

Contribuições são bem-vindas! Abra issues para bugs e sugestões e envie pull requests seguindo as boas práticas.