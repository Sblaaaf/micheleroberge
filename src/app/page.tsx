'use client'; // Indispensable pour les hooks

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { Artwork } from '@/types';
import Image from 'next/image';

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch artworks PocketBase
    const fetchArtworks = async () => {
      try {
        // rtworks par date de création
        const records = await pb.collection('artworks').getFullList<Artwork>({
          sort: '-created',
        });
        setArtworks(records);
      } catch (error) {
        console.error("Erreur lors du chargement", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) return <div className="p-10 text-center">Chargement de la galerie...</div>;

  return (
    <main className="min-h-screen p-8 bg-neutral-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-stone-800">Atelier Michèle Roberge</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white">
            <div className="relative h-64 w-full bg-gray-200">
               {/* URL de l'image PocketBase : /api/files/COLLECTION_ID/RECORD_ID/FILENAME */}
               {art.images && art.images.length > 0 && (
                 <Image 
                   src={`https://sblaaaf.pockethost.io/api/files/${art.collectionId}/${art.id}/${art.images[0]}`}
                   alt={art.title}
                   fill
                   className="object-cover"
                 />
               )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{art.title}</h2>
              <p className="text-stone-500 text-sm">{art.category}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-lg">{art.price} €</span>
                <span className={`px-2 py-1 text-xs rounded-full ${art.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {art.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}