'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import { Reservation } from '@/types';
import { toast } from 'sonner'; // <--- AJOUT

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    pb.collection('reservations').getFullList<Reservation>({ 
      sort: '-created', 
      expand: 'artwork' 
    }).then(setReservations)
      .catch(err => {
         console.error(err);
         toast.error("Impossible de charger les réservations (Vérifiez les droits API)");
      });
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    try {
      await pb.collection('reservations').update(id, { status: newStatus });
      setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
      toast.success(`Statut mis à jour : ${newStatus}`); // <--- SUCCESS
    } catch (error) {
      console.error(error);
      toast.error("Erreur : Droits insuffisants (Erreur 403)"); // <--- ERROR HANDLING
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Demandes de Réservation</h1>
      <div className="space-y-4">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {res.expand?.artwork?.title || 'Œuvre inconnue'}
                </h3>
                <p className="text-sm text-stone-500">Demandé par <strong>{res.client_name}</strong> ({res.client_email})</p>
                {res.message && <p className="mt-2 text-stone-600 italic">"{res.message}"</p>}
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className={`inline-block px-3 py-1 rounded text-xs uppercase tracking-widest ${
                  res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  res.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-500'
                }`}>
                  {res.status}
                </span>
                
                {res.status === 'pending' && (
                  <div className="flex gap-2 text-xs">
                    <button onClick={() => updateStatus(res.id, 'confirmed')} className="text-green-600 hover:underline font-bold">Accepter</button>
                    <button onClick={() => updateStatus(res.id, 'rejected')} className="text-red-400 hover:underline">Refuser</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {reservations.length === 0 && <p className="text-stone-400">Aucune réservation pour le moment.</p>}
      </div>
    </div>
  );
}