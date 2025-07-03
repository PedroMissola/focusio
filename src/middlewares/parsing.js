const express = require('express');
const cookieParser = require('cookie-parser');

// NOVO: Simplificado para usar apenas o essencial.
module.exports = (app) => {
  // Middleware para analisar JSON. O body-parser não é mais necessário para isso.
  app.use(express.json({ limit: '10kb' }));

  // Middleware para analisar URLs codificadas.
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Middleware para analisar cookies, necessário para sessões e CSRF.
  app.use(cookieParser(process.env.COOKIE_SECRET));
};