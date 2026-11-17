Webhook: Responsável por receber a mesagem do usuario.

Evolution Api: Responsável por enviar as mensagens ao webhook e gerenciar as mensagens do usuario.

Orquestrador: Responsável por definir a intenção do usuario e direciona-lo ao serviço relacionado ao que foi pedido.

Switch intent: Responsável por slicitar o serviço correto baseado na intenção definida pelo orquestrador.

Agentes especializados: Cada agente é responsável por um serviço, sendo eles: Chatbot, PdfBot e Searchbot. além disso existe os dois bots para caso de fallback, respostas inapropriadas, secretaria e erro.

Resposta: Ao final de cada processo feito por um agente, ele retornará uma resposta para o usuario.

Whatsapp: todas as solicitações serão feitas via whatsapp, serão disponibilizadas a aluno como ferrmenta auxiliar na educação.

SeaXNG: Todas as pesquisas são feitas a partir d usi desse nó, com o uso de uma api para pesquisa com retorno via http request.