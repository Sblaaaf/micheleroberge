import pb from '@/lib/pocketbase';
import { Artwork } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReservationForm from '@/components/ReservationForm';
import ImageGallery from '@/components/ImageGallery';

export async function generateStaticParams() {
  const records = await pb.collection('artworks').getFullList({ fields: 'id' });
  return records.map((record) => ({ id: record.id }));
}

async function getArtwork(id: string) {
  try {
    return await pb.collection('artworks').getOne<Artwork>(id, { expand: 'collection' });
  } catch (error) { return null; }
}

interface PageProps { params: Promise<{ id: string }> }

export default async function ArtworkPage({ params }: PageProps) {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) return notFound();

  const isAvailable = artwork.status === 'available';

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <nav className="fixed top-6 left-6 z-50">
        <Link href="/" className="text-xs uppercase tracking-widest border-b border-transparent hover:border-stone-800 transition-all pb-1">
          ← Galerie
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* IMAGES */}
        <div className="bg-stone-100 lg:h-screen p-4 lg:p-12 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-lg">
              <ImageGallery 
                images={artwork.images} 
                recordId={artwork.id} 
                collectionId={artwork.collectionId} 
                title={artwork.title} 
              />
          </div>
        </div>

        {/* INFOS */}
        <div className="flex flex-col justify-center p-8 lg:p-24 bg-stone-50 overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            
            {/* Collection / Catégorie */}
            <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase mb-4">
              {artwork.expand?.collection ? (
                <>
                   <span className="text-stone-500">{artwork.expand.collection.title}</span>
                   <span className="text-stone-300">|</span>
                </>
              ) : null}
              <span>{artwork.category}</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-serif mb-8 text-stone-900 leading-tight">
              {artwork.title}
            </h1>

            {/* Description */}
            <div className="text-stone-600 font-light leading-relaxed text-sm lg:text-base space-y-4 mb-8" dangerouslySetInnerHTML={{ __html: artwork.description }} />

            {/* Dimensions */}
            <div className="flex gap-6 text-[10px] uppercase tracking-widest text-stone-400 border-t border-stone-100 pt-6">
               {artwork.height && <div>H: {artwork.height} cm</div>}
               {artwork.width && <div>L: {artwork.width} cm</div>}
               {artwork.depth && <div>P: {artwork.depth} cm</div>}
            </div>

            {/* Prix & Statut */}
            <div className="mt-12 flex items-center justify-between">
              {isAvailable ? (
                <div className="text-xl font-serif text-stone-900">{artwork.price} €</div>
              ) : (
                <div className="px-3 py-1 bg-stone-100 text-stone-500 text-xs uppercase tracking-widest">
                  {artwork.status === 'sold' ? 'Vendu' : 'Réservé'}
                </div>
              )}
            </div>
            
            {/* FORM si "available" */}
            {isAvailable && <ReservationForm artworkId={artwork.id} />}

          </div>
        </div>
      </div>
    </main>
  );
}