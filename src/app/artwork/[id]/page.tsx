import pb from '@/lib/pocketbase';
import { Artwork } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// 1. Static Params : On génère la liste des IDs (ça, ça ne change pas)
export async function generateStaticParams() {
  const records = await pb.collection('artworks').getFullList({ fields: 'id' });
  return records.map((record) => ({ id: record.id }));
}

// 2. Fonction helper
async function getArtwork(id: string) {
  try {
    return await pb.collection('artworks').getOne<Artwork>(id);
  } catch (error) {
    return null;
  }
}

// 3. Typage pour Next.js 15+ : params est une Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtworkPage({ params }: PageProps) {
  // CORRECTION ICI : On attend que les params soient résolus
  const { id } = await params;
  
  const artwork = await getArtwork(id);

  if (!artwork) return notFound();

  const mainImage = artwork.images && artwork.images.length > 0 
    ? `https://sblaaaf.pockethost.io/api/files/${artwork.collectionId}/${artwork.id}/${artwork.images[0]}`
    : null;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <nav className="fixed top-6 left-6 z-50">
        <Link href="/" className="text-xs uppercase tracking-widest border-b border-transparent hover:border-stone-800 transition-all pb-1">
          ← Retour à la galerie
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* COLONNE GAUCHE */}
        <div className="relative h-[50vh] lg:h-screen bg-stone-200">
          {mainImage && (
            <Image 
              src={mainImage} 
              alt={artwork.title} 
              fill 
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* COLONNE DROITE */}
        <div className="flex flex-col justify-center p-8 lg:p-24 bg-stone-50">
          <div className="max-w-md mx-auto w-full">
            
            <span className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase">
              {artwork.category}
            </span>
            
            <h1 className="text-5xl lg:text-6xl font-serif mt-4 mb-8 text-stone-900 leading-tight">
              {artwork.title}
            </h1>

            <div className="text-stone-600 font-light leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: artwork.description }} />

            <div className="mt-12 border-t border-stone-200 pt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-stone-400">Dimensions</h3>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-serif">{artwork.width}</div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Largeur (cm)</div>
                </div>
                <div>
                  <div className="text-2xl font-serif">{artwork.height}</div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Hauteur (cm)</div>
                </div>
                <div>
                  <div className="text-2xl font-serif">{artwork.depth}</div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">Profondeur (cm)</div>
                </div>
              </div>
            </div>

            <div className="mt-16 flex items-center justify-between">
              <div className="text-3xl font-serif text-stone-800">{artwork.price} €</div>
              
              {artwork.status === 'available' ? (
                <button className="px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest hover:bg-stone-700 transition-colors">
                  Acquérir
                </button>
              ) : (
                <span className="px-4 py-2 bg-stone-100 text-stone-400 text-xs uppercase tracking-widest">
                  {artwork.status === 'sold' ? 'Vendu' : 'Réservé'}
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}