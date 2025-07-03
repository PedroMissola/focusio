const express = require("express");
const admin = require("firebase-admin");
const loginUser = require("../firebase/functions/auth/login");
const { resetUserPassword } = require("../firebase/functions/auth/resetPassword");
const { insertContactAndLog } = require("../firebase/inserts/insertContact");
const { inserttask } = require("../firebase/inserts/insertTasks");
const { createUser, verifyEmailCode } = require("../firebase/functions/auth/register");
const authMiddleware = require("../middlewares/auth.js");
// Validações (idealmente, usar uma biblioteca como express-validator ou zod no futuro)
const { validateLoginForm, validarEmail, validarSenha, isNotEmpty } = require("../modules/verifications");

const router = express.Router();

// Rota de Login - pública
router.post("/login", async (req, res) => {
    const { loginemail, loginpassword, loginrememberMe } = req.body;

    // A validação pode ser melhorada, mas mantendo a estrutura original por enquanto
    if (!loginemail || !loginpassword) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        // Supondo que loginUser agora retorne uma Promise com o sessionCookie
        const { sessionCookie, expiresIn } = await loginUser(loginemail, loginpassword, loginrememberMe === "true");

        // Configura os cookies no cliente
        res.cookie("session", sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        
        res.status(200).json({ message: "Login bem-sucedido" });
    } catch (error) {
        res.status(401).json({ error: "Credenciais inválidas." });
    }
});

// Rota de Registro - pública
router.post("/register", async (req, res) => {
    const { registername, registersurname, registeremail, registerpassword, registerconfirmpassword, termos } = req.body;

    // Lógica de validação simplificada para o exemplo
    if (registerpassword !== registerconfirmpassword) return res.status(400).json({ error: "As senhas não coincidem." });
    if (!termos) return res.status(400).json({ error: "Você deve aceitar os termos de uso." });

    try {
        await createUser({ email: registeremail, password: registerpassword, displayName: `${registername} ${registersurname}` });
        // O frontend deve redirecionar o usuário para a página de verificação de email
        res.status(201).json({ message: "Usuário registrado com sucesso. Por favor, verifique seu e-mail." });
    } catch (error) {
        res.status(409).json({ error: "Erro ao registrar usuário. O e-mail pode já estar em uso." });
    }
});

// Rota para resetar a senha
router.post("/resetpassword", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório.' });

    try {
        await resetUserPassword(email);
        res.status(200).json({ message: "Se o e-mail estiver cadastrado, um link para redefinição de senha foi enviado." });
    } catch (error) {
        // Não informe ao usuário se o email existe ou não por segurança.
        res.status(200).json({ message: "Se o e-mail estiver cadastrado, um link para redefinição de senha foi enviado." });
    }
});

// Rota de verificação de e-mail
router.post("/verify-email", async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email e código são obrigatórios."});

    try {
        await verifyEmailCode(email, code.join ? code.join("") : code);
        res.status(200).json({ message: "E-mail verificado com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: "Código de verificação inválido ou expirado." });
    }
});

// --- ROTAS PROTEGIDAS ---

// Rota para inserir tarefas, agora protegida pelo authMiddleware
router.post("/insertTasks", authMiddleware, async (req, res) => {
    const { nome, sobrenome, materia, horarioInicio, horarioTermino, tempoEstimado, periodo } = req.body;
    const UID = req.user.uid; // UID obtido do middleware, muito mais seguro!

    try {
        await inserttask({ UID, nome, sobrenome, materia, horarioInicio, horarioTermino, tempoEstimado, periodo });
        res.status(201).json({ message: "Tarefa inserida com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao inserir tarefa. Tente novamente." });
    }
});

// Rota de contato - pode ser pública ou protegida, dependendo da sua regra de negócio
router.post("/contact", async (req, res) => {
    const contactData = req.body;
    if (!contactData.name || !contactData.email || !contactData.message) {
         return res.status(400).json({ error: "Nome, e-mail e mensagem são obrigatórios." });
    }

    try {
        await insertContactAndLog(contactData);
        res.status(200).json({ message: "Sua mensagem foi enviada com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao enviar a mensagem. Tente novamente." });
    }
});


module.exports = router;