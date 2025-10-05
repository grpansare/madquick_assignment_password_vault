export interface User {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VaultItem {
  _id: string;
  userId: string;
  title: string;
  username: string;
  password: string; // This will be encrypted
  url?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export interface EncryptedData {
  data: string;
  iv: string;
}

export interface AuthUser {
  id: string;
  email: string;
}
