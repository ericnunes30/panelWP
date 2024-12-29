import axios from 'axios';
import CryptoJS from 'crypto-js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { url, apiKey, password } = req.body;

      // Descriptografar a senha
      const decryptedPassword = CryptoJS.AES.decrypt(password, 'panel-wp-secret').toString(CryptoJS.enc.Utf8);

      // Tentar autenticar o site
      const apiEndpoint = `${url}/wp-json/panel-wp/v1/authenticate`;
      
      const response = await axios.post(apiEndpoint, 
        {}, 
        {
          headers: {
            'X-Api-Key': apiKey
          }
        }
      );

      if (response.data.status === 'success') {
        // Salvar site no banco de dados ou storage local
        // Aqui você pode adicionar lógica para salvar o site
        return res.status(200).json({
          message: 'Site autenticado com sucesso',
          site: {
            url,
            token: apiKey,
            user: response.data.user
          }
        });
      } else {
        return res.status(401).json({ message: 'Falha na autenticação' });
      }
    } catch (error) {
      console.error('Erro ao adicionar site:', error);
      return res.status(500).json({ 
        message: 'Erro ao adicionar site', 
        error: error.response?.data || error.message 
      });
    }
  } else {
    // Lidar com outros métodos HTTP
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
