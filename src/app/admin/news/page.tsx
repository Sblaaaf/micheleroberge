'use client';
import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { News } from '@/types';
import { toast } from 'sonner';
import { Trash2, Plus, Calendar } from 'lucide-react';

export default function AdminNews() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    pb.collection('news').getFullList<News>({ sort: '-date_start' }).then(setNews);
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const newItem = await pb.collection('news').create<News>(formData);
      setNews([newItem, ...news]);
      e.currentTarget.reset(); 
      toast.success("Actualité publiée !");
    } catch { toast.error("Erreur de publication"); }
  }

  async function handleDelete(id: string) {
    if(confirm('Supprimer ?')) {
        await pb.collection('news').delete(id);
        setNews(news.filter(n => n.id !== id));
        toast.success("Supprimé");
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-serif mb-8">Actualités & Expos</h1>

      {/* FORMULAIRE RAPIDE */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-2">
            <Plus size={16} /> Publier une news
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input name="title" placeholder="Titre de l'événement" required className="p-3 bg-stone-50 border rounded w-full" />
             <input name="location" placeholder="Lieu (ex: Paris)" required className="p-3 bg-stone-50 border rounded w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="text-xs uppercase text-stone-400">Début</label><input name="date_start" type="date" required className="p-3 bg-stone-50 border rounded w-full" /></div>
             <div><label className="text-xs uppercase text-stone-400">Fin (Optionnel)</label><input name="date_end" type="date" className="p-3 bg-stone-50 border rounded w-full" /></div>
          </div>
          <textarea name="content" placeholder="Description..." className="p-3 bg-stone-50 border rounded w-full h-24"></textarea>
          
          <div>
            <label className="text-xs uppercase text-stone-400 block mb-1">Image (Optionnel)</label>
            <input name="image" type="file" accept="image/*" className="text-sm text-stone-500" />
          </div>

          <button className="bg-stone-900 text-white px-6 py-3 uppercase tracking-widest text-xs rounded hover:bg-stone-700 w-full md:w-auto">
            Publier
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded border border-stone-100 flex justify-between items-start">
            <div className="flex gap-4">
                {/* Petit carré de date */}
                <div className="bg-stone-100 p-2 rounded text-center min-w-[60px]">
                    <span className="block text-lg font-bold text-stone-800">{new Date(item.date_start).getDate()}</span>
                    <span className="block text-[10px] uppercase text-stone-500">{new Date(item.date_start).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                </div>
                <div>
                    <div className="font-bold text-stone-900">{item.title}</div>
                    <div className="text-sm text-stone-500 flex items-center gap-1">
                        📍 {item.location}
                    </div>
                </div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-stone-300 hover:text-red-500 p-2">
                <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}