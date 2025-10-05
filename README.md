# SecureVault - Password Generator & Secure Vault

A modern, privacy-first password manager built with Next.js, TypeScript, and MongoDB. Features client-side encryption to ensure your passwords are never stored in plaintext on the server.

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
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **Encryption**: AES-256 encryption using crypto-js
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🔐 Security & Encryption

### Client-Side Encryption Approach

This application uses **AES-256 encryption** with the following security measures:

1. **Key Derivation**: User passwords are derived using PBKDF2 with 10,000 iterations
2. **Encryption**: Vault passwords are encrypted client-side using AES-256-CBC
3. **Initialization Vectors**: Each encrypted item uses a unique IV for maximum security
4. **Server Storage**: Only encrypted data is stored on the server - plaintext passwords never leave your browser

### Why This Approach?

- **Zero-Knowledge Architecture**: The server never sees your actual passwords
- **Client-Side Processing**: All encryption/decryption happens in your browser
- **Industry Standard**: Uses proven cryptographic algorithms (AES-256, PBKDF2)
- **Forward Secrecy**: Each password has its own encryption context

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd password-vault-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/password-vault

# NextAuth
NEXTAUTH_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=http://localhost:3000

# Encryption (optional - for additional server-side security)
ENCRYPTION_KEY=your-32-character-encryption-key
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud connection string in MONGODB_URI
```

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
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

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
│   ├── encryption.ts     # Client-side encryption
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

### Security Headers

Consider adding these security headers in production:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your MongoDB connection
3. Ensure all environment variables are set
4. Check that all dependencies are installed

## 🔮 Future Enhancements

- **2FA Support**: Time-based one-time passwords (TOTP)
- **Export/Import**: Encrypted backup and restore functionality
- **Password Sharing**: Secure sharing of passwords with other users
- **Browser Extension**: Native browser integration
- **Mobile App**: React Native mobile application
- **Biometric Authentication**: Fingerprint/Face ID support

---

**Built with ❤️ for secure password management**
