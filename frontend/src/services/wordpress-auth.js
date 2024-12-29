import axios from 'axios';

class WordPressAuthService {
  // Método de autenticação padrão (JWT)
  static async authenticateWithJWT(url, username, password) {
    try {
      const response = await axios.post(`${url}/wp-json/jwt-auth/v1/token`, {
        username,
        password
      });

      return {
        method: 'jwt',
        token: response.data.token,
        user: response.data.user_display_name
      };
    } catch (error) {
      console.error('Falha na autenticação JWT:', error);
      throw new Error('Falha na autenticação JWT');
    }
  }

  // Método de autenticação básica (para sites sem JWT)
  static async authenticateWithBasicAuth(url, username, password) {
    try {
      const response = await axios.get(`${url}/wp-json/wp/v2/users/me`, {
        auth: {
          username,
          password
        }
      });

      return {
        method: 'basic',
        userId: response.data.id,
        username: response.data.name
      };
    } catch (error) {
      console.error('Falha na autenticação básica:', error);
      throw new Error('Falha na autenticação básica');
    }
  }

  // Método para detectar o melhor método de autenticação
  static async detectAuthMethod(url, username, password) {
    try {
      // Primeiro, tenta JWT
      try {
        return await this.authenticateWithJWT(url, username, password);
      } catch (jwtError) {
        // Se JWT falhar, tenta autenticação básica
        return await this.authenticateWithBasicAuth(url, username, password);
      }
    } catch (error) {
      console.error('Nenhum método de autenticação funcionou:', error);
      throw new Error('Não foi possível autenticar no site WordPress');
    }
  }

  // Verificar se o site tem suporte a JWT
  static async checkJWTSupport(url) {
    try {
      const response = await axios.get(`${url}/wp-json/jwt-auth/v1/token`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Método para renovar token (se aplicável)
  static async refreshToken(url, token) {
    try {
      const response = await axios.post(`${url}/wp-json/jwt-auth/v1/token/validate`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Falha ao renovar token:', error);
      throw new Error('Não foi possível renovar o token');
    }
  }
}

export default WordPressAuthService;
