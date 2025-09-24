# 🔗 Conector n8n Customizado: Gerador de Números Aleatórios (Random.org)

Este repositório contém a implementação de um **conector customizado** para a plataforma **n8n**, desenvolvido como parte de um desafio técnico.

- ⚙️ **Infraestrutura:** Instância local do n8n com banco de dados PostgreSQL, gerenciada via Docker Compose.  
- 🎲 **Conector Customizado:** Um nó chamado `Gerador de Número Aleatório`, que consome a API do [Random.org](http://random.org) para gerar números inteiros verdadeiramente aleatórios.

O guia abaixo descreve todo o processo de configuração e execução do conector.

---

## 📑 Sumário
- [🚀 Pré-requisitos](#-pré-requisitos)  
- [📂 Estrutura de Pastas](#-estrutura-de-pastas)  
- [⚡ Passo 1: Subir a Infraestrutura](#-passo-1-subir-a-infraestrutura)  
- [🛠️ Passo 2: Instalar e Linkar o Nó Customizado](#️-passo-2-instalar-e-linkar-o-nó-customizado)  
  - [2.1 - Compilar o Código](#21---compilar-o-código)  
  - [2.2 - Copiar os Arquivos Manualmente](#22---copiar-os-arquivos-manualmente)  
  - [2.3 - Reiniciar o n8n](#23---reiniciar-o-n8n)  
- [✅ Passo 3: Validar na Interface do n8n](#-passo-3-validar-na-interface-do-n8n)  
- [🐞 Troubleshooting (Solução de Problemas)](#-troubleshooting-solução-de-problemas)  
- [📌 Apêndice: Comandos Úteis](#-apêndice-comandos-úteis)  

---

## 🚀 Pré-requisitos
- [Docker](https://www.docker.com/get-started/) e **Docker Compose** instalados.  
- [Node.js](https://nodejs.org/) v20 (LTS) ou superior, junto com **npm**.  
- Porta `5678` livre na máquina local.  

---

## 📂 Estrutura de Pastas
A estrutura final do projeto está organizada da seguinte forma:

```
.
├── .gitignore                      # Ignora arquivos desnecessários (ex: node_modules)
├── docker-compose.yml              # Configuração do n8n + PostgreSQL
├── n8n-nodes-random/               # Código-fonte do conector customizado
│   ├── nodes/
│   │   └── Random/
│   │       ├── icon.svg
│   │       └── Random.node.ts
│   ├── package.json
│   └── ... (arquivos de configuração do projeto Node.js)
└── README.md                       # Este guia
```

---

## ⚡ Passo 1: Subir a Infraestrutura
O `docker-compose.yml` inicia dois contêineres: **n8n** e **PostgreSQL**.

1. Abra um terminal na raiz do projeto.  
2. Suba os serviços em segundo plano:  
   ```bash
   docker compose up -d
   ```

3. Aguarde cerca de 1 minuto até que os serviços estejam disponíveis:

🌐 Interface do n8n → http://localhost:5678

ℹ️ **Nota:** As credenciais do banco de dados estão definidas diretamente no `docker-compose.yml` para simplificar. Não é necessário criar um `.env`.

## 🛠️ Passo 2: Instalar e Linkar o Nó Customizado
Para que o n8n reconheça o conector, é necessário compilá-lo e copiá-lo para o diretório monitorado pelo n8n.

⚠️ **Importante:** O método `npm link` pode apresentar problemas no Windows. O processo manual descrito abaixo é a forma mais estável de configurar.

### 2.1 - Compilar o Código
```bash
# 1. Entre na pasta do conector
cd n8n-nodes-random

# 2. Instale as dependências
npm install

# 3. Compile o código (gera a pasta "dist")
npm run build
```
### 2.2 - Copiar os Arquivos Manualmente
No Windows, execute no PowerShell:

```powershell
# 1. Volte para a raiz do projeto
cd ..

# 2. Crie a pasta de destino dentro do diretório .n8n
mkdir C:\Users\$env:USERNAME\.n8n\custom\n8n-nodes-random

# 3. Copie o package.json
copy n8n-nodes-random\package.json C:\Users\$env:USERNAME\.n8n\custom\n8n-nodes-random\

# 4. Copie a pasta "dist" inteira
xcopy n8n-nodes-random\dist C:\Users\$env:USERNAME\.n8n\custom\n8n-nodes-random\dist\ /E /I
```
### 2.3 - Reiniciar o n8n
Reinicie apenas o contêiner do n8n para que o novo nó seja carregado:

```bash
docker compose restart n8n
```
## ✅ Passo 3: Validar na Interface do n8n

1. Acesse http://localhost:5678
2. Crie um novo workflow (**Start from scratch**)
3. Clique em **+** e pesquise por **Gerador de Número Aleatório**
4. Adicione o nó ao canvas e configure os valores de **Mínimo** e **Máximo**
5. Clique em **Execute Node** → O número gerado será exibido no painel de saída (**OUTPUT**)



## 🐞 Troubleshooting (Solução de Problemas)

### 🔴 1. A página http://localhost:5678 não carrega (ERR_EMPTY_RESPONSE)
Os contêineres podem ter perdido a conexão de rede.

**Solução:**
```bash
docker compose down
docker compose up -d
```
### ⚪ 2. O nó customizado não aparece na lista
Verifique se o `package.json` e a pasta `dist` foram copiados para:

```
C:\Users\%USERNAME%\.n8n\custom\n8n-nodes-random
```

Confirme que reiniciou o n8n:
```bash
docker compose restart n8n
```
## 📌 Apêndice: Comandos Úteis
Todos os comandos devem ser executados na raiz do projeto:

```bash
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
```