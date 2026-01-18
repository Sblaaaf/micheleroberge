'use client';
import { useState } from 'react';
import pb from '@/lib/pocketbase';
import { toast } from 'sonner';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await pb.collection('messages').create({
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        content: formData.get('content'),
      });
      toast.success("Message envoyé !");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Erreur d'envoi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8">
      <h3 className="font-serif text-2xl text-stone-900 mb-6">Envoyer un message</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Nom</label>
          <input required type="text" name="name" className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-stone-900" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Email</label>
          <input required type="email" name="email" className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-stone-900" />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Sujet</label>
        <select name="subject" className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-stone-900">
          <option value="Renseignement">Renseignement</option>
          <option value="Commande">Commande sur mesure</option>
          <option value="Presse">Presse / Collaboration</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Message</label>
        <textarea required name="content" rows={5} className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-stone-900 resize-none"></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white py-4 uppercase tracking-widest text-xs hover:bg-stone-700 transition-colors disabled:opacity-50">
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
}