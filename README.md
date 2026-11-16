# Sistema de Locação de Veículos

Trabalho da disciplina de Programação com Frameworks Web.

O sistema é uma locadora de carros. O usuário faz cadastro e login, cadastra e consulta veículos, aluga um veículo e depois registra a devolução. O backend é uma API REST feita com Node.js, Express, Prisma e MySQL, com login usando JWT e senha com bcrypt. O frontend vai ser feito em React.

## Integrantes

| Integrante | Parte |
|---|---|
| Thales Alberto | Parte 1 - Estrutura do projeto e banco de dados |
| Pedro Henrique | Parte 2 - Cadastro, login e JWT |
| (nome) | Parte 3 - Veículos e locações |
| Thales Alberto | Parte 4 - Frontend em React |

## Status do projeto

- [x] Parte 1 - Estrutura do backend, banco de dados, migrations e dados de exemplo
- [x] Parte 2 - Autenticação
- [ ] Parte 3 - Veículos e locações
- [x] Parte 4 - Frontend (esperando a Parte 3 para funcionar completo)

## Tecnologias

- Node.js
- Express
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- bcrypt (bcryptjs)
- React

## Requisitos para rodar

- Node.js 20 ou mais novo
- MySQL 8 rodando na máquina

## Como rodar o backend

1. Entrar na pasta do backend e instalar as dependências:

```bash
cd backend
npm install
```

2. Criar o arquivo `.env` copiando o `.env.example`:

```bash
cp .env.example .env
```

3. Abrir o `.env` e trocar `usuario` e `senha` pelo usuário e senha do seu MySQL. O banco `locadora` é criado sozinho pelo Prisma.

4. Criar as tabelas no banco:

```bash
npx prisma migrate dev
```

5. Colocar os dados de exemplo:

```bash
npx prisma db seed
```

6. Iniciar o servidor:

```bash
npm run dev
```

A API roda em `http://localhost:3333/api`. Se abrir esse endereço no navegador tem que aparecer `{"mensagem":"API da locadora funcionando"}`.

Para ver as tabelas e os dados dá para usar `npx prisma studio`.

## Como rodar o frontend

Com o backend rodando, abrir outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O site abre em `http://localhost:5173`. Dá para entrar com `ana@email.com` e senha `123456`, que vêm do seed.

Se a API estiver em outro endereço, criar o arquivo `frontend/.env` copiando o `frontend/.env.example` e trocar o `VITE_API_URL`.

## Variáveis de ambiente

| Variável | Para que serve |
|---|---|
| DATABASE_URL | Endereço de conexão com o MySQL |
| JWT_SECRET | Segredo usado para gerar e conferir o token |
| PORT | Porta onde a API roda |

O arquivo `.env` não vai para o GitHub (está no `.gitignore`). Se alguém precisar de uma variável nova, tem que colocar o nome dela no `.env.example`.

---

## Parte 1 - Estrutura do projeto e banco de dados (Thales Alberto)

### O que foi feito

- Estrutura de pastas do backend
- Configuração do Express (`src/server.js`)
- Modelagem do banco no `prisma/schema.prisma`
- Migration inicial com as tabelas, chaves estrangeiras e campos únicos
- Seed com usuários e veículos de exemplo
- Conexão com o banco (`src/prisma.js`)
- Função para criar erros com código HTTP (`src/utils/criarErro.js`)
- Middleware que trata os erros e devolve a resposta em JSON (`src/middlewares/tratarErros.js`)
- Arquivo `.env.example` e `.gitignore`

### Estrutura das pastas

```
backend/
  prisma/
    schema.prisma
    seed.js
    migrations/
  src/
    server.js
    prisma.js
    routes/
    controllers/
    services/
    middlewares/
    utils/
```

- `routes`: só liga o endereço da rota com a função do controller
- `controllers`: pega os dados da requisição, chama o service e devolve a resposta
- `services`: onde ficam as validações e as regras de negócio
- `middlewares`: funções que rodam no meio da requisição (tratamento de erro e autenticação)
- `utils`: funções de ajuda

### Banco de dados

São três tabelas: `Usuario`, `Veiculo` e `Locacao`.

**Usuario**: id, nome, email (único), senha (guardada com hash) e criadoEm.

**Veiculo**: id, marca, modelo, placa (única), ano, valorDiaria e disponivel (começa como `true`).

**Locacao**: id, usuarioId, veiculoId, dataInicio, dataPrevistaDevolucao, dataDevolucao (fica vazia até o carro ser devolvido), valorTotal e status (`ATIVA` ou `FINALIZADA`, começa como `ATIVA`).

Relacionamentos:

- Um usuário pode ter várias locações, e cada locação é de um usuário só (1:N). A chave estrangeira é `usuarioId` na tabela Locacao.
- Um veículo pode ter várias locações em datas diferentes, e cada locação é de um veículo só (1:N). A chave estrangeira é `veiculoId` na tabela Locacao.

Decisões:

- `valorDiaria` e `valorTotal` usam `Decimal(10, 2)` porque é dinheiro e o tipo decimal não erra os centavos.
- As locações não são apagadas. Quando o carro é devolvido, o status muda para `FINALIZADA` e a `dataDevolucao` é preenchida, assim o histórico fica guardado.
- A chave estrangeira usa `ON DELETE RESTRICT`, então o banco não deixa apagar um usuário ou veículo que tenha locação.

### Dados de exemplo (seed)

Usuários (senha `123456` para os dois):

- ana@email.com
- bruno@email.com

Veículos: Fiat Argo, Chevrolet Onix, Volkswagen T-Cross e Toyota Corolla.

### Tratamento de erros

Para devolver um erro em qualquer service é só usar:

```js
throw criarErro("Veículo indisponível", 409);
```

O middleware `tratarErros` pega esse erro e responde `{ "erro": "Veículo indisponível" }` com o status 409.

Ele também trata:

| Situação | Resposta |
|---|---|
| JSON mal escrito na requisição | 400 |
| Email ou placa repetidos (erro P2002 do Prisma) | 409 |
| Rota que não existe | 404 |
| Qualquer outro erro | 500 |

Como o projeto usa o Express 5, erros dentro de funções `async` vão direto para o `tratarErros`, então não precisa de `try/catch` nos controllers.

## Parte 4 - Frontend em React (Thales Alberto)

### O que foi feito

- Projeto React criado com Vite na pasta `frontend`
- Telas de cadastro, login e logout
- Tela de veículos com cadastro, lista e filtro de disponíveis
- Tela de locações com nova locação, locações ativas, histórico e botão de finalizar
- Conexão com a API usando Axios (`src/services/api.js`)
- Mensagens de sucesso e de erro em todas as telas

### Estrutura das pastas

```
frontend/
  index.html
  src/
    main.jsx
    App.jsx
    index.css
    services/api.js
    components/Navbar.jsx
    components/Mensagem.jsx
    pages/Login.jsx
    pages/Cadastro.jsx
    pages/Veiculos.jsx
    pages/Locacoes.jsx
    utils/formatar.js
```

- `pages`: uma tela por arquivo
- `components`: pedaços que aparecem em mais de uma tela
- `services/api.js`: configuração do Axios
- `utils/formatar.js`: funções para mostrar dinheiro e datas no formato brasileiro

### Como funciona

**Login e token.** O `Login.jsx` manda o email e a senha para `POST /api/auth/login`. Quando dá certo, o `App.jsx` guarda o token e o email no `localStorage` e mostra as telas do sistema. O email aparece na barra de cima. O botão "Sair" apaga o token e volta para o login.

**api.js.** O Axios tem um interceptor que coloca `Authorization: Bearer <token>` em todas as requisições. Se a API responder 401 (token vencido ou inválido), ele apaga o token e manda o usuário para o login. A função `pegarMensagemErro` pega o texto que vem em `{ "erro": "..." }` para mostrar na tela.

**Rotas das telas.** O `App.jsx` usa o React Router. Sem token só dá para abrir `/login` e `/cadastro`. Com token dá para abrir `/veiculos` e `/locacoes`.

**Formulários.** Todos os formulários são controlados: cada campo tem um `useState`, usa `value` e muda com `onChange`. O envio é no `onSubmit`, que chama `e.preventDefault()` para a página não recarregar.

**Veiculos.jsx.** O `useEffect` chama `carregarVeiculos()` quando a tela abre e toda vez que o filtro "Só disponíveis" muda. O cadastro manda `POST /api/veiculos` e depois carrega a lista de novo.

**Locacoes.jsx.** O `useEffect` chama `carregarDados()`, que busca os veículos disponíveis e as locações do usuário. A função `registrar` confere se a data de devolução é depois da data de início e manda `POST /api/locacoes` com `veiculoId`, `dataInicio` e `dataPrevistaDevolucao`. Depois da resposta mostra a mensagem, limpa o formulário e chama `carregarDados()` de novo. Assim a locação nova aparece na lista e o carro some das opções. Se der erro (por exemplo "Veículo indisponível"), a mensagem da API aparece em vermelho. A função `finalizar` manda `PATCH /api/locacoes/:id/finalizar` e atualiza a tela do mesmo jeito.

**Valor da locação.** O frontend não calcula o valor. Ele só mostra o `valorTotal` que vem da API, porque a regra fica no backend.

---

## O que falta fazer (próximas partes)

### Regras que todo mundo tem que seguir

- Usar sempre a conexão `const prisma = require("../prisma");`. Não criar outro `new PrismaClient()`.
- Erros sempre com `throw criarErro("mensagem", status)`.
- Regra de negócio fica só no service. Rota só chama o controller.
- O id do usuário logado vem do token (`req.usuarioId`), nunca do `req.body`.
- Não colocar comentários no código. Explicação vai aqui no README.
- Nunca subir o `.env`.
- Registrar as rotas novas em `src/routes/index.js`.
- Cada um documenta a sua parte aqui no README quando terminar, igual a Parte 1.

### Parte 2 - Cadastro, login e JWT

Arquivos para criar:

- `src/routes/authRoutes.js`
- `src/controllers/authController.js`
- `src/services/authService.js`
- `src/middlewares/autenticar.js`

O que fazer:

- `POST /api/auth/cadastro` recebe nome, email e senha. Validar os campos, não deixar email repetido (409) e salvar a senha com `bcrypt.hash`.
- `POST /api/auth/login` recebe email e senha. Conferir com `bcrypt.compare` e devolver o token gerado com `jwt.sign`. Login errado devolve 401.
- Middleware `autenticar`: ler o cabeçalho `Authorization: Bearer <token>`, conferir com `jwt.verify` e colocar o id do usuário em `req.usuarioId`. Sem token ou token inválido devolve 401.
- Nunca devolver a senha nas respostas.

### Parte 3 - Veículos e locações

Arquivos para criar:

- `src/routes/veiculoRoutes.js`, `src/controllers/veiculoController.js`, `src/services/veiculoService.js`
- `src/routes/locacaoRoutes.js`, `src/controllers/locacaoController.js`, `src/services/locacaoService.js`

O que fazer (todas as rotas usando o middleware `autenticar` da Parte 2):

- `POST /api/veiculos`: cadastrar veículo. Placa não pode repetir e o valor da diária tem que ser maior que zero.
- `GET /api/veiculos`: listar todos os veículos. Com `?disponivel=true` lista só os disponíveis.
- `POST /api/locacoes`: recebe veiculoId, dataInicio e dataPrevistaDevolucao. A data prevista tem que ser depois da data de início (400). O veículo tem que existir (404) e estar disponível (409).
- O valor total é calculado no backend: quantidade de diárias vezes o valor da diária. Qualquer pedaço de 24 horas conta como uma diária inteira (usar `Math.ceil`).
- Criar a locação e deixar o veículo indisponível dentro de um `prisma.$transaction`, para não ter problema se duas pessoas tentarem alugar o mesmo carro ao mesmo tempo.
- `GET /api/locacoes`: listar as locações do usuário logado (ativas e finalizadas), usando `include` para trazer os dados do veículo.
- `PATCH /api/locacoes/:id/finalizar`: só o dono da locação pode finalizar. Se já estiver finalizada devolve 409. Preencher a `dataDevolucao`, mudar o status para `FINALIZADA` e deixar o veículo disponível de novo, também dentro de `$transaction`.

O frontend (Parte 4) já está pronto e usa exatamente essas rotas. Para as telas funcionarem, a Parte 3 precisa seguir estes nomes e formatos:

- O controller de locação deve se chamar `locacaoController.registrar` e o service `locacaoService.registrar`.
- `GET /api/veiculos` devolve uma lista com `id`, `marca`, `modelo`, `placa`, `ano`, `valorDiaria` e `disponivel`.
- `GET /api/locacoes` devolve as locações com o veículo junto (`include: { veiculo: true }`), porque a tela mostra `locacao.veiculo.marca` e `locacao.veiculo.modelo`.
- O `status` da locação tem que ser exatamente `"ATIVA"` ou `"FINALIZADA"`.
- O frontend manda as datas no formato `"2026-11-20"`. É só usar `new Date(dataInicio)` no service.
- Erros sempre com `criarErro`, para chegar no frontend como `{ "erro": "mensagem" }`.

### Respostas da API

As respostas de erro sempre vêm assim:

```json
{ "erro": "mensagem do erro" }
```

O frontend deve mostrar o texto que vem em `erro`.
