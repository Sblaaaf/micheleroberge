'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { News } from '@/types';

export default function AdminNews() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    pb.collection('news').getFullList<News>({ sort: '-date_start' }).then(setNews);
  }, []);

  async function handleDelete(id: string) {
    if (confirm('Supprimer cette actualité ?')) {
      await pb.collection('news').delete(id);
      setNews(news.filter(n => n.id !== id));
    }
  }

  // Petit formulaire simplifié de création pour aller vite (ou lien vers page "new")
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const newItem = await pb.collection('news').create(formData);
      setNews([newItem, ...news]); // Ajout en haut de liste (bug d'affichage possible si tri date, mais ok pour démo)
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert("Erreur création news");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Actualités & Expos</h1>
      
      {/* Formulaire Rapide */}
      <div className="bg-stone-200 p-6 rounded-lg mb-8">
        <h3 className="font-bold mb-4">Publier une News rapide</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Titre" required className="p-2" />
          <input name="location" placeholder="Lieu" required className="p-2" />
          <input name="date_start" type="date" required className="p-2" />
          <input name="date_end" type="date" className="p-2" />
          <textarea name="content" placeholder="Contenu (HTML accepté)" className="col-span-2 p-2 h-20"></textarea>
          {/* Pour l'image, on simplifie ici sans upload pour l'instant ou on ajoute un input file */}
          <button className="col-span-2 bg-stone-900 text-white py-2">Publier</button>
        </form>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-white p-4 flex justify-between items-center rounded border">
            <div>
              <div className="font-bold">{item.title}</div>
              <div className="text-xs text-stone-500">{item.location} - {new Date(item.date_start).toLocaleDateString()}</div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs uppercase">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}