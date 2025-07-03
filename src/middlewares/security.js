const helmet = require('helmet');
const session = require('express-session');
const { csrf } = require('tiny-csrf');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

module.exports = (app) => {
  if (!app || typeof app.use !== 'function') {
    throw new TypeError('Expected app to be an instance of express');
  }

  // Habilita o Helmet com padrões de segurança. Fundamental para produção.
  app.use(helmet());

  // Configuração de sessão. Essencial para autenticação e CSRF.
  app.use(
    session({
      secret: process.env.SESSION_SECRET, // Certifique-se que essa variável está no seu .env
      resave: false,
      saveUninitialized: false,
      rolling: true, // Renova o tempo da sessão a cada requisição
      cookie: {
        httpOnly: true, // O cookie não pode ser acessado por JavaScript no cliente
        secure: process.env.NODE_ENV === 'production', // Usar 'true' em produção (HTTPS)
        sameSite: 'strict', // Mitigação forte contra ataques CSRF
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      },
    })
  );

  // NOVO: Implementação do tiny-csrf.
  // Ele é mais simples e seguro que a implementação manual anterior.
  // Protege contra ataques CSRF em requisições POST, PUT, DELETE, etc.
  app.use(
    csrf({
      cookie: {
        key: '_csrf-token',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      },
      // O valor retornado por `req.csrfToken()` será enviado ao cliente.
      value: (req) => req.csrfToken(),
    })
  );
};