const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const validateToken = (req, res, next) => {
  // Obtém o token do header Authorization (Bearer token)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token após "Bearer"
  // Verifica se o token foi fornecido
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados decodificados ao request para uso posterior
    next(); // Prossegue para a próxima middleware ou rota
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

const createSendToken = (usuario) => {
  const token = signToken(usuario.id);
  return {usuario, token}
};

module.exports = { signToken, createSendToken , validateToken};