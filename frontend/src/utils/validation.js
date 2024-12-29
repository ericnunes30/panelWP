// Expressão regular para validar URLs WordPress
const WORDPRESS_URL_REGEX = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

// Expressão regular para validar nomes de usuário WordPress
const WORDPRESS_USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,60}$/;

class ValidationService {
  // Validar URL do WordPress
  static validateWordPressUrl(url) {
    if (!url) {
      throw new Error('URL é obrigatória');
    }

    if (!WORDPRESS_URL_REGEX.test(url)) {
      throw new Error('URL inválida. Use um formato de URL completo (http:// ou https://)');
    }

    // Remover barra final, se existir
    return url.replace(/\/$/, '');
  }

  // Validar nome de usuário WordPress
  static validateUsername(username) {
    if (!username) {
      throw new Error('Nome de usuário é obrigatório');
    }

    if (!WORDPRESS_USERNAME_REGEX.test(username)) {
      throw new Error('Nome de usuário inválido. Use 3-60 caracteres (letras, números, _, ., -)');
    }

    return username;
  }

  // Validar senha (critérios básicos de segurança)
  static validatePassword(password) {
    if (!password) {
      throw new Error('Senha é obrigatória');
    }

    if (password.length < 8) {
      throw new Error('Senha deve ter no mínimo 8 caracteres');
    }

    // Verificar complexidade da senha
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      throw new Error('Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais');
    }

    return password;
  }

  // Validar dados completos do site
  static validateSiteData(siteData) {
    return {
      name: siteData.name || 'Site sem nome',
      url: this.validateWordPressUrl(siteData.url),
      username: this.validateUsername(siteData.username),
      password: this.validatePassword(siteData.password)
    };
  }
}

export default ValidationService;
