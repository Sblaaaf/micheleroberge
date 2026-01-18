'use client';
import { useState } from 'react';
import { X, Mail } from 'lucide-react';
import ContactForm from './ContactForm'; // On réutilise ton formulaire existant

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-4 inline-flex items-center gap-3 bg-stone-900 text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-stone-700 transition-colors"
      >
        <Mail size={16} /> Envoyer un message
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Contenu */}
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="p-2">
                <ContactForm /> 
            </div>
          </div>
        </div>
      )}
    </>
  );
}