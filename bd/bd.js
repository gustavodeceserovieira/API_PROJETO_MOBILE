import mysql from 'mysql2/promise';
import dotenv from 'dotenv'

dotenv.config()


async function getConexao() {
    const bd = await mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.PORT_DB
  });
  return bd;
}


export default getConexao;

