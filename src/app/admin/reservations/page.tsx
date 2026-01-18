'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { Reservation } from '@/types';
import { toast } from 'sonner';

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    pb.collection('reservations').getFullList<Reservation>({ sort: '-created', expand: 'artwork' })
      .then(setReservations)
      .catch(() => toast.error("Erreur chargement"));
  }, []);

  // On passe maintenant l'ID de l'artwork en plus
  async function updateStatus(id: string, newStatus: string, artworkId?: string) {
    try {
      // 1. Mettre à jour la réservation
      await pb.collection('reservations').update(id, { status: newStatus });
      
      // 2. Si on confirme, on passe l'œuvre en "reserved"
      if (newStatus === 'confirmed' && artworkId) {
         await pb.collection('artworks').update(artworkId, { status: 'reserved' });
         toast.success("Réservation confirmée & Œuvre mise de côté");
      } else {
         toast.success(`Statut mis à jour : ${newStatus}`);
      }

      // Mise à jour locale
      setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
    } catch { 
        toast.error("Erreur lors de la mise à jour"); 
    }
  }

  const filtered = reservations.filter(r => filter === 'all' || r.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Réservations</h1>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded text-sm">
              <option value="all">Tout voir</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="rejected">Refusé</option>
          </select>
      </div>

      <div className="space-y-4">
        {filtered.map((res) => (
          <div key={res.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                    {new Date(res.created).toLocaleDateString('fr-FR')}
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  {res.expand?.artwork?.title || 'Œuvre introuvable'}
                </h3>
                <div className="text-sm text-stone-600">
                    <span className="font-bold">{res.client_name}</span> • <a href={`mailto:${res.client_email}`} className="underline hover:text-stone-900">{res.client_email}</a>
                </div>
                {res.message && <div className="mt-3 p-3 bg-stone-50 rounded text-stone-600 italic text-sm border-l-2 border-stone-300">"{res.message}"</div>}
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[150px]">
                <span className={`px-3 py-1 rounded text-xs uppercase tracking-widest font-bold ${
                  res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  res.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-500 line-through'
                }`}>
                  {res.status === 'pending' ? 'En attente' : res.status === 'confirmed' ? 'Confirmé' : 'Refusé'}
                </span>
                
                {res.status === 'pending' && (
                  <div className="flex gap-2 text-xs">
                    {/* On passe l'ID de l'artwork ici */}
                    <button onClick={() => updateStatus(res.id, 'confirmed', res.artwork)} className="bg-stone-900 text-white px-3 py-2 rounded hover:bg-stone-700">Accepter</button>
                    <button onClick={() => updateStatus(res.id, 'rejected')} className="bg-white border border-stone-300 text-stone-500 px-3 py-2 rounded hover:text-red-500 hover:border-red-200">Refuser</button>
                  </div>
                )}
              </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-stone-400 text-center py-8">Aucune demande.</p>}
      </div>
    </div>
  );
}