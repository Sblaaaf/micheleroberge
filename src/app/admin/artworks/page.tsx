'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import pb from '@/lib/pocketbase';
import { Artwork } from '@/types';

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    pb.collection('artworks').getFullList<Artwork>({ sort: '-created' }).then(setArtworks);
  }, []);

  async function handleDelete(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette œuvre ?')) {
      await pb.collection('artworks').delete(id);
      setArtworks(artworks.filter(a => a.id !== id));
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Mes Œuvres</h1>
        <Link 
          href="/admin/artworks/new" 
          className="bg-stone-900 text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-700"
        >
          + Nouvelle Œuvre
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="bg-stone-50 text-xs uppercase tracking-widest font-medium text-stone-500">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Titre</th>
              <th className="p-4">Prix</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {artworks.map((art) => (
              <tr key={art.id} className="hover:bg-stone-50 transition-colors">
                <td className="p-4">
                  <div className="relative w-12 h-12 bg-stone-200 rounded overflow-hidden">
                    {art.images && art.images.length > 0 && (
                      <Image 
                        src={`https://sblaaaf.pockethost.io/api/files/${art.collectionId}/${art.id}/${art.images[0]}`}
                        alt={art.title} fill className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium text-stone-900">{art.title}</td>
                <td className="p-4">{art.price} €</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wide ${
                    art.status === 'available' ? 'bg-green-100 text-green-700' :
                    art.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {art.status === 'available' ? 'Disponible' : art.status === 'sold' ? 'Vendu' : 'Réservé'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-4">
                  {/* Lien pour éditer (on créera la page edit plus tard si besoin, ou on réutilise new avec un ID) */}
                  <button onClick={() => handleDelete(art.id)} className="text-red-400 hover:text-red-600">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {artworks.length === 0 && <div className="p-8 text-center text-stone-400">Aucune œuvre trouvée.</div>}
      </div>
    </div>
  );
}