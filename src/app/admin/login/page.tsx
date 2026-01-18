'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Authentification via la collection 'users'
      await pb.collection('users').authWithPassword(email, password);
      // Si succès, redirection vers le dashboard
      router.push('/admin');
    } catch (err) {
      console.error(err);
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-serif text-stone-900 mb-8 text-center">Espace Artiste</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Email</label>
            <input name="email" type="email" required className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900" />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Mot de passe</label>
            <input name="password" type="password" required className="w-full p-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900" />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}