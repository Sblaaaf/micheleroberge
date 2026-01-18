'use client';

import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { Collection, Artwork } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export default function EditArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    if(!id) return;
    Promise.all([
      pb.collection('collections').getFullList<Collection>(),
      pb.collection('artworks').getOne<Artwork>(id)
    ]).then(([cols, art]) => {
      setCollections(cols);
      setArtwork(art);
      setLoading(false);
    }).catch(() => {
        toast.error("Erreur de chargement");
        router.push('/admin/artworks');
    });
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const imageFile = formData.get('images') as File;
    if (imageFile.size === 0) formData.delete('images');

    try {
      await pb.collection('artworks').update(id, formData);
      toast.success("Modifications enregistrées !");
      router.push('/admin/artworks');
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function deleteImage(filename: string) {
    if(!confirm("Supprimer cette image ?")) return;
    try {
        await pb.collection('artworks').update(id, {
            'images-': [filename]
        });
        // MAJ locale
        if(artwork) {
            setArtwork({ ...artwork, images: artwork.images.filter(img => img !== filename) });
        }
        toast.success("Image supprimée");
    } catch(e) {
        toast.error("Impossible de supprimer l'image");
    }
  }

  if (loading || !artwork) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Modifier : {artwork.title}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-stone-100">
        
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2 font-bold text-stone-500">Titre</label>
          <input defaultValue={artwork.title} name="title" type="text" required className="w-full p-3 bg-stone-50 border border-stone-200 rounded focus:border-stone-500 outline-none" />
        </div>

        {/* IMAGES */}
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2 font-bold text-stone-500">Galerie Photos</label>
          
          <div className="flex flex-wrap gap-4 mb-4">
             {artwork.images?.map((img) => (
               <div key={img} className="relative w-24 h-24 bg-stone-100 rounded border border-stone-200 group">
                  <Image 
                    src={`https://sblaaaf.pockethost.io/api/files/${artwork.collectionId}/${artwork.id}/${img}`}
                    alt="Artwork" fill className="object-cover rounded"
                  />
                  <button 
                    type="button"
                    onClick={() => deleteImage(img)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer cette photo"
                  >
                    <X size={12} />
                  </button>
               </div>
             ))}
          </div>

          <div className="bg-stone-50 p-4 rounded border border-dashed border-stone-300">
            <span className="text-sm text-stone-500 block mb-2">Ajouter des photos (s'ajouteront à la suite) :</span>
            <input name="images" type="file" accept="image/*" multiple className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-700 cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold text-stone-500">Catégorie</label>
            <input defaultValue={artwork.category || 'Sculpture'} name="category" type="text" className="w-full p-3 bg-stone-50 border border-stone-200 rounded" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold text-stone-500">Prix (€)</label>
            <input defaultValue={artwork.price} name="price" type="number" required className="w-full p-3 bg-stone-50 border border-stone-200 rounded" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2 font-bold text-stone-500">Statut</label>
            <select defaultValue={artwork.status} name="status" className="w-full p-3 bg-stone-50 border border-stone-200 rounded font-medium">
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
              <option value="sold">Vendu</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
            <div><label className="text-[10px] uppercase text-stone-400">Larg.</label><input defaultValue={artwork.width} name="width" type="number" className="w-full p-2 bg-stone-50 border rounded" /></div>
            <div><label className="text-[10px] uppercase text-stone-400">Haut.</label><input defaultValue={artwork.height} name="height" type="number" className="w-full p-2 bg-stone-50 border rounded" /></div>
            <div><label className="text-[10px] uppercase text-stone-400">Prof.</label><input defaultValue={artwork.depth} name="depth" type="number" className="w-full p-2 bg-stone-50 border rounded" /></div>
        </div>

        <div>
           <label className="block text-xs uppercase tracking-widest mb-2 font-bold text-stone-500">Collection</label>
           <select defaultValue={artwork.collection} name="collection" className="w-full p-3 bg-stone-50 border border-stone-200 rounded">
             <option value="">Aucune</option>
             {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
           </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest mb-2 font-bold text-stone-500">Description</label>
          <textarea defaultValue={artwork.description} name="description" rows={5} className="w-full p-3 bg-stone-50 border border-stone-200 rounded"></textarea>
        </div>

        <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.back()} className="px-8 py-4 bg-stone-100 text-stone-600 uppercase tracking-widest text-xs rounded hover:bg-stone-200 transition-colors">
                Annuler
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-stone-900 text-white py-4 uppercase tracking-widest text-xs rounded hover:bg-stone-800 transition-colors">
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
        </div>
      </form>
    </div>
  );
}