'use client';

import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { Collection } from '@/types';
import { useRouter } from 'next/navigation';

export default function NewArtworkPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les collections pour le menu déroulant
  useEffect(() => {
    pb.collection('collections').getFullList<Collection>().then(setCollections);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Par défaut status = available
    formData.append('status', 'available');

    try {
      await pb.collection('artworks').create(formData);
      router.push('/admin/artworks'); // Redirection vers la liste (à créer)
    } catch (error) {
      alert("Erreur lors de la création");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Nouvelle Œuvre</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
        
        {/* TITRE */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Titre</label>
          <input name="title" type="text" required className="w-full p-3 bg-stone-50 border" />
        </div>

        {/* IMAGE */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Photo principale</label>
          <input name="images" type="file" accept="image/*" required className="w-full p-3 bg-stone-50 border" />
        </div>

        {/* CATEGORIE & PRIX */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Catégorie</label>
            <select name="category" className="w-full p-3 bg-stone-50 border">
              <option value="Vase">Vase</option>
              <option value="Bol">Bol</option>
              <option value="Sculpture">Sculpture</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Prix (€)</label>
            <input name="price" type="number" required className="w-full p-3 bg-stone-50 border" />
          </div>
        </div>

        {/* DIMENSIONS */}
        <div className="grid grid-cols-3 gap-4">
            <input name="width" type="number" placeholder="Larg." className="p-3 bg-stone-50 border" />
            <input name="height" type="number" placeholder="Haut." className="p-3 bg-stone-50 border" />
            <input name="depth" type="number" placeholder="Prof." className="p-3 bg-stone-50 border" />
        </div>

        {/* COLLECTION */}
        <div>
           <label className="block text-xs uppercase tracking-widest mb-2">Collection</label>
           <select name="collection" className="w-full p-3 bg-stone-50 border">
             <option value="">Aucune</option>
             {collections.map(c => (
               <option key={c.id} value={c.id}>{c.title}</option>
             ))}
           </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Description</label>
          <textarea name="description" rows={4} className="w-full p-3 bg-stone-50 border"></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest">
          {loading ? 'Création...' : 'Ajouter cette œuvre'}
        </button>
      </form>
    </div>
  );
}