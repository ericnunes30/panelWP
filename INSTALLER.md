# 🚀 Panel WP - Instalador Automatizado para Windows

## 📋 Objetivo
Criar um instalador Python focado no ambiente Windows para configuração e inicialização do projeto Panel WP.

## 🔍 Escopo do Instalador para Windows

### 1. Verificação de Pré-Requisitos do Windows
- [ ] Windows 10/11 (64-bit)
- [ ] PowerShell 5.1+ 
- [ ] .NET Framework 4.7.2+
- [ ] Python 3.8+ (64-bit)
- [ ] Node.js LTS (64-bit)
- [ ] npm
- [ ] PostgreSQL (preferencialmente versão Windows)

### 2. Dependências Específicas do Windows
- Bibliotecas Python:
  - `winreg` - Manipulação de registro do Windows
  - `pywin32` - Integração com APIs do Windows
  - `colorama` - Suporte a cores no console do Windows
- Ferramentas:
  - `choco` (Chocolatey) para gerenciamento de pacotes
  - `winget` como alternativa

### 3. Etapas de Instalação Específicas para Windows

#### 3.1 Preparação do Ambiente
- [ ] Verificar permissões de administrador
- [ ] Configurar execução de scripts do PowerShell
- [ ] Configurar variáveis de ambiente
- [ ] Desabilitar restrições de segurança para instalação

#### 3.2 Instalação de Dependências
- [ ] Método 1: Usar Chocolatey
  ```powershell
  choco install python nodejs postgresql
  ```
- [ ] Método 2: Download direto e instalação silenciosa
- [ ] Configurar PATH do Windows automaticamente

#### 3.3 Configuração de Banco de Dados
- [ ] Criar serviço do PostgreSQL
- [ ] Configurar autenticação do Windows
- [ ] Criar banco de dados via PowerShell
- [ ] Configurar firewall para PostgreSQL

#### 3.4 Configurações de Segurança
- [ ] Desativar temporariamente Windows Defender durante instalação
- [ ] Configurar exceções para pastas do projeto
- [ ] Gerenciar UAC (User Account Control)

### 4. Modos de Operação no Windows

#### 4.1 Modo Interativo
- Interface gráfica com `PyQt5` ou `tkinter`
- Wizard de instalação estilo Windows
- Opções de personalização

#### 4.2 Modo CLI
- Instalação via PowerShell
- Suporte a argumentos de linha de comando
- Logs detalhados

### 5. Tratamento de Erros Específicos do Windows
- [ ] Tratamento de erros de permissão
- [ ] Rollback de instalações
- [ ] Restauração de configurações
- [ ] Compatibilidade com diferentes versões do Windows

### 6. Estrutura do Projeto de Instalação

```
installer_win/
├── __init__.py
├── main.py           # Ponto de entrada principal
├── windows_utils.py  # Funções específicas do Windows
├── registry.py       # Manipulação de registro
├── firewall.py       # Configurações de firewall
├── services.py       # Gerenciamento de serviços
└── requirements.txt  # Dependências do instalador
```

### 7. Comandos para Windows

```powershell
# Instalação padrão
python install.py

# Modo silencioso
python install.py --silent

# Verificar compatibilidade
python install.py check-compatibility

# Desinstalar
python install.py uninstall
```

### 8. Considerações Técnicas para Windows
- Uso de `subprocess.Popen()` com `shell=True`
- Suporte a caminhos longos do Windows
- Gerenciamento de versões de Python/Node
- Integração com Windows Services

### 9. Pós-Instalação
- [ ] Criar atalhos no menu Iniciar
- [ ] Configurar inicialização automática
- [ ] Criar entrada no Painel de Controle

### 10. Requisitos de Sistema Recomendados
- Processador: Intel/AMD 64-bit
- RAM: 8GB+ 
- Armazenamento: 10GB livres
- Resolução: 1280x720+

## 🚧 Próximos Passos
- [ ] Prototipagem do instalador para Windows
- [ ] Testes em diferentes versões do Windows
- [ ] Empacotamento com PyInstaller
- [ ] Criação de instalador executável (.exe)

## 📝 Notas
Instalador específico para Windows. Feedback e contribuições são bem-vindos!
