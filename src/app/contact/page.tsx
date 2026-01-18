import Image from 'next/image';
import { toast } from 'sonner';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 pb-24">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center mt-12">
        
        {/* Photo de l'artiste (Statique pour l'instant, ou tu peux mettre une de ses œuvres) */}
        <div className="w-full md:w-1/2 relative aspect-[3/4] bg-stone-200">
           {/* Remplace par une vraie photo de Michèle si tu as, ou une belle céramique */}
           <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-xs tracking-widest uppercase">
             Portrait de l'artiste
           </div>
        </div>

        {/* Texte */}
        <div className="w-full md:w-1/2 space-y-8">
          <h2 className="text-4xl font-serif text-stone-900">À propos de l'Atelier</h2>
          
          <div className="space-y-4 text-stone-600 font-light leading-relaxed">
            <p>
              Michèle Roberge ("Mia") travaille la terre depuis plus de 20 ans. 
              Spécialisée dans la technique du Raku, elle crée des pièces uniques 
              où le feu et la matière dialoguent de manière imprévisible.
            </p>
            <p>
              Chaque bol, chaque vase est le résultat d'une recherche constante 
              sur l'équilibre entre la forme brute et la délicatesse de l'émail.
            </p>
          </div>

          <div className="border-t border-stone-200 pt-8 mt-8 space-y-2">
            <h3 className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4">Contact</h3>
            <p className="text-stone-900">michele.roberge@email.com</p>
            <p className="text-stone-900">+33 6 00 00 00 00</p>
            <p className="text-stone-500 text-sm mt-4">
              Atelier ouvert sur rendez-vous.<br/>
              Nantes, France.
            </p>
          </div>
        </div>

      </div>
  
      <div className="max-w-6xl mx-auto mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div><ContactForm /></div>
        </div>
      </div>
    </main>
  );
}