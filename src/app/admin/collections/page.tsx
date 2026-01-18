'use client';
import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { Collection } from '@/types';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    pb.collection('collections').getFullList<Collection>().then(setCollections);
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
        const newCol = await pb.collection('collections').create<Collection>(formData);
        setCollections([...collections, newCol]);
        e.currentTarget.reset();
        toast.success("Collection ajoutée");
    } catch { toast.error("Erreur"); }
  }

  async function handleDelete(id: string) {
    if (confirm('Supprimer ?')) {
      await pb.collection('collections').delete(id);
      setCollections(collections.filter(c => c.id !== id));
      toast.success("Supprimé");
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-serif mb-8">Gérer les Collections</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-2">
            <Plus size={16} /> Nouvelle Collection
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input name="title" type="text" placeholder="Titre (ex: Été 2024)" required className="w-full p-3 bg-stone-50 border border-stone-200 rounded" />
          </div>
          <div className="flex-1">
             <input name="description" type="text" placeholder="Description courte (optionnel)" className="w-full p-3 bg-stone-50 border border-stone-200 rounded" />
          </div>
          <button type="submit" className="bg-stone-900 text-white px-6 py-3 uppercase tracking-widest text-xs rounded hover:bg-stone-700">
            Ajouter
          </button>
        </form>
      </div>

      <div className="border-t border-stone-200 my-8"></div>

      {/* COLLECTIONS */}
      <h2 className="text-xl font-serif mb-6">Collections existantes</h2>
      <div className="grid gap-3">
        {collections.map((col) => (
            <div key={col.id} className="bg-white p-4 rounded border border-stone-100 flex justify-between items-center group">
                <div>
                    <div className="font-bold text-stone-800">{col.title}</div>
                    {col.description && <div className="text-sm text-stone-500">{col.description}</div>}
                </div>
                <button onClick={() => handleDelete(col.id)} className="text-stone-300 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={18} />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
}