'use client';
import { useState } from 'react';
import pb from '@/lib/pocketbase';
import { toast } from 'sonner';

export default function ReservationForm({ artworkId }: { artworkId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await pb.collection('reservations').create({
        artwork: artworkId,
        client_name: formData.get('name'),
        client_email: formData.get('email'),
        message: formData.get('message'),
        status: 'pending'
      });
      toast.success("Votre demande a bien été envoyée !");
      form.reset(); // On vide le formulaire
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-8 pt-8 border-t border-stone-200">
      <h3 className="font-serif text-xl text-stone-900 mb-6">Acquérir cette œuvre</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Votre nom" required className="w-full bg-stone-50 border border-stone-200 p-3 text-sm rounded outline-none focus:border-stone-500" />
        <input type="email" name="email" placeholder="Votre email" required className="w-full bg-stone-50 border border-stone-200 p-3 text-sm rounded outline-none focus:border-stone-500" />
        <textarea name="message" placeholder="Message (Optionnel)" rows={3} className="w-full bg-stone-50 border border-stone-200 p-3 text-sm rounded outline-none focus:border-stone-500 resize-none"></textarea>
        
        <button type="submit" disabled={isSubmitting} className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-xs rounded hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-50">
          {isSubmitting ? 'Envoi...' : 'Envoyer une demande'}
        </button>
      </form>
      <p className="text-[10px] text-stone-400 text-center mt-4 uppercase tracking-wider">Paiement et livraison à convenir avec l'artiste</p>
    </div>
  );
}