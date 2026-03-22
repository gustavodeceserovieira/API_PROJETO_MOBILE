import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const secretToken = process.env.JWT_SECRET

export const jwtAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Falha na autenticação. Faltando o token');
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, secretToken);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Falha na autenticação, token expirou');
        }
        console.log()
        return res.status(401).send('Falha na autenticação, token inválido.');    
    }
}

export const authorize = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization
        if(!authHeader){
            return res.status(401).json({mensagem:"Token não enviado"})
        }
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({mensagem:"Token inválido"})

            }
            if(!roles.includes(decoded['role'])){
                return res.status(403).json({mensagem:"Sem permissão"})
            }
            req.user = decoded
            next()
        })
    }
}
