# Agente de whatsapp

**Assistente educacional via WhatsApp**, desenvolvido para apoiar estudantes com respostas a dúvidas, notícias, questionários e orientações administrativas.

> Projeto em desenvolvimento. Esta publicação organiza o código e a documentação disponíveis; não representa uma garantia de que todos os serviços estejam prontos para implantação em produção.

## Visão geral

O Digi utiliza um workflow no n8n para receber mensagens, identificar a intenção do estudante e encaminhar a solicitação ao fluxo correspondente. A infraestrutura é conteinerizada com Docker Compose.

### Funcionalidades documentadas

- Atendimento conversacional para dúvidas educacionais.
- Classificação de intenção e encaminhamento para agentes especializados.
- Pesquisa e seleção de notícias.
- Geração de questionários em HTML/PDF.
- Integrações com serviços externos por meio de APIs.
- Uso de Redis para memória conversacional.

## Tecnologias

- **Orquestração:** n8n
- **Infraestrutura:** Docker e Docker Compose
- **Dados e cache:** PostgreSQL e Redis
- **Pesquisa:** SearXNG
- **Conversão de documentos:** Gotenberg
- **Integração WhatsApp:** serviço Node.js/Express e WhatsApp Cloud API
- **IA:** integração com modelos OpenAI configurada no n8n

## Estrutura do repositório

```text
digi/
├── docs/                       # Documentação técnica
├── docker/
│   ├── docker-compose.yml      # Serviços locais
│   ├── .env.example            # Exemplo de variáveis de ambiente
│   ├── searxng/                # Configuração do SearXNG
│   └── whatsapp-api/           # API de integração WhatsApp
│       ├── src/
│       ├── Dockerfile
│       ├── package.json
│       └── .env.example
├── workflows/                  # Workflows exportados do n8n
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

## Pré-requisitos

- Docker Desktop com Docker Compose.
- Conta/projeto configurado na plataforma Meta para WhatsApp Cloud API, quando utilizar essa integração.
- Instância n8n e credenciais dos serviços externos.
- Chaves de API necessárias para os nós do workflow.

## Configuração local

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <PASTA_DO_REPOSITORIO>
   ```

2. Crie os arquivos locais de ambiente a partir dos exemplos:

   ```bash
   cp .env.example .env
   cp docker/whatsapp-api/.env.example docker/whatsapp-api/.env
   ```

   No Windows PowerShell, use `Copy-Item .env.example .env` e `Copy-Item docker/whatsapp-api/.env.example docker/whatsapp-api/.env`.

3. Edite os arquivos `.env` e substitua todos os valores de exemplo por credenciais próprias e seguras.

4. Suba os serviços:

   ```bash
   docker compose -f docker/docker-compose.yml up -d --build
   ```

5. Confira o estado dos containers:

   ```bash
   docker compose -f docker/docker-compose.yml ps
   ```

6. A API WhatsApp disponibiliza uma rota simples de verificação em `http://localhost:3000/`.

### Importação do workflow

1. Acesse a interface do n8n.
2. Importe o arquivo em `workflows/`.
3. Recrie e associe as credenciais necessárias dentro da sua própria instância n8n.
4. Revise URLs, IDs de conta, variáveis e parâmetros dos nós antes de ativar o workflow.
5. Configure o webhook da Meta para apontar para a URL pública da sua API.

O workflow publicado teve referências locais de credenciais removidas. O identificador de número de telefone da Meta também foi substituído por `SEU_PHONE_NUMBER_ID`; configure o identificador correto no nó correspondente antes de executar.

## Serviços e portas locais

| Serviço | Porta no host | Finalidade |
|---|---:|---|
| PostgreSQL | 5432 | Banco relacional |
| Redis | 6379 | Cache/memória |
| SearXNG | 8081 | Pesquisa |
| n8n | 5678 | Workflows |
| WhatsApp API | 3000 | Webhook e envio de mensagens |
| Gotenberg | 3001 | Conversão HTML/PDF |

As portas podem ser alteradas no `docker/docker-compose.yml`.

## Documentação

Consulte [`docs/README.md`](docs/README.md) para o índice dos documentos de arquitetura, agentes, integrações, banco de dados, segurança, testes e roadmap.

## Segurança

- Nunca publique arquivos `.env`, tokens, chaves, senhas, backups ou dados reais de usuários.
- Use senhas fortes e exclusivas em cada ambiente.
- Restrinja a exposição pública de PostgreSQL e Redis.
- Revise os workflows exportados antes de publicá-los: exports podem conter URLs internas, IDs de conta e referências a credenciais.
- Para incidentes com credenciais já publicadas, revogue/rotacione os segredos; apagar o arquivo em um commit posterior não remove o segredo do histórico.

Consulte [`SECURITY.md`](SECURITY.md).

## Estado e limitações conhecidas

- O repositório contém um workflow exportado do n8n, mas as credenciais precisam ser recriadas pelo responsável pela implantação.
- A documentação e os arquivos de infraestrutura apresentam referências a diferentes variantes da integração WhatsApp (Evolution API e Cloud API). Valide qual fluxo está em uso antes de implantar.
- O arquivo Compose deve ser validado no ambiente de destino; este repositório não inclui backups nem dados persistentes.
- Não há licença de código aberta definida neste repositório. Até que uma licença seja adicionada, os direitos autorais permanecem reservados.

## Contribuição

Leia [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de abrir uma issue ou pull request.
