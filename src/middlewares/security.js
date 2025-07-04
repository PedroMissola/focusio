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

  // Habilita o Helmet com padrões de segurança, customizando o CSP para o Google Analytics
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // Permite scripts de origem própria e dos domínios do Google Analytics
          scriptSrc: [
            "'self'", // Permite scripts do seu próprio domínio
            "*.google-analytics.com",
            "*.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://www.googletagmanager.com",
            "https://tagmanager.google.com" // Opcional, se você usar o Tag Manager UI
          ],
          // Opcional: Para pixels de imagem (geralmente usados pelo GA)
          imgSrc: [
            "'self'",
            "data:", // Para imagens embutidas (base64)
            "*.google-analytics.com",
            "*.googletagmanager.com"
          ],
          // Opcional: Para conectar ao Google Analytics (fetch/XHR)
          connectSrc: [
            "'self'",
            "*.google-analytics.com",
            "*.analytics.google.com",
            "*.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://www.analytics.google.com",
            "https://www.googletagmanager.com"
          ],
          // Permite que o CSS seja carregado de qualquer fonte (ou refine isso)
          styleSrc: ["'self'", "'unsafe-inline'", "*.googleapis.com"],
          // Permite que fontes sejam carregadas de qualquer fonte (ou refine isso)
          fontSrc: ["'self'", "data:", "*.googleapis.com", "*.gstatic.com"],
          // Permite frames (se você tiver embeds, como vídeos ou reCAPTCHA)
          frameSrc: ["'self'", "*.google.com"],
          // Outras diretivas de segurança do Helmet
          upgradeInsecureRequests: [], // Força HTTPS para todos os recursos
          blockAllMixedContent: true, // Bloqueia conteúdo misto HTTP/HTTPS
        },
      },
      // Se você estiver usando EJS ou outro template engine que possa injetar HTML,
      // e o Helmet estiver dando problemas, você pode desabilitar alguns módulos aqui.
      // Porém, o CSP é a principal preocupação para o Analytics.
    })
  );

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

  // Implementação do tiny-csrf.
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