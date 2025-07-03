// ===== ARQUIVO PRINCIPAL DA API =====

const express = require('express');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const pino = require('pino-http')(); // NOVO: Logger de requisições HTTP

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// --- CONFIGURAÇÃO DE MIDDLEWARES ESSENCIAIS ---

// NOVO: Middleware de CORS para permitir requisições do seu frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Altere para a URL do seu frontend
  credentials: true // Essencial para permitir o envio de cookies (para sessão e CSRF)
}));

// NOVO: Logger para todas as requisições
app.use(pino);

// Importação e configuração dos nossos middlewares customizados
require('./src/middlewares/parsing')(app); // Body-parser, cookie-parser
require('./src/middlewares/security')(app); // Helmet, session, CSRF

// --- ROTAS DA API ---
// NOVO: Todas as rotas agora estão sob o prefixo /api

const routeGet = require('./src/routes/routeGet');
const routePost = require('./src/routes/routePost');

app.use('/api', routeGet);
app.use('/api', routePost);


// --- SERVINDO ARQUIVOS ESTÁTICOS DO FRONTEND ---
// Esta seção serve os arquivos do seu frontend (HTML, CSS, JS)
// Deve vir DEPOIS das rotas da API.
app.use(express.static(path.join(__dirname, 'public')));

// Fallback para SPAs (Single Page Applications): Se nenhuma rota de API ou arquivo for encontrado,
// serve o index.html. Isso permite que o roteamento do frontend (ex: React Router) funcione.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// --- TRATAMENTO DE ERROS ---
// REMOVIDO: Middleware de erro genérico.
// NOVO: Usando nosso tratador de erros customizado, que deve ser o último.
require('./src/middlewares/errorHandler')(app);


// --- INICIALIZAÇÃO DO SERVIDOR ---
const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'development') {
  try {
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'key.pem')), // Usando path.join para segurança
      cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
    };

    https.createServer(options, app).listen(port, () => {
      console.log(`Servidor HTTPS (dev) rodando em https://localhost:${port}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor HTTPS. Certifique-se de que 'key.pem' e 'cert.pem' existem.", error.message);
    console.log(`Iniciando servidor HTTP de fallback em http://localhost:${port}`);
    app.listen(port);
  }
} else {
  // Em produção, o servidor HTTP geralmente fica atrás de um proxy reverso (Nginx, etc.) que lida com HTTPS.
  app.listen(port, () => {
    console.log(`Servidor (prod) rodando na porta ${port}`);
  });
}