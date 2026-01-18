'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { News } from '@/types';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection('news').getFullList<News>({ sort: '-date_start' })
      .then(setNews)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400 text-xs uppercase tracking-widest">Chargement des actualités...</div>;

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-serif text-stone-900 mb-16 text-center"></h1>
        
        {news.length === 0 ? (
          <p className="text-center text-stone-500 font-light">Aucune actualité pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article key={item.id} className="group bg-white rounded-sm overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all duration-500">
                
                {/* IMAGE */}
                <div className="relative h-64 bg-stone-200 overflow-hidden">
                  {item.image ? (
                    <Image 
                      src={`https://sblaaaf.pockethost.io/api/files/${item.collectionId}/${item.id}/${item.image}`}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <span className="text-xs uppercase tracking-widest">Pas d'image</span>
                    </div>
                  )}
                  
                  {/* DATE */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 text-center shadow-sm">
                    <span className="block text-lg font-bold text-stone-900 leading-none">{new Date(item.date_start).getDate()}</span>
                    <span className="block text-[10px] uppercase tracking-widest text-stone-500">{new Date(item.date_start).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                  </div>
                </div>

                {/* CONTENU */}
                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-serif text-stone-900 mb-3 group-hover:text-stone-600 transition-colors">
                    {item.title}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-6">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>

                  <div className="text-stone-600 font-light text-sm leading-relaxed line-clamp-4">
                     {/* Contenu */}
                     <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}