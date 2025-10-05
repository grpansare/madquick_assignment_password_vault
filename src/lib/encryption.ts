import CryptoJS from 'crypto-js';
import { EncryptedData } from '@/types';

// Generate a random encryption key for the user's session
export const generateUserKey = (): string => {
  return CryptoJS.lib.WordArray.random(256/8).toString();
};

// Encrypt data using AES encryption
export const encryptData = (data: string, key: string): EncryptedData => {
  const iv = CryptoJS.lib.WordArray.random(128/8);
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return {
    data: encrypted.toString(),
    iv: iv.toString()
  };
};

// Decrypt data using AES decryption
export const decryptData = (encryptedData: EncryptedData, key: string): string => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData.data, key, {
    iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return decrypted.toString(CryptoJS.enc.Utf8);
};

// Derive a key from user's master password using PBKDF2
export const deriveKeyFromPassword = (password: string, salt: string): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString();
};

// Generate a random salt
export const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(128/8).toString();
};
