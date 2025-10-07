Gateway de Pagamento v1.0 - Canvi
Introdução
Bem-vindo à documentação oficial da API Gateway da Canvi.
Aqui você encontrará todas as informações necessárias para integrar sua plataforma às nossas soluções de pagamento — de forma rápida, segura e eficiente.
Com a Canvi, você pode automatizar cobranças, acompanhar transações em tempo real, configurar repasses financeiros e muito mais. Nossa infraestrutura foi pensada para oferecer controle total sobre seus recebimentos, simplificando a gestão financeira do seu negócio.
Visão Geral
A API da Canvi foi desenvolvida para proporcionar uma integração simples, segura e eficiente com o seu sistema, permitindo total controle sobre a gestão de pagamentos e operações financeiras de sua empresa. Confira abaixo as principais características que tornam nossa API uma escolha confiável para o seu negócio:
Padrão RestFul
Nossa API segue os princípios REST, com uma estrutura clara, intuitiva e compatível com as tecnologias mais utilizadas no mercado. Facilitando a implementação e reduzindo o tempo de desenvolvimento da sua equipe.
Meios de Pagamento
Oferecemos suporte aos principais meios de pagamento do mercado, incluindo:
PIX — dinâmico e estático.
Boletos bancários.
Cartões de débito, crédito e voucher — com suporte a diversas bandeiras nacionais e internacionais.
Essa flexibilidade permite que seu negócio atenda diferentes perfis de clientes e amplie as opções de cobrança de forma eficiente.
Ambiente Sandbox
Antes de entrar em produção, você pode utilizar nosso ambiente Sandbox para realizar testes e simulações com segurança. Isso permite validar integrações e fluxos de pagamento sem impacto sobre dados reais ou operações financeiras.
Webhooks
Mantenha seu sistema sempre atualizado com notificações em tempo real.
Nossos webhooks informam automaticamente eventos importantes, como confirmações de pagamento, envio de saldo e atualizações de status nas cobranças.
Simulação de Pagamentos
Para facilitar o processo de desenvolvimento e homologação, oferecemos a funcionalidade de simulação de pagamentos, permitindo testar diferentes cenários de cobrança com agilidade — evitando a necessidade de transações financeiras reais.
Estrutura da Resposta
Todas as requisições aos nossos endpoints retornam uma estrutura padrão de resposta, facilitando o tratamento de erros e respostas dentro da sua aplicação:
json
{
"code": "string",
"mensagem": "string",
"data": "any"
}
Data e Hora
Todos os registros de data e hora utilizados na API da Canvi seguem o fuso horário oficial de Manaus (UTC-4) e são formatados de acordo com o padrão ISO 8601.
Ex: 2025-05-20T14:30:00
URLs Base
Sandbox: https://gateway-homol.service-canvi.com.br
Produção: Sob demanda.
Primeiros Passos
Ao integrar sua plataforma com a API Canvi, você terá acesso a um conjunto completo de endpoints para geração de cobranças, controle de repasses, gestão de usuários e muito mais.
Para iniciar o processo de integração:
Ainda não é cliente Canvi? faça seu pré-cadastro aqui.
Nossa equipe entrará em contato para informar as credenciais de homologação.
Acesse o ambiente Sandbox e realize sua autenticação.
POST
Criar cobrança PIX
https://sandbox-gateway.service-canvi.com.br:8080/bt/invoice_pix
valor: Valor da cobrança sendo enviado sem pontuação em vez de vírgula (Exemplo: R$ 100,00 deve ser enviado 10000) (Obrigatório)
vencimento: Data de vencimento da cobrança, não informando, o tempo limite do vencimento é de 1 hora
descrição: Uma breve descrição para rastreamento rápido (Obrigatório)
identificador_externo: Código único de transação, não podendo ser reaproveitado posteriormente (Obrigatório)
tipo_transação: Cave de configuração do tipo de cobrança a ser usada. (Obrigatório)
invoice: As resposta serão enviadas para um webhook previamente configurado pelo parceiro
invoiceFrenteCaixa: O sistema do parceiro deve consultar as informações usando o método de consulta
texto_instrução: Texto com o resumo da cobrança de até 500 caractéres (Obrigatório)
identificador_movimento: Código secundário único, onde o parceiro poderá passar alguma chave de verificação futura (Obrigatório)
cliente: Identificador do devedor
nome: Nome do devedor
tipo_documento: Tipo de documento do devedor. Opções { CPF ou CNPJ }
numero_documento: Numero do documento do devedor
e-mail: email de cobrança do devedor
Body
raw (json)
View More
json
{
"valor": 100,
"vencimento": "2024-06-21T16:45:00", // (Opicional) Data de vencimento da cobrança, não informando, o tempo limite do vencimento é de 1 hora
"descricao": "Cobrança de teste", // Breve descrição da cobrança
"tipo_transacao": "invoice", // invoice: Quando deseja receber status da transação em webhook, invoiceFrenteCaixa: Quando não deseja receber status da transação em webhook
"texto_instrucao": "Instruções", // Texto em até 1000 caractere
"identificador_externo": "23268130", // Identificador único do parceiro, podendo usar uuid
"identificador_movimento": "23258129", // Identificador auxiliar do parceiro, podendo usar uuid
"cliente": { // (Opicional) Identificador do devedor
"nome": "Maria Eduarda",
"tipo_documento": "cpf",
"numero_documento": "744.674.080-96",
"e-mail": "eduarda@gmail.com"
}
}
Example Request
Criar cobrança PIX
View More
nodejs
var https = require('follow-redirects').https;
var fs = require('fs');
var options = {
'method': 'POST',
'hostname': 'sandbox-gateway.service-canvi.com.br',
'port': 8080,
'path': '/bt/invoice_pix',
'headers': {
},
'maxRedirects': 20
};
var req = https.request(options, function (res) {
var chunks = [];
res.on("data", function (chunk) {
chunks.push(chunk);
});
res.on("end", function (chunk) {
var body = Buffer.concat(chunks);
console.log(body.toString());
});
res.on("error", function (error) {
console.error(error);
});
});
var postData = "{\r\n \"valor\": 100, \r\n \"vencimento\": \"2024-06-21T16:45:00\", // (Opicional) Data de vencimento da cobrança, não informando, o tempo limite do vencimento é de 1 hora\r\n \"descricao\": \"Cobrança de teste\", // Breve descrição da cobrança\r\n \"tipo_transacao\": \"invoice\", // invoice: Quando deseja receber status da transação em webhook, invoiceFrenteCaixa: Quando não deseja receber status da transação em webhook\r\n \"texto_instrucao\": \"Instruções\", // Texto em até 1000 caractere\r\n \"identificador_externo\": \"23268130\", // Identificador único do parceiro, podendo usar uuid\r\n \"identificador_movimento\": \"23258129\", // Identificador auxiliar do parceiro, podendo usar uuid\r\n \"cliente\": { // (Opicional) Identificador do devedor\r\n \"nome\": \"Maria Eduarda\",\r\n \"tipo_documento\": \"cpf\",\r\n \"numero_documento\": \"744.674.080-96\",\r\n \"e-mail\": \"eduarda@gmail.com\"\r\n \r\n } \r\n}";
req.write(postData);
req.end();
Example Response
Body
Headers (0)
No response body
This request doesn't return any response body
POST
Consultar cobrança PIX
https://sandbox-gateway.service-canvi.com.br:8080/bt/consulta_invoice_pix
id_invoice_pix: identificação única gerada pela criação da cobrança PIX (Obrigatório)
Body
raw (json)
json
{
"id_invoice_pix": "52264"
}
Example Request
Consultar cobrança PIX
View More
nodejs
var https = require('follow-redirects').https;
var fs = require('fs');
var options = {
'method': 'POST',
'hostname': 'sandbox-gateway.service-canvi.com.br',
'port': 8080,
'path': '/bt/consulta_invoice_pix',
'headers': {
},
'maxRedirects': 20
};
var req = https.request(options, function (res) {
var chunks = [];
res.on("data", function (chunk) {
chunks.push(chunk);
});
res.on("end", function (chunk) {
var body = Buffer.concat(chunks);
console.log(body.toString());
});
res.on("error", function (error) {
console.error(error);
});
});
var postData = "{\r\n \"id_invoice_pix\": \"52264\"\r\n}";
req.write(postData);
req.end();
Example Response
Body
Headers (0)
No response body
This request doesn't return any response body
POST
Criar Devolução Pix
https://sandbox-gateway.service-canvi.com.br:8080/bt/devolucao_pix
Body
raw (json)
json
{
"id_invoice_pix":"169327",
"identificador_externo": 35,
"descricao": "Devolução de teste",
"texto_instrucao": "Instrução..."
}