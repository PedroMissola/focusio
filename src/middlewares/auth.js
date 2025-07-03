const admin = require('firebase-admin');

// ALTERADO: A lógica agora retorna erros em JSON em vez de redirecionar.
async function authMiddleware(req, res, next) {
    const sessionCookie = req.cookies.session || '';

    if (!sessionCookie) {
        // Se não há cookie de sessão, o usuário não está autenticado.
        return res.status(401).json({ error: 'Unauthorized: No session cookie provided.' });
    }

    try {
        // Verifica o cookie de sessão com o Firebase. O segundo argumento `true` checa por revogação.
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

        if (!decodedClaims.email_verified) {
            // O usuário está autenticado, mas o e-mail não foi verificado.
            return res.status(403).json({ error: 'Forbidden: Email not verified.' });
        }
        
        // Adiciona os dados do usuário ao objeto `req` para uso em outras rotas.
        req.user = decodedClaims;
        next();
    } catch (error) {
        // O cookie é inválido ou expirou.
        return res.status(401).json({ error: 'Unauthorized: Invalid session cookie.' });
    }
}

module.exports = authMiddleware;