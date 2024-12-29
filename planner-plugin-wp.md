# Plugin Panel WP Connector

## Objetivo
Criar um plugin WordPress para integração com o sistema central de automação e gerenciamento de sites.

## Escopo Mínimo Viável (MVP)

### Funcionalidades Básicas
1. **Autenticação**
   - Gerar chave de API única
   - Endpoint de autenticação seguro
   - Validação de credenciais do aplicativo gerenciador
   - Registro e armazenamento de chaves de aplicativos

2. **Endpoints REST**
   - `/panel-wp/v1/authenticate`: Registro e autenticação
   - `/panel-wp/v1/status`: Informações básicas do site
   - `/panel-wp/v1/execute-task`: Execução de tarefas simples

### Estrutura do Plugin
```php
<?php
/*
Plugin Name: Panel WP Connector
Description: Conecta o site WordPress ao sistema central
Version: 0.1
Author: Sua Equipe
*/

class PanelWPConnector {
    // Chave secreta definida no plugin para validar origem do app
    private const APP_SECRET_KEY = 'panel_wp_connector_secret_2024';
    
    // Opção para armazenar aplicativos autorizados
    private const AUTHORIZED_APPS_OPTION = 'panel_wp_authorized_apps';

    private $api_key = '';

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_endpoints']);
    }

    public function register_endpoints() {
        // Endpoint de autenticação
        register_rest_route('panel-wp/v1', '/authenticate', [
            'methods' => 'POST',
            'callback' => [$this, 'authenticate'],
            'permission_callback' => [$this, 'validate_app_origin']
        ]);

        // Endpoint para registrar novo aplicativo
        register_rest_route('panel-wp/v1', '/register-app', [
            'methods' => 'POST',
            'callback' => [$this, 'register_new_app'],
            'permission_callback' => '__return_true'
        ]);

        // Endpoint de status
        register_rest_route('panel-wp/v1', '/status', [
            'methods' => 'GET',
            'callback' => [$this, 'get_site_status'],
            'permission_callback' => [$this, 'validate_app_origin']
        ]);
    }

    // Registrar novo aplicativo
    public function register_new_app(WP_REST_Request $request) {
        $app_data = $request->get_json_params();

        // Validar dados do aplicativo
        if (!isset($app_data['app_name']) || 
            !isset($app_data['app_key']) || 
            !isset($app_data['app_identifier'])) {
            return new WP_Error(
                'invalid_app_data', 
                'Dados do aplicativo incompletos', 
                ['status' => 400]
            );
        }

        // Recuperar aplicativos autorizados
        $authorized_apps = get_option(self::AUTHORIZED_APPS_OPTION, []);

        // Verificar se o aplicativo já está registrado
        $existing_app = array_filter($authorized_apps, function($app) use ($app_data) {
            return $app['app_identifier'] === $app_data['app_identifier'];
        });

        if (!empty($existing_app)) {
            return new WP_Error(
                'app_already_registered', 
                'Aplicativo já registrado', 
                ['status' => 409]
            );
        }

        // Preparar dados do novo aplicativo
        $new_app = [
            'app_name' => sanitize_text_field($app_data['app_name']),
            'app_key' => sanitize_text_field($app_data['app_key']),
            'app_identifier' => sanitize_text_field($app_data['app_identifier']),
            'registered_at' => current_time('mysql'),
            'last_used' => null
        ];

        // Adicionar novo aplicativo
        $authorized_apps[] = $new_app;

        // Atualizar opção de aplicativos autorizados
        update_option(self::AUTHORIZED_APPS_OPTION, $authorized_apps);

        return [
            'status' => 'success',
            'message' => 'Aplicativo registrado com sucesso',
            'app_data' => [
                'app_name' => $new_app['app_name'],
                'app_identifier' => $new_app['app_identifier']
            ]
        ];
    }

    // Validar origem do aplicativo gerenciador
    public function validate_app_origin(WP_REST_Request $request) {
        $app_key = $request->get_header('X-Panel-WP-App-Key');
        $app_signature = $request->get_header('X-Panel-WP-Signature');
        $app_identifier = $request->get_header('X-Panel-WP-App-Identifier');

        // Verificação da chave do aplicativo
        if (!$app_key || !$app_signature || !$app_identifier) {
            return false;
        }

        // Recuperar aplicativos autorizados
        $authorized_apps = get_option(self::AUTHORIZED_APPS_OPTION, []);

        // Encontrar aplicativo correspondente
        $matching_app = array_filter($authorized_apps, function($app) use ($app_key, $app_identifier) {
            return $app['app_key'] === $app_key && 
                   $app['app_identifier'] === $app_identifier;
        });

        if (empty($matching_app)) {
            return false;
        }

        // Gerar assinatura esperada
        $expected_signature = hash_hmac('sha256', $app_key, self::APP_SECRET_KEY);

        // Comparar assinaturas
        return hash_equals($expected_signature, $app_signature);
    }

    public function authenticate(WP_REST_Request $request) {
        // Dados recebidos do aplicativo gerenciador
        $app_data = $request->get_json_params();

        // Validar dados do aplicativo
        if (!isset($app_data['app_identifier']) || 
            $app_data['app_identifier'] !== 'panel_wp_manager') {
            return new WP_Error(
                'invalid_app', 
                'Solicitação de aplicativo não autorizada', 
                ['status' => 403]
            );
        }

        // Gerar chave de API
        $this->api_key = $this->generate_api_key();
        
        return [
            'api_key' => $this->api_key,
            'site_url' => get_site_url(),
            'authenticated_at' => current_time('mysql'),
            'app_validation' => true
        ];
    }

    public function get_site_status() {
        return [
            'wordpress_version' => get_bloginfo('version'),
            'php_version' => phpversion(),
            'active_plugins' => $this->get_active_plugins(),
            'site_name' => get_bloginfo('name')
        ];
    }

    private function generate_api_key() {
        return bin2hex(random_bytes(16));
    }

    private function get_active_plugins() {
        $active_plugins = get_option('active_plugins');
        return array_map(function($plugin) {
            $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin);
            return [
                'name' => $plugin_data['Name'],
                'version' => $plugin_data['Version']
            ];
        }, $active_plugins);
    }
}

new PanelWPConnector();
```

## Fluxo de Registro de Aplicativo

### Processo de Registro
1. Aplicativo envia:
   - Nome do aplicativo
   - Chave do aplicativo
   - Identificador único

2. Plugin WordPress:
   - Valida dados recebidos
   - Verifica se aplicativo já existe
   - Armazena em opção do WordPress
   - Retorna status de registro

### Detalhes de Armazenamento
- Usa `wp_options` para persistência
- Chave: `panel_wp_authorized_apps`
- Armazena:
  - Nome do aplicativo
  - Chave do aplicativo
  - Identificador
  - Data de registro
  - Última utilização

## Próximos Passos
1. Implementar interface de gerenciamento de aplicativos
2. Adicionar método de revogação de acesso
3. Criar log de tentativas de conexão

## Considerações de Segurança
- Armazenamento seguro de chaves
- Validação rigorosa de aplicativos
- Possibilidade de revogar acesso
