'use client';

import { useState } from 'react';
import pb from '@/lib/pocketbase';
import { toast } from 'sonner'; // <--- AJOUT

export default function ReservationForm({ artworkId }: { artworkId: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const formData = new FormData(e.currentTarget);

    try {
      await pb.collection('reservations').create({
        artwork: artworkId,
        client_name: formData.get('name'),
        client_email: formData.get('email'),
        message: formData.get('message'),
        status: 'pending'
      });
      setStatus('success');
      toast.success("Demande envoyée avec succès !"); // <--- FEEDBACK
    } catch (error) {
      console.error(error);
      setStatus('idle');
      toast.error("Erreur lors de l'envoi. Veuillez réessayer."); // <--- FEEDBACK
    }
  }

  if (status === 'success') {
    return (
      <div className="p-6 bg-stone-100 border border-stone-200 text-center animate-fade-in">
        <div className="text-2xl mb-2">🌿</div>
        <h3 className="font-serif text-lg text-stone-900 mb-2">Demande envoyée</h3>
        <p className="text-stone-600 font-light text-sm">
          Merci de votre intérêt. Michèle a bien reçu votre demande et vous recontactera très vite par email.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-stone-200">
      <h3 className="font-serif text-xl text-stone-900 mb-6">Acquérir cette œuvre</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="sr-only">Votre nom</label>
          <input type="text" name="name" id="name" placeholder="Votre nom" required className="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:outline-none focus:border-stone-500 transition-colors" />
        </div>
        
        <div>
          <label htmlFor="email" className="sr-only">Votre email</label>
          <input type="email" name="email" id="email" placeholder="Votre email" required className="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:outline-none focus:border-stone-500 transition-colors" />
        </div>

        <div>
          <label htmlFor="message" className="sr-only">Message (Optionnel)</label>
          <textarea name="message" id="message" placeholder="Un message pour l'artiste ? (Optionnel)" rows={3} className="w-full bg-stone-50 border border-stone-200 p-3 text-sm focus:outline-none focus:border-stone-500 transition-colors resize-none"></textarea>
        </div>

        <button type="submit" disabled={status === 'submitting'} className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-xs hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-wait">
          {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer une demande de réservation'}
        </button>
      </form>
      
      <p className="text-[10px] text-stone-400 text-center mt-4 uppercase tracking-wider">
        Paiement et livraison à convenir directement avec l'artiste
      </p>
    </div>
  );
}