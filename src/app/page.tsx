'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import pb from '@/lib/pocketbase';
import { Artwork } from '@/types';

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('artworks').getFullList<Artwork>({
      sort: '-created',
      expand: 'collection',
    }).then(setArtworks).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400 font-light tracking-widest uppercase text-xs">Chargement de la collection...</div>;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <div className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {artworks.map((art) => (
            <Link href={`/artwork/${art.id}`} key={art.id} className="group cursor-pointer block">
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-200 mb-6">
                 {art.images && art.images.length > 0 && (
                   <Image 
                     src={`https://sblaaaf.pockethost.io/api/files/${art.collectionId}/${art.id}/${art.images[0]}`}
                     alt={art.title}
                     fill
                     className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                   />
                 )}
                 {art.status !== 'available' && (
                   <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur-sm">
                     {art.status === 'sold' ? 'Vendu' : 'Réservé'}
                   </div>
                 )}
              </div>

              <div className="text-center space-y-2">
                <h2 className="font-serif text-2xl text-stone-900 group-hover:text-stone-600 transition-colors">
                  {art.title}
                </h2>
                {art.expand?.collection && (
                    <div className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        {art.expand.collection.title}
                    </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}