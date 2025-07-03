const dns = require("dns").promises;
const zxcvbn = require("zxcvbn"); // NOVO: Substituindo o owasp-password-strength-test

// Sistema de mensagens para erros
const errorMessages = {
  email: {
    empty: "Email não pode ser vazio.",
    invalidFormat: "Formato de email inválido.",
    invalidDomain: "Domínio do email inválido.",
  },
  password: {
    empty: "Senha não pode ser vazia.",
    weak: "A senha é muito fraca. Tente combinar letras, números e símbolos.",
  }
};

// Funções de validação de email
async function validarEmail(email) {
  if (!email || typeof email !== 'string') throw new Error(errorMessages.email.empty);
  
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) throw new Error(errorMessages.email.invalidFormat);

  const [, domain] = email.split('@');
  
  try {
    // A verificação de DNS pode adicionar latência. Uma alternativa é confiar
    // no e-mail de verificação que o Firebase envia.
    await dns.lookup(domain);
  } catch (error) {
    throw new Error(errorMessages.email.invalidDomain);
  }

  return true; // ALTERADO: Retorna true em caso de sucesso.
}

// Funções de validação de senha
function validarSenha(password) {
  if (!password) throw new Error(errorMessages.password.empty);

  const result = zxcvbn(password);
  
  // ALTERADO: Usando o score do zxcvbn. Exigimos no mínimo 2 (escala de 0 a 4).
  // 0: muito fraca, 1: fraca, 2: razoável, 3: boa, 4: forte
  if (result.score < 2) {
    // Você pode até usar o feedback do zxcvbn para dar dicas melhores ao usuário.
    // ex: result.feedback.suggestions
    throw new Error(errorMessages.password.weak);
  }

  return true;
}

// REMOVIDO: Funções repetitivas como validateRegisterForm.
// A validação agora deve ser feita diretamente nas rotas, lançando erros.

function isNotEmpty(value) {
  return value && typeof value === 'string' && value.trim().length > 0;
}

function validarHorario(horarioInicio, horarioTermino) {
  return horarioInicio < horarioTermino;
}

function isHoraPermitida(horaInicio, horaTermino, periodo) {
  const horaInicioInt = parseInt(horaInicio.split(':')[0], 10);
  const horaTerminoInt = parseInt(horarioTermino.split(':')[0], 10);

  const periodosPermitidos = {
    manhã: { inicio: 6, fim: 12 },
    tarde: { inicio: 12, fim: 18 },
    noite: { inicio: 18, fim: 24 }
  };

  const limite = periodosPermitidos[periodo.toLowerCase()];
  if (!limite) return false;
  
  return horaInicioInt >= limite.inicio && horaTerminoInt <= limite.fim;
}

module.exports = {
  errorMessages,
  validarEmail,
  validarSenha,
  isNotEmpty,
  validarHorario,
  isHoraPermitida
};