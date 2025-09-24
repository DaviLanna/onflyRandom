# Conector n8n Customizado: Gerador de Números Aleatórios (Random.org)

Este repositório contém a implementação completa de um conector customizado para a plataforma n8n, como parte de um desafio técnico.

- **Infraestrutura:** Uma instância local do n8n com um banco de dados PostgreSQL, gerenciada via Docker Compose.
- **Conector Customizado:** Um nó chamado `Gerador de Número Aleatório` que consome a API do [Random.org](http://random.org) para gerar números inteiros verdadeiramente aleatórios.

O guia abaixo detalha o passo a passo completo para configurar o ambiente e executar o conector.

## Sumário
- [Pré-requisitos](#pré-requisitos)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Passo 1: Subir a Infraestrutura](#passo-1-subir-a-infraestrutura)
- [Passo 2: Instalar e "Linkar" o Nó Customizado](#passo-2-instalar-e-linkar-o-nó-customizado)
- [Passo 3: Validar na Interface do n8n](#passo-3-validar-na-interface-do-n8n)
- [Ciclo de Desenvolvimento](#ciclo-de-desenvolvimento)
- [Troubleshooting (Solução de Problemas)](#troubleshooting-solução-de-problemas)
- [Apêndice: Comandos Úteis](#apêndice-comandos-úteis)

## Pré-requisitos
- [Docker](https://www.docker.com/get-started/) e Docker Compose instalados.
- [Node.js](https://nodejs.org/) v20 (LTS) ou superior e npm.
- A porta `5678` deve estar livre na sua máquina local.

## Estrutura de Pastas
A estrutura final do projeto está organizada da seguinte forma:

.
├── .gitignore               # Ignora arquivos desnecessários (ex: node_modules)
├── docker-compose.yml       # Arquivo de infraestrutura do n8n + PostgreSQL
├── n8n-nodes-random/        # O código-fonte do conector customizado
│   ├── nodes/
│   │   └── Random/
│   │       ├── icon.svg
│   │       └── Random.node.ts
│   ├── package.json
│   └── ... (arquivos de configuração do projeto Node.js)
└── README.md                # Este guia


## Passo 1: Subir a Infraestrutura
O `docker-compose.yml` irá configurar e iniciar dois contêineres: um para o n8n e outro para o banco de dados PostgreSQL.

1.  Abra um terminal na raiz do projeto.
2.  Execute o comando para subir os serviços em background:
    ```bash
    docker compose up -d
    ```
3.  Aguarde cerca de um minuto para que os serviços sejam iniciados. A interface do n8n estará disponível em:
    - **http://localhost:5678**

> **Nota:** As credenciais do banco de dados estão definidas diretamente no arquivo `docker-compose.yml` para simplificar. Não é necessário um arquivo `.env`.

## Passo 2: Instalar e "Linkar" o Nó Customizado
Para que a sua instância do n8n possa encontrar e carregar o conector, precisamos compilá-lo e movê-lo para a pasta de desenvolvimento do n8n.

> **Importante:** O método padrão para isso (`npm link`) apresentou instabilidade e problemas de permissão no Windows. O processo manual descrito abaixo é a **forma garantida** de fazer o conector funcionar.

#### 2.1 - Compilar o Código
Primeiro, precisamos instalar as dependências do conector e compilar o código TypeScript para JavaScript.

```bash
# 1. Entre na pasta do conector
cd n8n-nodes-random

# 2. Instale as dependências
npm install

# 3. Compile o código (isso criará uma pasta "dist")
npm run build
2.2 - Copiar os Arquivos Manualmente
Agora, vamos copiar os arquivos compilados para a pasta que o n8n monitora.

Bash

# 1. Volte para a raiz do projeto
cd ..

# 2. Crie a pasta de destino dentro do diretório .n8n do seu usuário
mkdir C:\Users\%USERNAME%\.n8n\custom\n8n-nodes-random

# 3. Copie o package.json
copy n8n-nodes-random\package.json C:\Users\%USERNAME%\.n8n\custom\n8n-nodes-random\

# 4. Copie a pasta "dist" inteira
xcopy n8n-nodes-random\dist C:\Users\%USERNAME%\.n8n\custom\n8n-nodes-random\dist\ /E /I
2.3 - Reiniciar o n8n
Para que o n8n carregue o novo nó, reinicie o contêiner:

Bash

docker compose restart n8n
Passo 3: Validar na Interface do n8n
Com o ambiente no ar e o nó copiado, só falta testar.

Acesse http://localhost:5678.

Crie um novo workflow ("Start from scratch").

Clique no + para adicionar um nó e pesquise por Gerador de Número Aleatório.

Adicione o nó ao canvas, defina os valores de Mínimo e Máximo.

Clique em Execute Node. O resultado, um número aleatório, deve aparecer no painel de saída (OUTPUT).

![Execução do nó Random no n8n]([assets/image.png])

Troubleshooting (Solução de Problemas)
A página localhost:5678 não carrega ou dá erro (ERR_EMPTY_RESPONSE):

Isso geralmente indica que os contêineres perderam a conexão de rede entre si. A solução é reiniciar todo o ambiente.

Rode docker compose down para parar tudo.

Depois, rode docker compose up -d para subir novamente.

O nó customizado não aparece na lista:

Garanta que você seguiu o Passo 2 e copiou os arquivos package.json e a pasta dist para C:\Users\%USERNAME%\.n8n\custom\n8n-nodes-random.

Confirme que você reiniciou o n8n com docker compose restart n8n após copiar os arquivos.

Apêndice: Comandos Úteis
Todos os comandos devem ser executados na raiz do projeto.

Subir todo o ambiente:
docker compose up -d

Parar todo o ambiente:
docker compose down

Reiniciar apenas o n8n (após uma alteração no código):
docker compose restart n8n

Ver logs do n8n em tempo real:
docker compose logs -f n8n

Compilar o conector:
cd n8n-nodes-random && npm run build