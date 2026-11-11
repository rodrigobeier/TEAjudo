# TEAjudo

O TEAjudo é uma plataforma web informacional e interativa desenvolvida como Trabalho de Conclusão de Curso (TCC). O projeto tem como objetivo principal promover a inclusão social, a comunicação e o bem-estar de pessoas com Transtorno do Espectro Autista (TEA), além de oferecer suporte para familiares, cuidadores e a sociedade em geral.

A plataforma centraliza informações confiáveis em linguagem acessível e conta com um assistente virtual baseado em Inteligência Artificial (IA) para responder a dúvidas com base exclusivamente no conteúdo validado do site.

## Funcionalidades

- **Informações Confiáveis:** Conteúdos organizados sobre o TEA (níveis de suporte, questões sensoriais, diagnóstico precoce, entre outros).
- **Chat com IA (RAG):** Assistente virtual que utiliza Inteligência Artificial (Google Gemini) e a técnica de RAG (Retrieval-Augmented Generation) para responder perguntas usando apenas a base de conhecimento do próprio site, evitando alucinações e garantindo segurança.
- **Autenticação de Usuários:** Sistema de cadastro e login seguro (com senhas criptografadas) e gerenciamento de sessão.
- **Perfil do Usuário:** Página exclusiva para usuários logados visualizarem seus dados e o histórico de conversas.
- **Histórico de Conversas:** O chat salva as interações no banco de dados vinculadas ao usuário. O título da conversa é atualizado automaticamente com a primeira pergunta.
- **Design Acessível:** Interface responsiva e adaptada para conforto sensorial, utilizando cores suaves e navegação intuitiva.

## Tecnologias Utilizadas

O projeto foi construído utilizando a arquitetura MVC (Model-View-Controller) e as seguintes tecnologias:

**Back-end:**
- [Node.js](https://nodejs.org/) (Ambiente de execução)
- [Express](https://expressjs.com/) (Framework web)
- [MySQL](https://www.mysql.com/) (Banco de dados relacional)
- [mysql2](https://www.npmjs.com/package/mysql2) (Driver de conexão com o banco)
- [Express Session](https://www.npmjs.com/package/express-session) (Gerenciamento de sessões de login)
- [Bcrypt](https://www.npmjs.com/package/bcrypt) (Criptografia de senhas)

**Inteligência Artificial:**
- [@google/genai](https://www.npmjs.com/package/@google/genai) (SDK oficial do Google Gemini)
- [@xenova/transformers](https://www.npmjs.com/package/@xenova/transformers) (Geração de embeddings local para o RAG)

**Front-end:**
- [EJS](https://ejs.co/) (Template engine)
- HTML5 e CSS3 (Estrutura e estilização)

**Hospedagem:**
- [Render](https://render.com/) (Hospedagem da aplicação)
- [Aiven](https://aiven.io/) (Hospedagem do banco de dados MySQL)

## Estrutura do Projeto

A estrutura de pastas segue o padrão MVC:

```text
TEAJUDO/
├── conteudo/         # Arquivos .txt com a base de conhecimento da IA (RAG)
├── controllers/      # Lógica de controle das rotas
├── database/         # Configuração e conexão com o MySQL
├── models/           # Modelos de dados (Usuario, Conversa, Mensagem)
├── public/           # Arquivos estáticos (CSS, imagens, scripts)
├── routes/           # Definição das rotas (API e Páginas)
├── services/         # Serviços externos (Integração com Gemini e RAG)
├── views/            # Templates EJS (páginas do site)
├── .env.example      # Exemplo de variáveis de ambiente
├── app.js            # Ponto de entrada da aplicação
├── package.json      # Dependências do projeto
└── README.md         # Documentação