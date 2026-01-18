'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    artworks: 0,
    reservations: 0,
    messages: 0
  });

  useEffect(() => {
    // Compteurs Dashboard
    async function fetchStats() {
      try {
        const artworks = await pb.collection('artworks').getList(1, 1);
        const reservations = await pb.collection('reservations').getList(1, 1, { filter: 'status = "pending"' });
        const messages = await pb.collection('messages').getList(1, 1);
        
        setStats({
          artworks: artworks.totalItems,
          reservations: reservations.totalItems,
          messages: messages.totalItems
        });
      } catch (e) {
        console.error(e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-serif text-stone-900 mb-8">Bonjour Michèle,</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-100">
          <div className="text-stone-400 text-xs uppercase tracking-widest mb-2">Œuvres en ligne</div>
          <div className="text-5xl font-serif text-stone-900">{stats.artworks}</div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-100">
          <div className="text-stone-400 text-xs uppercase tracking-widest mb-2">Réservations en attente</div>
          <div className="text-5xl font-serif text-yellow-600">{stats.reservations}</div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-100">
          <div className="text-stone-400 text-xs uppercase tracking-widest mb-2">Messages reçus</div>
          <div className="text-5xl font-serif text-stone-900">{stats.messages}</div>
        </div>

      </div>

      <div className="mt-12 p-8 bg-stone-200 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Guide rapide</h2>
        <ul className="list-disc list-inside space-y-2 text-stone-700">
          <li>Pour ajouter une nouvelle pièce, allez dans <strong>Œuvres</strong>.</li>
          <li>Pour lire les demandes de clients, allez dans <strong>Réservations</strong>.</li>
          <li>N'oubliez pas de marquer les pièces comme "Vendues" une fois la transaction terminée.</li>
        </ul>
      </div>
    </div>
  );
}