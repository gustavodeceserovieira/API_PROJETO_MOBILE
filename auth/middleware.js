import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const secretToken = process.env.JWT_SECRET

const jwtAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Falha na autenticação. Faltando o token');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secretToken);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Falha na autenticação, token expirou');
        }
        console.log()
        return res.status(401).send('Falha na autenticação, token inválido.');    
    };
}
export default jwtAuth;
