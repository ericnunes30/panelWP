import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolver __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configurar conexão com o banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME || 'panel_wp',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '123456',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log  // Log detalhado
  }
);

// Definir modelo de usuário
const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'admin'
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo'),
    defaultValue: 'ativo'
  }
});

async function createFirstUser(userData) {
  try {
    console.log('🔧 Sincronizando banco de dados (RECRIANDO TABELAS)...');
    
    // Força a recriação de todas as tabelas
    await sequelize.sync({ force: true });
    console.log('✅ Tabelas recriadas com sucesso!');

    // Gerar hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Criar usuário
    const newUser = await User.create({
      nome: userData.nome,
      email: userData.email,
      password: hashedPassword,
      role: 'admin',
      status: 'ativo'
    });

    console.log('🎉 Usuário administrador criado com sucesso!');
    console.log(`Nome: ${newUser.nome}`);
    console.log(`Email: ${newUser.email}`);
    console.log(`Função: ${newUser.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    console.error('Detalhes completos do erro:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

// Receber dados do usuário via argumentos
const userData = {
  nome: process.argv.slice(2, -2).join(' '),  // Pega todos os argumentos antes dos últimos dois
  email: process.argv[process.argv.length - 2],
  password: process.argv[process.argv.length - 1]
};

if (!userData.nome || !userData.email || !userData.password) {
  console.error('❌ Todos os argumentos são obrigatórios: nome, email, senha');
  process.exit(1);
}

createFirstUser(userData);
