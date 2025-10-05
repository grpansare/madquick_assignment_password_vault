'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import PasswordGenerator from './PasswordGenerator';
import VaultManager from './VaultManager';
import { LogOut, Key, Shield, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

type TabType = 'generator' | 'vault';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('generator');
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  React.useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  React.useEffect(() => {
    // Save dark mode preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
  <div className="flex items-center space-x-2 sm:space-x-3">
    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 rounded-lg flex items-center justify-center">
      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
    </div>
    <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
      SecureVault
    </h1>
  </div>

  <div className="flex items-center space-x-2 sm:space-x-4">
  <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px] lg:max-w-none">
    {user?.email}
  </span>
  
  <button
    onClick={toggleDarkMode}
    className="btn-icon text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {darkMode ? (
      <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
    ) : (
      <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
    )}
  </button>

  <button
    onClick={handleLogout}
    className="btn-icon sm:flex sm:items-center sm:space-x-2 sm:px-3 sm:py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    title="Logout"
  >
    <LogOut className="h-4 w-4" />
    <span className="hidden sm:inline text-sm">Logout</span>
  </button>
</div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex space-x-0 sm:space-x-8">
      {/* Mobile-friendly tab buttons */}
            <button
              onClick={() => setActiveTab('generator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'generator'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Password Generator</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'vault'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>My Vault</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generator' && (
          <div className="max-w-2xl mx-auto">
            <PasswordGenerator />
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="max-w-6xl mx-auto">
            <VaultManager />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
