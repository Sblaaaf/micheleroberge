'use client';

import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';

// On définit une interface locale simple si elle n'est pas dans @types
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  created: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    pb.collection('messages').getFullList<Message>({ sort: '-created' }).then(setMessages);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-serif mb-8">Messages Reçus</h1>
      <div className="grid gap-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                {new Date(msg.created).toLocaleDateString('fr-FR')}
              </span>
              <a href={`mailto:${msg.email}`} className="text-xs text-stone-900 underline">Répondre</a>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">{msg.subject}</h3>
            <p className="text-sm text-stone-500 mb-4">De : {msg.name} &lt;{msg.email}&gt;</p>
            <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded">
              {msg.content}
            </p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-stone-400">Aucun message.</p>}
      </div>
    </div>
  );
}