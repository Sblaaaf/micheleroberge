'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import pb from '@/lib/pocketbase';
import Link from 'next/link';
import { LayoutDashboard, Image as ImageIcon, Layers, Newspaper, Calendar, Mail, LogOut, ExternalLink, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setIsAuth(true);
    } else {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!isAuth) return null;

  return (
    <div className="min-h-screen flex bg-stone-100 font-sans text-stone-900 relative">
      
      {/* BOUTON BURGER MOBILE */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-stone-900 text-white p-2 rounded shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-stone-900 text-stone-50 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 text-2xl font-serif border-b border-stone-800 flex items-center gap-2">
           <span>Admin Mia</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link onClick={() => setSidebarOpen(false)} href="/admin" className="flex items-center gap-3 p-3 hover:bg-stone-800 rounded transition-colors text-stone-300 hover:text-white">
            <LayoutDashboard size={18} /> Tableau de bord
          </Link>
          
          <div className="pt-6 pb-2 text-xs text-stone-500 font-bold uppercase tracking-widest">Gestion</div>
          <Link onClick={() => setSidebarOpen(false)} href="/admin/artworks" className="flex items-center gap-3 p-3 hover:bg-stone-800 rounded transition-colors text-stone-300 hover:text-white">
            <ImageIcon size={18} /> Œuvres
          </Link>
          <Link onClick={() => setSidebarOpen(false)} href="/admin/collections" className="flex items-center gap-3 p-3 hover:bg-stone-800 rounded transition-colors text-stone-300 hover:text-white">
            <Layers size={18} /> Collections
          </Link>
          <Link onClick={() => setSidebarOpen(false)} href="/admin/news" className="flex items-center gap-3 p-3 hover:bg-stone-800 rounded transition-colors text-stone-300 hover:text-white">
            <Newspaper size={18} /> Actualités
          </Link>
          
          <div className="pt-6 pb-2 text-xs text-stone-500 font-bold uppercase tracking-widest">Messagerie</div>
          <Link onClick={() => setSidebarOpen(false)} href="/admin/reservations" className="flex items-center gap-3 p-3 hover:bg-stone-800 rounded transition-colors text-stone-300 hover:text-white">
            <Calendar size={18} /> Réservations
          </Link>
          <Link onClick={() => setSidebarOpen(false)} href="/admin/messages" className="flex items-center gap-3 p-3 hover:bg-stone-800 rounded transition-colors text-stone-300 hover:text-white">
            <Mail size={18} /> Messages
          </Link>
        </nav>

        <div className="p-4 border-t border-stone-800 space-y-2">
            <a href="/" target="_blank" className="flex items-center gap-3 p-3 hover:bg-stone-800 rounded transition-colors text-stone-400 hover:text-white text-sm font-medium">
                <ExternalLink size={18} /> Voir le site
            </a>
            <button 
                onClick={() => { pb.authStore.clear(); router.push('/admin/login'); }}
                className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded transition-colors text-sm font-medium text-left"
            >
                <LogOut size={18} /> Déconnexion
            </button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}