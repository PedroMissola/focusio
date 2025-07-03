const express = require('express');
const authMiddleware = require("../middlewares/auth.js");
const { signOutUser } = require("../firebase/functions/auth/signout.js");

const router = express.Router();

// Rota pública para checar o status de autenticação do usuário.
router.get("/auth/status", (req, res) => {
    // A presença de um cookie de sessão válido é o indicador. O authMiddleware faz a verificação real.
    const isLoggedIn = !!req.cookies.session;
    res.status(200).json({ loggedIn: isLoggedIn });
});

// Rota para logout do usuário.
router.get("/logout", async (req, res) => {
    try {
        await signOutUser(req, res); // Supondo que esta função invalide a sessão no Firebase
        
        // Limpa os cookies no navegador do cliente
        res.clearCookie("loggedIn");
        res.clearCookie("session");
        
        res.status(200).json({ message: "Logout bem-sucedido." });
    } catch (error) {
        console.error('Erro durante o logout:', error);
        res.status(500).json({ error: "Falha ao fazer logout." });
    }
});


// --- ROTAS PROTEGIDAS ---

// Exemplo de como a rota /agenda ficaria como uma API.
router.get("/agenda", authMiddleware, async (req, res) => {
    try {
        // req.user foi adicionado pelo authMiddleware e contém os dados do usuário logado (UID, email, etc.)
        const userId = req.user.uid;
        
        // AQUI você colocaria a lógica para buscar os dados da agenda do usuário no Firebase
        // Exemplo: const agendaData = await getAgendaFromFirestore(userId);

        res.status(200).json({
            title: "Agenda",
            // data: agendaData 
            data: { user: req.user, message: "Dados da agenda iriam aqui." } // Placeholder
        });
    } catch (error) {
        res.status(500).json({ error: "Não foi possível buscar os dados da agenda." });
    }
});

// Exemplo de como a rota /task ficaria.
router.get("/task", authMiddleware, async (req, res) => {
    // Lógica similar à /agenda para buscar tarefas
     res.status(200).json({
        title: "Tarefas",
        data: { user: req.user, message: "Dados das tarefas iriam aqui." } // Placeholder
    });
});

// NOVO: Uma rota para obter o token CSRF
// O frontend chamará esta rota antes de fazer um POST/PUT/DELETE para obter um token válido.
router.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});


module.exports = router;