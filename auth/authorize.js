import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


dotenv.config()

function authorize(roles = []) {
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

export default authorize;