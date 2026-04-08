# Sistema de Denuncias de Bullying

Projeto completo com frontend em HTML, CSS e JavaScript puro e backend em Node.js com Express e PostgreSQL, pronto para deploy no Render.

## Estrutura

```text
/frontend
  index.html
  style.css
  script.js
/backend
  package.json
  .env.example
  /src
    /config
    /controllers
    /db
    /middlewares
    /routes
    /services
    /utils
```

## Funcionalidades

- SPA com navegacao dinamica entre conteudo, formulario de denuncia e area admin
- Envio de denuncia com nome opcional e descricao obrigatoria
- API REST com criacao, listagem, exclusao individual, exclusao total e exportacao JSON
- Autenticacao da area admin por senha via variavel de ambiente
- Sanitizacao e validacao no backend
- Persistencia em PostgreSQL
- Limite de 100 denuncias com remocao automatica da mais antiga
- Backend preparado para Render com `process.env.PORT`, `process.env.DATABASE_URL` e bind em `0.0.0.0`

## Como rodar localmente

1. Crie um banco PostgreSQL local ou use um banco remoto.
2. Copie `backend/.env.example` para `backend/.env`.
3. Preencha `DATABASE_URL` e `ADMIN_PASSWORD`.
4. No terminal:

```bash
cd backend
npm install
npm run dev
```

5. Abra `http://localhost:3000`.

## Variaveis de ambiente

- `PORT`: porta do servidor
- `DATABASE_URL`: string de conexao PostgreSQL
- `ADMIN_PASSWORD`: senha da area administrativa
- `NODE_ENV`: use `production` no Render

## Conectar PostgreSQL do Render

1. No painel do Render, crie um servico `PostgreSQL`.
2. Apos a criacao, copie a `External Database URL`.
3. No servico web do backend, adicione:
   - `DATABASE_URL` com a URL do banco
   - `ADMIN_PASSWORD` com uma senha forte
   - `NODE_ENV` com valor `production`
4. O backend cria a tabela automaticamente na inicializacao.

## Deploy no Render

1. Envie este projeto para um repositorio Git.
2. No Render, crie um `Web Service`.
3. Aponte para o repositorio.
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Adicione as variaveis `DATABASE_URL`, `ADMIN_PASSWORD` e `NODE_ENV=production`.
6. Finalize o deploy. O Express servira o frontend automaticamente.

## Rotas da API

- `POST /denuncias`
- `GET /denuncias` com header `x-admin-password`
- `DELETE /denuncias/:id` com header `x-admin-password`
- `DELETE /denuncias` com header `x-admin-password`
- `GET /export` com header `x-admin-password`
- `GET /health`

## Observacoes de seguranca

- A senha de admin nunca fica embutida no frontend.
- Os textos sao higienizados no backend para reduzir risco de XSS.
- A renderizacao no painel admin tambem escapa o conteudo recebido.
- A gravacao da denuncia e a limpeza do excesso acima de 100 itens acontecem na mesma transacao.
