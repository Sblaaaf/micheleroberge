'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import pb from '@/lib/pocketbase';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté et valide
    if (pb.authStore.isValid) {
      setIsAuth(true);
    } else {
      // Si on n'est pas sur la page login, on redirige
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  // Si on est sur la page de login, on affiche juste le contenu (le formulaire)
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Si pas connecté et pas sur login, on affiche rien en attendant la redirection
  if (!isAuth) {
    return null;
  }

  // Si connecté, on affiche la Sidebar Admin + le contenu
  return (
    <div className="min-h-screen flex bg-stone-100 font-sans text-stone-900">
      
      {/* SIDEBAR GAUCHE */}
      <aside className="w-64 bg-stone-900 text-stone-50 flex flex-col">
        <div className="p-6 text-2xl font-serif border-b border-stone-800">
          Admin Mia
        </div>
        
        <nav className="flex-1 p-4 space-y-2 text-sm uppercase tracking-widest">
          <Link href="/admin" className="block p-3 hover:bg-stone-800 rounded">Dashboard</Link>
          <div className="pt-4 pb-2 text-xs text-stone-500 font-bold">Gestion</div>
          <Link href="/admin/artworks" className="block p-3 hover:bg-stone-800 rounded">Œuvres</Link>
          <Link href="/admin/collections" className="block p-3 hover:bg-stone-800 rounded">Collections</Link>
          <Link href="/admin/news" className="block p-3 hover:bg-stone-800 rounded">Actualités</Link>
          
          <div className="pt-4 pb-2 text-xs text-stone-500 font-bold">Messagerie</div>
          <Link href="/admin/reservations" className="block p-3 hover:bg-stone-800 rounded">Réservations</Link>
          <Link href="/admin/messages" className="block p-3 hover:bg-stone-800 rounded">Messages</Link>
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={() => { pb.authStore.clear(); router.push('/admin/login'); }}
            className="w-full text-left p-2 text-red-400 hover:text-red-300 text-xs uppercase tracking-widest"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}