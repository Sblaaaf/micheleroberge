'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { Collection } from '@/types';

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    pb.collection('collections').getFullList<Collection>().then(setCollections);
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCol = await pb.collection('collections').create(formData);
    setCollections([...collections, newCol]);
    (e.target as HTMLFormElement).reset();
  }

  async function handleDelete(id: string) {
    if (confirm('Supprimer cette collection ?')) {
      await pb.collection('collections').delete(id);
      setCollections(collections.filter(c => c.id !== id));
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* LISTE */}
      <div>
        <h1 className="text-3xl font-serif mb-8">Collections</h1>
        <ul className="space-y-4">
          {collections.map((col) => (
            <li key={col.id} className="bg-white p-4 rounded shadow-sm border border-stone-100 flex justify-between items-center">
              <span className="font-medium text-stone-900">{col.title}</span>
              <button onClick={() => handleDelete(col.id)} className="text-xs text-red-400 hover:text-red-600 uppercase tracking-widest">
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* CREATION RAPIDE */}
      <div className="bg-stone-200 p-8 rounded-lg h-fit">
        <h2 className="text-xl font-serif mb-4">Ajouter une collection</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input name="title" type="text" placeholder="Nom (ex: Été 2024)" required className="w-full p-3 border border-stone-300" />
          <textarea name="description" placeholder="Description (optionnel)" className="w-full p-3 border border-stone-300"></textarea>
          <button type="submit" className="w-full bg-stone-900 text-white py-3 uppercase tracking-widest text-xs">Ajouter</button>
        </form>
      </div>
    </div>
  );
}