import { PasswordGeneratorOptions } from '@/types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Characters that look similar and might be confusing
const SIMILAR_CHARS = 'il1Lo0O';

export const generatePassword = (options: PasswordGeneratorOptions): string => {
  let charset = '';
  
  if (options.includeUppercase) {
    charset += UPPERCASE;
  }
  
  if (options.includeLowercase) {
    charset += LOWERCASE;
  }
  
  if (options.includeNumbers) {
    charset += NUMBERS;
  }
  
  if (options.includeSymbols) {
    charset += SYMBOLS;
  }
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }
  
  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  
  // Use crypto.getRandomValues for better randomness
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  return password;
};

export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Determine strength label and color
  if (score <= 2) {
    return { score, label: 'Weak', color: 'text-red-500' };
  } else if (score <= 4) {
    return { score, label: 'Fair', color: 'text-yellow-500' };
  } else if (score <= 6) {
    return { score, label: 'Good', color: 'text-blue-500' };
  } else {
    return { score, label: 'Strong', color: 'text-green-500' };
  }
};
