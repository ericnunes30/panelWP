import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './services/database.js';
import userRoutes from './routes/user.routes.js';
import siteRoutes from './routes/site.routes.js';
import UserService from './services/user-service.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/sites', siteRoutes);

// Rota de login separada
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.authenticateUser(email, password);
    res.json({
      user,
      token: 'dummy_token_for_now' // TODO: Implementar geração de token JWT
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Teste de conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log(' Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error(' Erro ao conectar com o banco de dados:', err);
  });

app.listen(PORT, '0.0.0.0', () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});

export default app;
