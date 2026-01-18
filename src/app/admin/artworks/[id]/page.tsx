'use client';

import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { Collection, Artwork } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function EditArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  // 1. On charge l'œuvre ET les collections au démarrage
  useEffect(() => {
    if (!id) return;
    async function loadData() {
      try {
        const [cols, art] = await Promise.all([
          pb.collection('collections').getFullList<Collection>(),
          pb.collection('artworks').getOne<Artwork>(id)
        ]);
        setCollections(cols);
        setArtwork(art);
      } catch (error) {
        alert("Impossible de charger l'œuvre");
        router.push('/admin/artworks');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    // Si l'utilisateur n'a pas mis de nouvelle image, PocketBase garde l'ancienne
    // Mais le champ file vide peut poser souci, donc on le gère :
    const imageFile = formData.get('images') as File;
    if (imageFile.size === 0) {
      formData.delete('images');
    }

    try {
      await pb.collection('artworks').update(id, formData);
      router.push('/admin/artworks');
    } catch (error) {
      alert("Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !artwork) return <div className="p-8">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Modifier : {artwork.title}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
        
        {/* TITRE */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Titre</label>
          <input defaultValue={artwork.title} name="title" type="text" required className="w-full p-3 bg-stone-50 border" />
        </div>

        {/* IMAGE ACTUELLE + UPLOAD */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Photo</label>
          <div className="flex items-center gap-4 mb-2">
             {artwork.images && artwork.images.length > 0 && (
               <div className="relative w-16 h-16 bg-stone-200">
                  <Image 
                    src={`https://sblaaaf.pockethost.io/api/files/${artwork.collectionId}/${artwork.id}/${artwork.images[0]}`}
                    alt="Actuelle" fill className="object-cover"
                  />
               </div>
             )}
             <div className="text-xs text-stone-500 italic">Laissez vide pour garder l'image actuelle</div>
          </div>
          <input name="images" type="file" accept="image/*" className="w-full p-3 bg-stone-50 border" />
        </div>

        {/* CATEGORIE & PRIX & STATUT */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Catégorie</label>
            <input 
              defaultValue={artwork.category || 'Sculpture'} 
              name="category" 
              type="text" 
              className="w-full p-3 bg-stone-50 border" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Prix (€)</label>
            <input defaultValue={artwork.price} name="price" type="number" required className="w-full p-3 bg-stone-50 border" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Statut</label>
            <select defaultValue={artwork.status} name="status" className="w-full p-3 bg-stone-50 border font-bold text-stone-700">
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
              <option value="sold">Vendu</option>
            </select>
          </div>
        </div>

        {/* DIMENSIONS */}
        <div className="grid grid-cols-3 gap-4">
            <input defaultValue={artwork.width} name="width" type="number" placeholder="Larg." className="p-3 bg-stone-50 border" />
            <input defaultValue={artwork.height} name="height" type="number" placeholder="Haut." className="p-3 bg-stone-50 border" />
            <input defaultValue={artwork.depth} name="depth" type="number" placeholder="Prof." className="p-3 bg-stone-50 border" />
        </div>

        {/* COLLECTION */}
        <div>
           <label className="block text-xs uppercase tracking-widest mb-2">Collection</label>
           <select defaultValue={artwork.collection} name="collection" className="w-full p-3 bg-stone-50 border">
             <option value="">Aucune</option>
             {collections.map(c => (
               <option key={c.id} value={c.id}>{c.title}</option>
             ))}
           </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2">Description</label>
          <textarea defaultValue={artwork.description} name="description" rows={4} className="w-full p-3 bg-stone-50 border"></textarea>
        </div>

        <div className="flex gap-4">
            <button type="button" onClick={() => router.back()} className="w-1/3 bg-stone-200 text-stone-600 py-4 uppercase tracking-widest hover:bg-stone-300">
                Annuler
            </button>
            <button type="submit" disabled={saving} className="w-2/3 bg-stone-900 text-white py-4 uppercase tracking-widest hover:bg-stone-700">
                {saving ? 'Enregistrement...' : 'Mettre à jour'}
            </button>
        </div>
      </form>
    </div>
  );
}