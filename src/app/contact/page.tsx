import Image from 'next/image';
import { toast } from 'sonner';
import ContactModal from '@/components/ContactModal';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 pb-24">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center mt-12">
        
        <div className="w-full md:w-1/2 relative aspect-[3/4] bg-stone-200">
           <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-xs tracking-widest uppercase">
             Photo
           </div>
        </div>

        <div className="w-full md:w-1/2 space-y-8">
          <h2 className="text-4xl font-serif text-stone-900">À propos de l'Atelier</h2>
          
          <div className="space-y-4 text-stone-600 font-light leading-relaxed">
            <p>
              Michèle Roberge ("Mia") travaille la terre depuis plus de 20 ans. 
              Spécialisée dans la technique du Raku, elle crée des petites créatures
              fantaisistes qui captivent par leur originalité.
            </p>
            <p>
              Chaque bol, chaque sculpture est le résultat d'une recherche constante 
              sur l'équilibre entre la forme brute et la délicatesse de l'émail.
            </p>
          </div>

          <div className="border-t border-stone-200 pt-8 mt-8 space-y-2">
            <h3 className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4">Contact</h3>
            <p className="text-stone-900">michele.roberge@gmail.com</p>
            <p className="text-stone-900">+33 6 52 18 14 37</p>
            <ContactModal />
            <p className="text-stone-500 text-sm mt-4">
              Atelier ouvert sur rendez-vous.<br/>
              Machecoul, France.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}