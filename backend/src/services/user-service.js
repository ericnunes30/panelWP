import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Logger from './logger.js';

class UserService {
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async createUser(userData) {
    try {
      const hashedPassword = await this.hashPassword(userData.password);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      const { password, ...userWithoutPassword } = user.get();
      return userWithoutPassword;
    } catch (error) {
      Logger.error('Erro ao criar usuário:', error);
      throw new Error('Erro ao criar usuário');
    }
  }

  static async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const isValid = await this.comparePassword(password, user.password);
      
      if (!isValid) {
        throw new Error('Senha inválida');
      }

      const { password: _, ...userWithoutPassword } = user.get();
      return userWithoutPassword;
    } catch (error) {
      Logger.error('Erro na autenticação:', error);
      throw error;
    }
  }

  static async updateUser(id, updateData) {
    try {
      const user = await User.findByPk(id);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (updateData.password) {
        updateData.password = await this.hashPassword(updateData.password);
      }

      await user.update(updateData);
      
      const { password, ...userWithoutPassword } = user.get();
      return userWithoutPassword;
    } catch (error) {
      Logger.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }
}

export default UserService;
