# SecureVault - Password Generator & Secure Vault

A modern, privacy-first password manager built with Next.js, TypeScript, and MongoDB. Features client-side encryption to ensure your passwords are never stored in plaintext on the server.

## 🌐 Live Demo & Repository

- **🚀 Live Demo**: [https://securevaultgrp.netlify.app/](https://securevaultgrp.netlify.app/)
- **📂 GitHub Repository**: [https://github.com/grpansare/madquick_assignment_password_vault](https://github.com/grpansare/madquick_assignment_password_vault)

## 🚀 Features

### Must-Have Features ✅
- **Password Generator**: Customizable strong password generation with length slider and character type options
- **Simple Authentication**: Email/password registration and login system
- **Secure Vault**: Store passwords, usernames, URLs, and notes
- **Client-Side Encryption**: All sensitive data is encrypted before being sent to the server
- **Copy to Clipboard**: One-click password copying with auto-clear after 15 seconds
- **Search & Filter**: Real-time search across all vault items

### Nice-to-Have Features ✅
- **Dark Mode**: Toggle between light and dark themes
- **Tags System**: Organize vault items with custom tags
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Password Strength Indicator**: Visual feedback on password strength

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT with bcryptjs password hashing
- **Encryption**: Custom XOR encryption with fallback support
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## 🔐 Security & Encryption

### Client-Side Encryption Approach

This application uses **custom encryption** with the following security measures:

1. **Key Derivation**: User passwords are derived using a simple hash-based approach
2. **Encryption**: Vault passwords are encrypted client-side using XOR encryption with base64 encoding
3. **Fallback Support**: Multiple encryption methods for production compatibility
4. **Server Storage**: Only encrypted data is stored on the server - plaintext passwords never leave your browser

### Why This Approach?

- **Zero-Knowledge Architecture**: The server never sees your actual passwords
- **Client-Side Processing**: All encryption/decryption happens in your browser
- **Production Compatible**: Works reliably in serverless environments like Vercel
- **Fallback Security**: Multiple encryption layers for maximum compatibility

**Note**: This is a demo implementation. For production use, consider implementing industry-standard encryption like AES-256 with proper key management.

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/grpansare/madquick_assignment_password_vault.git
cd madquick_assignment_password_vault
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/password-vault?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000
```

### 4. Set up MongoDB Atlas

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Add a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 🎯 Usage Guide

### Getting Started

1. **Sign Up**: Create an account with your email and a strong master password
2. **Generate Passwords**: Use the password generator to create strong, unique passwords
3. **Save to Vault**: Store your passwords with titles, usernames, URLs, and notes
4. **Search & Organize**: Use the search function and tags to organize your passwords
5. **Copy & Use**: One-click copying with automatic clipboard clearing

### Password Generator Options

- **Length**: 4-64 characters
- **Character Types**: Uppercase, lowercase, numbers, symbols
- **Exclude Similar**: Option to exclude confusing characters (il1Lo0O)
- **Strength Indicator**: Real-time password strength assessment

### Vault Management

- **Add Items**: Store passwords with metadata (title, username, URL, notes, tags)
- **Edit/Delete**: Full CRUD operations on vault items
- **Search**: Real-time search across all fields
- **Copy Protection**: Passwords are masked by default, reveal when needed
- **Auto-Clear**: Clipboard automatically clears after 15 seconds

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy automatically

### Other platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── vault/         # Vault CRUD endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AuthForm.tsx       # Login/register form
│   ├── AuthProvider.tsx   # Authentication context
│   ├── Dashboard.tsx      # Main dashboard
│   ├── LoadingSpinner.tsx # Loading component
│   ├── PasswordGenerator.tsx # Password generator
│   ├── VaultItemForm.tsx  # Add/edit vault items
│   └── VaultManager.tsx   # Vault management
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication helpers
│   ├── encryption.ts     # Original crypto-js implementation
│   ├── simple-crypto.ts  # Production-compatible encryption
│   ├── mongodb.ts        # Database connection
│   └── password-generator.ts # Password generation logic
└── types/                 # TypeScript type definitions
    └── index.ts
```

## 🔧 Configuration

### MongoDB Collections

The app creates two collections:
- `users`: User accounts (email, hashed password)
- `vault_items`: Encrypted vault items (title, username, encrypted password, etc.)

### Environment Variables

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: JWT secret key (32+ characters)
- `NEXTAUTH_URL`: Application URL

## 🧪 Testing

```bash
# Run development server for testing
npm run dev

# Build and test production version
npm run build
npm start
```

### Test Scenarios

1. **Registration/Login Flow**
2. **Password Generation** with different options
3. **Vault CRUD Operations** (Create, Read, Update, Delete)
4. **Search Functionality**
5. **Copy to Clipboard** with auto-clear
6. **Dark Mode Toggle**
7. **Responsive Design** on different screen sizes

## 🆘 Troubleshooting

### Common Issues

1. **Crypto errors in production**: The app uses a fallback encryption system for compatibility
2. **MongoDB connection issues**: Ensure your connection string is correct and IP is whitelisted
3. **Environment variables**: Make sure all required env vars are set in both local and production

### Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your MongoDB Atlas connection
3. Ensure all environment variables are set correctly
4. Check that all dependencies are installed (`npm install`)

## 🔮 Future Enhancements

- **Enhanced Encryption**: Implement AES-256 with proper key management
- **2FA Support**: Time-based one-time passwords (TOTP)
- **Export/Import**: Encrypted backup and restore functionality
- **Password Sharing**: Secure sharing of passwords with other users
- **Browser Extension**: Native browser integration
- **Mobile App**: React Native mobile application

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for secure password management**

**Assignment completed for MadQuick - Password Vault MVP**