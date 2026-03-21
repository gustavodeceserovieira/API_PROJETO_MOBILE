export const validarCampos = (campos) => {
    return (req, res, next) => {
        const ausentes = [];

        campos.forEach(campo => {
            if (req.body[campo] === undefined || req.body[campo] === null || req.body[campo] === "") {
                ausentes.push(campo);
            }
        });

        if (ausentes.length > 0) {
            return res.status(400).json({
                mensagem: `Erro de validação. Campos obrigatórios: ${ausentes.join(', ')}`
            });
        }

        next();
    };
};