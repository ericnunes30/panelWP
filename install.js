const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const backendPath = path.join(__dirname, 'backend');
const frontendPath = path.join(__dirname, 'frontend');

function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

function installDependencies(projectPath) {
  return new Promise((resolve, reject) => {
    const npmInstall = spawn('npm', ['install'], { 
      cwd: projectPath,
      stdio: 'inherit',
      shell: true 
    });

    npmInstall.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Instalação falhou no diretório ${projectPath}`));
      }
    });

    npmInstall.on('error', (error) => {
      reject(error);
    });
  });
}

function buildProject(projectPath) {
  return new Promise((resolve, reject) => {
    const npmBuild = spawn('npm', ['run', 'build'], { 
      cwd: projectPath,
      stdio: 'inherit',
      shell: true 
    });

    npmBuild.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Build falhou no diretório ${projectPath}`));
      }
    });

    npmBuild.on('error', (error) => {
      reject(error);
    });
  });
}

function createFirstUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    console.log('\n🔐 Vamos criar o primeiro usuário administrador:\n');

    function askName() {
      rl.question('Digite seu nome completo: ', (nome) => {
        if (!nome.trim()) {
          console.log('❌ Nome não pode estar vazio. Tente novamente.');
          askName();
          return;
        }
        askEmail(nome);
      });
    }

    function askEmail(nome) {
      rl.question('Digite seu email: ', (email) => {
        if (!validateEmail(email)) {
          console.log('❌ Email inválido. Por favor, digite um email válido.');
          askEmail(nome);
          return;
        }
        askPassword(nome, email);
      });
    }

    function askPassword(nome, email) {
      rl.question('Digite sua senha: ', (password) => {
        if (password.length < 6) {
          console.log('❌ Senha muito curta. Deve ter no mínimo 6 caracteres.');
          askPassword(nome, email);
          return;
        }
        rl.close();
        resolve({ nome, email, password });
      });
    }

    askName();
  });
}

function saveFirstUser(userData) {
  return new Promise((resolve, reject) => {
    const createUserScript = spawn('node', [
      '--experimental-modules',
      path.join(__dirname, 'backend', 'src', 'scripts', 'create-first-user.js'),
      ...userData.nome.split(' '),  // Espalhar nome em argumentos separados
      userData.email,
      userData.password
    ], { 
      stdio: 'inherit',
      shell: true 
    });

    createUserScript.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Falha ao criar usuário'));
      }
    });

    createUserScript.on('error', (error) => {
      reject(error);
    });
  });
}

function startServer(projectPath, projectName) {
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'start'], { 
      cwd: projectPath,
      stdio: 'inherit',
      shell: true,
      detached: true
    });

    server.unref(); // Permite que o processo continue mesmo se o processo pai terminar

    console.log(`🚀 ${projectName} iniciado com sucesso!`);
    resolve(server);
  });
}

async function startProductionServers() {
  try {
    // Iniciar backend
    await startServer(backendPath, 'Backend');

    // Iniciar frontend
    await startServer(frontendPath, 'Frontend');

    console.log('\n🌐 Ambos os servidores estão rodando em modo de produção');
  } catch (error) {
    console.error('❌ Erro ao iniciar servidores:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando instalação do Panel WP...\n');

    // Instalar dependências do backend
    console.log('📦 Instalando dependências do Backend...');
    await installDependencies(backendPath);
    console.log('✅ Dependências do Backend instaladas com sucesso!\n');

    // Instalar dependências do frontend
    console.log('📦 Instalando dependências do Frontend...');
    await installDependencies(frontendPath);
    console.log('✅ Dependências do Frontend instaladas com sucesso!\n');

    // Buildar frontend
    console.log('🏗️ Buildando Frontend...');
    await buildProject(frontendPath);
    console.log('✅ Frontend buildado com sucesso!\n');

    // Criar primeiro usuário
    const userData = await createFirstUser();

    // Salvar usuário no banco de dados
    console.log('\n🔐 Salvando usuário administrador...');
    await saveFirstUser(userData);

    // Iniciar servidores em produção
    await startProductionServers();

    console.log('\n🎉 Instalação e inicialização concluídas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a instalação:', error);
    process.exit(1);
  }
}

main();
