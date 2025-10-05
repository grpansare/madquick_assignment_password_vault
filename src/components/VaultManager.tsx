'use client';

import React, { useState, useEffect } from 'react';
import { VaultItem } from '@/types';
import { encryptData, decryptData, generateSalt, deriveKeyFromPassword } from '@/lib/encryption';
import { Plus, Search, Edit, Trash2, Copy, Eye, EyeOff, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import VaultItemForm from './VaultItemForm';
import { useAuth } from './AuthProvider';

const VaultManager: React.FC = () => {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();



useEffect(() => {
  if (user) {
   
    const userSalt = user.email + '_vault_salt_2024';
    const key = deriveKeyFromPassword(user.id + user.email, userSalt);
    setEncryptionKey(key);
    console.log('Generated encryption key for user:', user.email);
  }
}, [user]);

  // Fetch vault items
  const fetchItems = async () => {
    try {
      const response = await fetch('/api/vault');
      if (response.ok) {
        const data = await response.json();
        console.log('Raw vault data:', data.items);
        const decryptedItems = data.items.map((item: any) => {
          const decryptedPassword = decryptVaultPassword(item.password);
          console.log('Item:', item.title, 'Decrypted password:', decryptedPassword);
          return {
            ...item,
            password: decryptedPassword,
          };
        });
        setItems(decryptedItems);
        setFilteredItems(decryptedItems);
      } else {
        toast.error('Failed to fetch vault items');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Error fetching vault items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (encryptionKey) {
      fetchItems();
    }
  }, [encryptionKey]);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const encryptVaultPassword = (password: string): string => {
    if (!encryptionKey || !password) return password;
    try {
      const encrypted = encryptData(password, encryptionKey);
      return JSON.stringify(encrypted);
    } catch (error) {
      console.error('Encryption error, using fallback:', error);
      // Fallback: use base64 encoding for demo
      return btoa(password);
    }
  };

  const decryptVaultPassword = (encryptedPassword: string): string => {
    if (!encryptionKey || !encryptedPassword) return encryptedPassword;
    
    // If it doesn't look like JSON, try base64 decode
    if (!encryptedPassword.startsWith('{')) {
      try {
        return atob(encryptedPassword);
      } catch {
        return encryptedPassword;
      }
    }
    
    try {
      const encrypted = JSON.parse(encryptedPassword);
      if (encrypted.data && encrypted.iv) {
        try {
          return decryptData(encrypted, encryptionKey);
        } catch (error) {
          console.log('Decryption failed, trying fallback methods...');
          // Try base64 decode as fallback
          try {
            return atob(encrypted.data);
          } catch {
            return 'DECRYPTION_FAILED';
          }
        }
      }
      return encryptedPassword;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedPassword;
    }
  };

  const handleSaveItem = async (itemData: Partial<VaultItem>) => {
    try {
      // Encrypt the password before sending to server
      const encryptedPassword = encryptVaultPassword(itemData.password || '');
      
      const payload = {
        ...itemData,
        password: encryptedPassword,
      };

      const url = editingItem ? '/api/vault' : '/api/vault';
      const method = editingItem ? 'PUT' : 'POST';

      if (editingItem) {
        payload._id = editingItem._id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingItem ? 'Item updated successfully' : 'Item saved successfully');
        setShowForm(false);
        setEditingItem(null);
        fetchItems();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save item');
      }
    } catch (error) {
      toast.error('Error saving item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/vault?id=${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Item deleted successfully');
        fetchItems();
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      toast.error('Error deleting item');
    }
  };

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Password copied to clipboard');
      
      // Auto-clear clipboard after 15 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('');
      }, 15000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  const togglePasswordVisibility = (itemId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Vault ({filteredItems.length} items)
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search vault items..."
          className="input-field pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No items match your search.' : 'No vault items yet. Add your first password!'}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div key={item._id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {item.username}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                     onClick={() => {
                      console.log('Editing item:', item);
                      console.log('Item password:', item.password);
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type={showPasswords[item._id] ? 'text' : 'password'}
                      value={item.password || '••••••••'}
                      readOnly
                      className="input-field text-sm font-mono"
                      placeholder={item.password ? '' : 'No password stored'}
                    />
                  </div>
                  <button
                    onClick={() => togglePasswordVisibility(item._id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title={showPasswords[item._id] ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords[item._id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopyPassword(item.password)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Copy password"
                    disabled={!item.password}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* URL */}
              {item.url && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      URL
                    </span>
                    <a
                      href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1"
                    >
                      <span className="truncate">{item.url}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Notes
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                    {item.notes}
                  </p>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <VaultItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default VaultManager;