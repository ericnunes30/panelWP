require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./services/database');
const userRoutes = require('./routes/user.routes');
const siteRoutes = require('./routes/site.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/sites', siteRoutes);

// Teste de conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log(' Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error(' Erro ao conectar com o banco de dados:', err);
  });

app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});
