// NOVO: Este arquivo agora responde com JSON, adequado para uma API.
module.exports = (app) => {
    // Middleware para capturar rotas não encontradas (Erro 404)
    app.use((req, res, next) => {
        res.status(404).json({
            error: 'Not Found',
            message: `A rota '${req.path}' com o método '${req.method}' não foi encontrada.`,
        });
    });

    // Middleware de Tratamento de Erros (deve ser o último middleware)
    app.use((err, req, res, next) => {
        // Logar o erro usando um logger como o Pino seria ideal aqui.
        console.error(err); // Mantenha um log do erro no servidor

        const isDevelopment = process.env.NODE_ENV === 'development';
        
        // Resposta de erro genérica para produção
        const errorResponse = {
            title: 'Internal Server Error',
            message: 'Ocorreu um erro inesperado no servidor.',
            // Em desenvolvimento, incluir detalhes do erro para facilitar o debug
            details: isDevelopment ? err.stack : undefined,
        };

        res.status(500).json(errorResponse);
    });
};