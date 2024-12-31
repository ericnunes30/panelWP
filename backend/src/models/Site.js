import { DataTypes } from 'sequelize';
import { sequelize } from '../services/database.js';

const Site = sequelize.define('Site', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo'),
    defaultValue: 'ativo'
  },
  tipo: {
    type: DataTypes.ENUM('wordpress', 'outros'),
    defaultValue: 'wordpress'
  },
  credenciais: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Site;
