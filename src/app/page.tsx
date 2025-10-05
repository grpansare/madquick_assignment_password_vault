'use client';

import { useAuth } from '@/components/AuthProvider';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {user ? <Dashboard /> : <AuthForm />}
    </main>
  );
}
