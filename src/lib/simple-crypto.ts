// Simple encryption for demo purposes - works in all environments
export interface EncryptedData {
    data: string;
    iv: string;
  }
  
  // Simple XOR encryption for demo (not production-grade)
  function simpleEncrypt(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const textChar = text.charCodeAt(i);
      result += String.fromCharCode(textChar ^ keyChar);
    }
    return btoa(result); // Base64 encode
  }
  
  function simpleDecrypt(encryptedText: string, key: string): string {
    try {
      const decoded = atob(encryptedText); // Base64 decode
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const encryptedChar = decoded.charCodeAt(i);
        result += String.fromCharCode(encryptedChar ^ keyChar);
      }
      return result;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }
  
  export const generateSalt = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  export const deriveKeyFromPassword = (password: string, salt: string): string => {
    // Simple key derivation for demo
    let hash = 0;
    const combined = password + salt;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  };
  
  export const encryptData = (data: string, key: string): EncryptedData => {
    try {
      const encrypted = simpleEncrypt(data, key);
      return {
        data: encrypted,
        iv: 'simple_iv_' + Math.random().toString(36).substring(2, 8)
      };
    } catch (error) {
      console.error('Encryption error:', error);
      return {
        data: btoa(data), // Fallback to base64
        iv: 'fallback'
      };
    }
  };
  
  export const decryptData = (encryptedData: EncryptedData, key: string): string => {
    try {
      if (encryptedData.iv === 'fallback') {
        return atob(encryptedData.data);
      }
      return simpleDecrypt(encryptedData.data, key);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  };