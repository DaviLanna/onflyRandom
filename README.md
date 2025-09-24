Conector n8n Customizado: Gerador de Números Aleatórios (Random.org)

Este repositório contém a implementação de um conector customizado para a plataforma n8n, desenvolvido como parte de um desafio técnico.

Infraestrutura: Instância local do n8n com banco de dados PostgreSQL, gerenciada via Docker Compose.

Conector Customizado: Um nó chamado Gerador de Número Aleatório, que consome a API do Random.org
 para gerar números inteiros verdadeiramente aleatórios.

O guia abaixo descreve todo o processo de configuração e execução do conector.

Sumário

Pré-requisitos

Estrutura de Pastas

Passo 1: Subir a Infraestrutura

Passo 2: Instalar e Linkar o Nó Customizado

2.1 - Compilar o Código

2.2 - Copiar os Arquivos Manualmente

2.3 - Reiniciar o n8n

Passo 3: Validar na Interface do n8n

Troubleshooting (Solução de Problemas)

Apêndice: Comandos Úteis

Pré-requisitos

Docker
 e Docker Compose instalados.

Node.js
 v20 (LTS) ou superior, junto com npm.

Porta 5678 livre na máquina local.

Estrutura de Pastas

A estrutura final do projeto está organizada da seguinte forma:

.
├── .gitignore               # Ignora arquivos desnecessários (ex: node_modules)
├── docker-compose.yml       # Configuração do n8n + PostgreSQL
├── n8n-nodes-random/        # Código-fonte do conector customizado
│   ├── nodes/
│   │   └── Random/
│   │       ├── icon.svg
│   │       └── Random.node.ts
│   ├── package.json
│   └── ... (arquivos de configuração do projeto Node.js)
└── README.md                # Este guia

Passo 1: Subir a Infraestrutura

O docker-compose.yml inicia dois contêineres: n8n e PostgreSQL.

Abra um terminal na raiz do projeto.

Suba os serviços em segundo plano:

docker compose up -d


Aguarde cerca de 1 minuto até que os serviços estejam disponíveis.

Interface do n8n: http://localhost:5678

Nota: As credenciais do banco de dados estão definidas diretamente no docker-compose.yml para simplificar. Não é necessário criar um .env.

Passo 2: Instalar e Linkar o Nó Customizado

Para que o n8n reconheça o conector, é necessário compilá-lo e copiá-lo para o diretório monitorado pelo n8n.

⚠️ Importante: O método npm link pode apresentar problemas no Windows. O processo manual descrito abaixo é a forma mais estável de configurar.

2.1 - Compilar o Código
# 1. Entre na pasta do conector
cd n8n-nodes-random

# 2. Instale as dependências
npm install

# 3. Compile o código (gera a pasta "dist")
npm run build

2.2 - Copiar os Arquivos Manualmente

No Windows, execute no PowerShell:

# 1. Volte para a raiz do projeto
cd ..

# 2. Crie a pasta de destino dentro do diretório .n8n
mkdir C:\Users\$env:USERNAME\.n8n\custom\n8n-nodes-random

# 3. Copie o package.json
copy n8n-nodes-random\package.json C:\Users\$env:USERNAME\.n8n\custom\n8n-nodes-random\

# 4. Copie a pasta "dist" inteira
xcopy n8n-nodes-random\dist C:\Users\$env:USERNAME\.n8n\custom\n8n-nodes-random\dist\ /E /I

2.3 - Reiniciar o n8n

Reinicie apenas o contêiner do n8n para que o novo nó seja carregado:

docker compose restart n8n

Passo 3: Validar na Interface do n8n

Acesse http://localhost:5678
.

Crie um novo workflow (Start from scratch).

Clique em + e pesquise por Gerador de Número Aleatório.

Adicione o nó ao canvas, configure valores de Mínimo e Máximo.

Clique em Execute Node → O número gerado será exibido no painel de saída (OUTPUT).

Troubleshooting (Solução de Problemas)
1. A página http://localhost:5678 não carrega (ERR_EMPTY_RESPONSE)

Os contêineres podem ter perdido a conexão de rede.

Solução:

docker compose down
docker compose up -d

2. O nó customizado não aparece na lista

Confirme se o package.json e a pasta dist foram copiados para:
C:\Users\%USERNAME%\.n8n\custom\n8n-nodes-random

Certifique-se de que reiniciou o n8n:

docker compose restart n8n

Apêndice: Comandos Úteis

Todos os comandos devem ser executados na raiz do projeto:

# Subir todo o ambiente
docker compose up -d

# Parar todo o ambiente
docker compose down

# Reiniciar apenas o n8n (após alterações no código)
docker compose restart n8n

# Ver logs do n8n em tempo real
docker compose logs -f n8n

# Compilar o conector
cd n8n-nodes-random && npm run build