import CryptoJS from 'crypto-js';

// Chave de criptografia (em um cenário real, seria armazenada de forma mais segura)
const SECRET_KEY = 'wp-login-manager-secret-key';

// Criptografar dados sensíveis
export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Descriptografar dados
export const decrypt = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
