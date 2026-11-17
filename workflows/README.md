# Workflows n8n

O arquivo JSON nesta pasta é uma exportação do workflow Digi WhatsApp.

## Antes de ativar

1. Importe o JSON pela interface do n8n.
2. Crie novamente as credenciais de Redis, WhatsApp, OpenAI e autenticação HTTP na sua instância.
3. Associe cada credencial aos nós correspondentes.
4. Substitua `SEU_PHONE_NUMBER_ID` pelo ID do número de telefone da sua conta Meta.
5. Revise URLs, webhooks, variáveis e parâmetros dos nós.
6. Execute testes com um número controlado antes de liberar para usuários.

As referências internas de credenciais foram removidas da cópia pública. Nenhuma chave de API deve ser inserida diretamente no JSON.
