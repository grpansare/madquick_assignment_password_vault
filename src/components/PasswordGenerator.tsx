'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { generatePassword, getPasswordStrength } from '@/lib/password-generator';
import { PasswordGeneratorOptions } from '@/types';
import { RefreshCw, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onPasswordGenerated,
}) => {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
  });

  const handleGenerate = useCallback(() => {
    try {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      if (onPasswordGenerated) {
        onPasswordGenerated(newPassword);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate password');
    }
  }, [options, onPasswordGenerated]);

  const handleCopy = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success('Password copied to clipboard');
      
      // Auto-clear clipboard after 15 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('');
      }, 15000);

      // Reset copied state
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  const updateOption = (key: keyof PasswordGeneratorOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const strength = password ? getPasswordStrength(password) : null;


  useEffect(() => {
    handleGenerate();
  }, [handleGenerate, options]);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Password Generator
      </h2>

    
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={password}
            readOnly
            className="input-field pr-20 font-mono text-sm"
            placeholder="Generated password will appear here"
          />
          <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
            <button
              onClick={handleGenerate}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Generate new password"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleCopy}
              disabled={!password}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {strength && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength.score <= 2
                    ? 'bg-red-500'
                    : strength.score <= 4
                    ? 'bg-yellow-500'
                    : strength.score <= 6
                    ? 'bg-blue-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${(strength.score / 7) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${strength.color}`}>
              {strength.label}
            </span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Length: {options.length}
          </label>
          <input
            type="range"
            min="4"
            max="64"
            value={options.length}
            onChange={(e) => updateOption('length', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Character Type Options */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => updateOption('includeUppercase', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Uppercase (A-Z)
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => updateOption('includeLowercase', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Lowercase (a-z)
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => updateOption('includeNumbers', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Numbers (0-9)
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => updateOption('includeSymbols', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Symbols (!@#$...)
            </span>
          </label>
        </div>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.excludeSimilar}
            onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Exclude similar characters (il1Lo0O)
          </span>
        </label>
      </div>
    </div>
  );
};

export default PasswordGenerator;
