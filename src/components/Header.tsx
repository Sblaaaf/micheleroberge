'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  // On n'affiche pas le Header dans l'admin
  if (pathname.startsWith('/admin')) return null;
  
  // Petite fonction pour savoir si le lien est actif
  const isActive = (path: string) => pathname === path ? 'text-stone-900 border-b border-stone-900' : 'text-stone-400 hover:text-stone-600';

  return (
    <header className="py-12 px-8 flex flex-col items-center justify-center bg-stone-50">
      <Link href="/">
        <h1 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-wide text-center">
          Atelier Michèle Roberge
        </h1>
      </Link>
      
      <nav className="mt-8 flex gap-8 text-xs uppercase tracking-[0.2em] font-medium">
        <Link href="/" className={`pb-1 transition-all ${isActive('/')}`}>
          Galerie
        </Link>
        <Link href="/news" className={`pb-1 transition-all ${isActive('/news')}`}>
          Expositions
        </Link>
        <Link href="/contact" className={`pb-1 transition-all ${isActive('/contact')}`}>
          Contact
        </Link>
      </nav>
    </header>
  );
}