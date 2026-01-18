'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import pb from '@/lib/pocketbase';
import { Artwork, Collection } from '@/types';
import { Eye, Edit, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCollection, setFilterCollection] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      pb.collection('artworks').getFullList<Artwork>({ sort: '-created' }),
      pb.collection('collections').getFullList<Collection>()
    ]).then(([arts, cols]) => {
      setArtworks(arts);
      setCollections(cols);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette œuvre ?')) {
      try {
        await pb.collection('artworks').delete(id);
        setArtworks(artworks.filter(a => a.id !== id));
        toast.success("Œuvre supprimée");
      } catch (e) {
        toast.error("Erreur lors de la suppression");
      }
    }
  }

  // Filtrage local
  const filteredArtworks = artworks.filter(art => {
    const matchStatus = filterStatus === 'all' || art.status === filterStatus;
    const matchCol = filterCollection === 'all' || art.collection === filterCollection;
    return matchStatus && matchCol;
  });

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif">Mes Œuvres ({filteredArtworks.length})</h1>
        <Link 
          href="/admin/artworks/new" 
          className="bg-stone-900 text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-700 flex items-center gap-2 rounded transition-colors"
        >
          <Plus size={16} /> Nouvelle Œuvre
        </Link>
      </div>

      {/* BARRE DE FILTRES */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold uppercase text-stone-400">Filtrer par :</span>
        </div>
        <select 
          className="p-2 border border-stone-200 rounded text-sm bg-stone-50"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="reserved">Réservé</option>
          <option value="sold">Vendu</option>
        </select>
        
        <select 
          className="p-2 border border-stone-200 rounded text-sm bg-stone-50"
          value={filterCollection}
          onChange={(e) => setFilterCollection(e.target.value)}
        >
          <option value="all">Toutes les collections</option>
          <option value="">Aucune collection</option>
          {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="bg-stone-50 text-xs uppercase tracking-widest font-medium text-stone-500">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Titre</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredArtworks.map((art) => (
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
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wide border ${
                    art.status === 'available' ? 'bg-green-50 text-green-700 border-green-100' :
                    art.status === 'sold' ? 'bg-stone-100 text-stone-500 border-stone-200 line-through' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                  }`}>
                    {art.status === 'available' ? 'Disponible' : art.status === 'sold' ? 'Vendu' : 'Réservé'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <a href={`/artwork/${art.id}`} target="_blank" className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded" title="Voir sur le site">
                        <Eye size={18} />
                    </a>
                    <Link href={`/admin/artworks/${art.id}`} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Modifier">
                        <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(art.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Supprimer">
                        <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredArtworks.length === 0 && <div className="p-12 text-center text-stone-400">Aucune œuvre trouvée.</div>}
      </div>
    </div>
  );
}