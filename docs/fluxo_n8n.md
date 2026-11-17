Descrição detalhada de todos os nós: 

# Fluxo Geral do Digi 2.0

## Objetivo

Este documento descreve todo o fluxo do Digi 2.0 desde o recebimento de uma mensagem no WhatsApp até o envio da resposta ao usuário.

---

# Arquitetura Geral

```text
WhatsApp
      │
      ▼
Evolution API
      │
      ▼
Webhook (n8n)
      │
      ▼
Guardião de Entrada
      │
      ▼
Normalização dos Dados
      │
      ▼
Orquestrador
      │
      ▼
Switch de Intent
      │
      ├───────────────┐
      │               │
      ▼               ▼
Chat          Notícias
      │               │
      ▼               ▼
             Classificador de Notícias
                     │
                     ▼
                  searXNG pesquisa
                     │
                     ▼
              Formatação da Resposta
                     │
                     ▼
              Evolution API
                     │S
                     ▼
                 WhatsApp
```

---

# Fluxo Detalhado

## 1. Recepção

### Nó

Webhook

### Responsabilidade

Receber mensagens da Evolution API.

### Entrada

JSON enviado pela Evolution.

### Saída

Mensagem original.

---

## 2. Guardião de Entrada

### Responsabilidade

Realizar validações iniciais.

### Validações

- Ignorar grupos
- Ignorar mensagens enviadas pelo próprio bot
- Ignorar Status Broadcast
- Ignorar mensagens vazias
- Validar tipo da mensagem

Caso alguma validação falhe:

Workflow encerrado.

---

## 3. Normalização

### Responsabilidade

Padronizar o JSON recebido.

Campos principais:

- telefone
- mensagem
- nome
- timestamp

---

## 4. Orquestrador

Responsável por identificar a intenção do usuário.

Retorno esperado:

```json
{
  "intent": "",
  "tema": "",
  "categoria": "",
  "quantidade": 3,
  "nivel": ""
}
```

---

# Intent disponíveis

- chatbot
- noticias
- questionario
- secretaria
- fora_escopo

---

# Fluxo Notícias

Quando

```text
intent = noticias
```

Segue para:

```
Classificador Notícias
```

---

## Classificador

Responsabilidade

Extrair:

- tema
- categoria
- palavras-chave

Saída:

```json
{
 "tema":"",
 "categoria":"",
 "palavras_chave":[],
 "pesquisar":true
}
```

---

## Switch Categoria

Categorias disponíveis

- inteligencia_artificial
- tecnologia
- educacao
- ciencia
- seguranca
- economia
- governo
- geral

---

## RSS

Cada categoria consulta apenas uma fonte.

Exemplo

| Categoria | Fonte |
|------------|-------|
| IA | VentureBeat AI |
| Educação | EdSurge |
| Tecnologia | TechCrunch |

---

## Motor de Relevância

Responsável por:

- remover duplicados
- remover promoções
- calcular score
- aplicar sinônimos
- ordenar
- selecionar Top 3

---

## Formatação

Transforma as notícias em mensagem WhatsApp.

---

# Fluxo Questionário

Quando

```text
intent = questionario
```

Fluxo

```
Teacher Bot

↓

HTML

↓

Gotenberg

↓

PDF

↓

Evolution
```

---

# Fluxo Chat

Quando

```text
intent = chatbot
```

Fluxo

```
Agente Chat

↓

Memória Redis

↓

OpenAI

↓

Evolution
```

---

# Fluxo Secretaria

Quando

```text
intent = secretaria
```

Fluxo

```
Agente Secretaria

↓

OpenAI

↓

Evolution
```

---

# Fluxo Fora do Escopo

Quando

```text
intent = fora_escopo
```

Fluxo

```
Agente Fora do Escopo

↓

Evolution
```

---

# Fluxo de Erro

Caso qualquer agente gere erro.

```
Erro

↓

Fallback

↓

Mensagem amigável

↓

Registrar Log

↓

Enviar usuário
```

---

# Fluxo de Logs

Após qualquer resposta.

```
Resposta

↓

Registrar

- telefone
- pergunta
- intent
- agente
- tempo
- status
```

---

# Tecnologias

- n8n
- Evolution API
- OpenAI
- Redis
- PostgreSQL
- Gotenberg
- Docker



