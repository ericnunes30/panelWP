# 🌐 Panel WP - Painel de Gerenciamento WordPress

## 📋 Descrição
Sistema de gerenciamento centralizado para múltiplos sites WordPress, focado em automação, monitoramento e segurança.

## 🚀 Funcionalidades Principais
- 🔐 Gerenciamento seguro de credenciais
- 🔄 Sincronização automática com sites WordPress
- 📊 Dashboard de monitoramento
- 🛡️ Verificações de segurança
- 🔍 Logs detalhados de atividades

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- PostgreSQL (Banco de dados)
- Sequelize ORM
- JWT (Autenticação)
- bcryptjs (Criptografia)

### Frontend
- React.js
- Material-UI
- Axios
- Context API
- React Router

## 🔧 Requisitos do Sistema
- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

## 📦 Instalação

### Configuração do Ambiente
```bash
# Clone o repositório
git clone https://github.com/ericnunes30/panelWP.git

# Entre no diretório
cd panelWP
```

### Backend
```bash
# Entre no diretório do backend
cd backend

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env

# Inicie o servidor
npm start
```

### Frontend
```bash
# Entre no diretório do frontend
cd frontend

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env

# Inicie o aplicativo
npm start
```

## ⚙️ Configuração
1. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   # Backend
   PORT=3001
   DB_NAME=panel_wp
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=sua_chave_secreta

   # Frontend
   REACT_APP_API_URL=http://localhost:3001/api
   ```

## 🔒 Segurança
- Todas as senhas são criptografadas
- Autenticação via JWT
- Proteção contra XSS e CSRF
- Validação de dados
- Logs de segurança

## 🤝 Como Contribuir
1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores
- **Eric Nunes** - *Desenvolvedor Principal* - [GitHub](https://github.com/ericnunes30)

## 📞 Suporte
- Email: decolevendasagencia@gmail.com
- Issues: [GitHub Issues](https://github.com/ericnunes30/panelWP/issues)

## 🌟 Agradecimentos
- Comunidade WordPress
- Contribuidores
- Usuários que fornecem feedback
