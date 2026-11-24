Sistema de Locação de Veículos
Trabalho da disciplina Programação com Frameworks Web. O sistema permite cadastrar usuários, autenticar com JWT, cadastrar e consultar veículos, registrar locações, calcular o valor contratado e acompanhar a devolução e o histórico.
Integrantes
Integrante	Responsabilidade
Thales Alberto	Parte 1 - Estrutura do projeto e banco de dados
Pedro Henrique	Parte 2 - Cadastro, login e JWT
Fábio	Parte 3 - Veículos e locações
Thales Alberto	Parte 4 - Interface React


Status
- [x] Parte 1 - Estrutura do backend, banco de dados, migrations e dados de exemplo
- [x] Parte 2 - Cadastro, login e autenticação JWT
- [x] Parte 3 - Cadastro de veículos e regras de locação
- [x] Parte 4 - Interface React integrada à API
Tecnologias
- Node.js
- Express
- Prisma ORM
- MySQL
- JWT com jsonwebtoken
- Hash de senhas com bcryptjs
- React
- Vite
- Axios
- React Router
Funcionalidades
- Cadastro e login de usuários
- Armazenamento de senhas com hash bcrypt
- Autenticação por token JWT
- Cadastro e listagem de veículos
- Filtro de veículos disponíveis
- Registro e consulta das locações do usuário autenticado
- Cálculo do valor no backend, considerando cada fração de 24 horas como diária completa
- Finalização da locação, registro da data de devolução e liberação do veículo
- Histórico de locações finalizadas
- Mensagens de sucesso e erro na interface
A aplicação não implementa edição ou exclusão de veículos, conforme o escopo da atividade.
Estrutura do projeto
backend/
  prisma/
    migrations/
    schema.prisma
    seed.js
  src/
    controllers/
    middlewares/
    routes/
    services/
    utils/
    prisma.js
    server.js
  testes.http
frontend/
  src/
    components/
    pages/
    services/
    utils/
    App.jsx
    main.jsx
    index.css
- Routes mapeiam os endpoints e os controllers.
- Controllers recebem a requisição, chamam os services e montam a resposta HTTP.
- Services aplicam validações e regras de negócio.
- Prisma acessa o MySQL.
- Middlewares verificam o JWT e padronizam as respostas de erro.
Banco de dados
O banco possui as entidades Usuario, Veiculo e Locacao.
- Usuario: identificador, nome, e-mail único, senha com hash e data de cadastro.
- Veiculo: identificador, marca, modelo, placa única, ano, valor da diária e disponibilidade.
- Locacao: identificador, usuário, veículo, data de início, data prevista de devolução, data efetiva de devolução, valor total e status.
Um usuário pode possuir várias locações (1:N). Um veículo pode aparecer em várias locações ao longo do tempo (1:N). Cada locação pertence a um usuário e a um veículo. As relações e chaves estrangeiras estão definidas em backend/prisma/schema.prisma; a migration versionada está em backend/prisma/migrations/.

O status da locação é ATIVA ou FINALIZADA. As locações são preservadas como histórico; não há operação de exclusão no sistema.
Regras de negócio implementadas
- Cadastro e login são públicos; as rotas de veículos e locações exigem Authorization: Bearer <token>.
- A senha é armazenada com bcrypt e nunca é retornada pela API.
- O identificador do usuário vem do JWT, não de um campo enviado pelo cliente.
- Placas e e-mails são únicos.
- O valor da diária precisa ser maior que zero.
- A data prevista de devolução deve ser posterior à data de início.
- O total é calculado no backend: Math.ceil(duração_em_milissegundos / 24 horas) × valor_da_diária.
- A locação é criada e o veículo marcado como indisponível dentro de uma transação.
- A disponibilidade é alterada com uma atualização condicional (disponivel: true), evitando que duas requisições reservem o mesmo veículo.
- Um usuário só lista e finaliza as próprias locações.
- A finalização e a liberação do veículo ocorrem dentro de uma transação. Uma locação finalizada não pode ser finalizada novamente.
Endpoints da API
A API usa o prefixo http://localhost:3333/api.
Método	Rota	Acesso	Descrição
GET	/	Público	Verifica se a API está funcionando
POST	/auth/cadastro	Público	Cadastra um usuário
POST	/auth/login	Público	Valida credenciais e retorna JWT
POST	/veiculos	Autenticado	Cadastra um veículo
GET	/veiculos	Autenticado	Lista veículos
GET	/veiculos?disponivel=true	Autenticado	Lista apenas veículos disponíveis
POST	/locacoes	Autenticado	Registra uma locação
GET	/locacoes	Autenticado	Lista as locações do usuário, com o veículo relacionado
PATCH	/locacoes/:id/finalizar	Proprietário da locação	Finaliza a locação e libera o veículo


A resposta de erro usa o formato { "erro": "mensagem" }. Entre os códigos tratados estão 400 (validação), 401 (não autenticado), 403 (sem autorização), 404 (recurso inexistente) e 409 (conflito, como placa duplicada ou veículo indisponível).
Como executar
Pré-requisitos
- Node.js 20 ou mais novo
- MySQL 8 em execução
- XAMPP ou outro servidor MySQL local; no XAMPP, inicie o módulo MySQL antes da API
Backend
No PowerShell, abra um terminal na pasta do projeto e execute:
cd backend
npm ci
Se ainda não existir, crie o arquivo .env a partir do exemplo:
Copy-Item .env.example .env
Abra backend/.env e configure DATABASE_URL com o usuário e a senha do MySQL local. Defina também um valor próprio e longo para JWT_SECRET. Não compartilhe nem envie o arquivo .env.

Depois, ainda na pasta backend, execute:
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
A API ficará disponível em http://localhost:3333/api. A resposta esperada ao abrir esse endereço é:
{ "mensagem": "API da locadora funcionando" }
Mantenha esse terminal aberto.
Frontend
Abra um segundo terminal na pasta raiz do projeto e execute:
cd frontend
npm ci
npm run dev
A interface ficará disponível em http://localhost:5173. Mantenha também esse terminal aberto.
Contas de demonstração
O seed cria os seguintes usuários:
E-mail	Senha
ana@email.com	123456
bruno@email.com	123456


As contas são para demonstração local. O seed também cria quatro veículos: Fiat Argo, Chevrolet Onix, Volkswagen T-Cross e Toyota Corolla.
Testes manuais realizados
- Login e carregamento dos veículos de demonstração
- Rejeição de placa duplicada (409)
- Rejeição de datas inválidas pela interface e pela API (400)
- Cálculo de três diárias de R$ 120 como R$ 360
- Cobrança de duas diárias para um período de 25 horas
- Rejeição de nova locação para veículo indisponível (409)
- Restrição de consulta e finalização ao proprietário da locação (lista vazia para outro usuário e 403 ao tentar finalizar)
- Finalização pelo proprietário, registro da data de devolução, preservação no histórico e liberação do veículo
- Rejeição de segunda finalização (409)
- Rejeição de acesso a rota protegida sem token (401)
- Tentativa de duas locações do mesmo veículo em paralelo: uma locação foi criada e a outra foi rejeitada por indisponibilidade
Variáveis de ambiente
Variável	Uso
DATABASE_URL	Conexão com o MySQL
JWT_SECRET	Segredo de assinatura e validação dos tokens
PORT	Porta da API; o padrão é 3333


O arquivo .env contém credenciais locais e não deve ser enviado ao GitHub. As variáveis necessárias devem permanecer listadas em .env.example.
