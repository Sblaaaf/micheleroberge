import pb from '@/lib/pocketbase';
import { News } from '@/types';
import Image from 'next/image';

// On désactive le cache pour avoir les news fraîches à chaque déploiement
export const revalidate = 0; 

async function getNews() {
  try {
    // On trie par date de début (les plus récentes d'abord)
    return await pb.collection('news').getFullList<News>({ sort: '-date_start' });
  } catch (error) {
    return [];
  }
}

export default async function NewsPage() {
  const newsList = await getNews();

  return (
    <main className="min-h-screen bg-stone-50 px-6 pb-24 max-w-4xl mx-auto">
      <div className="space-y-24 mt-12">
        {newsList.length === 0 ? (
          <p className="text-center text-stone-400">Aucune actualité pour le moment.</p>
        ) : (
          newsList.map((item) => (
            <article key={item.id} className="flex flex-col md:flex-row gap-12 items-start border-b border-stone-200 pb-12 last:border-0">
              
              {/* DATE & LIEU (Colonne Gauche) */}
              <div className="md:w-1/3 pt-2">
                <div className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2">
                  {new Date(item.date_start).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </div>
                <h2 className="text-2xl font-serif text-stone-900 mb-4">{item.title}</h2>
                <div className="text-sm font-medium text-stone-600 italic mb-1">
                  📍 {item.location}
                </div>
                {item.date_end && (
                   <div className="text-xs text-stone-400">
                     Jusqu'au {new Date(item.date_end).toLocaleDateString('fr-FR')}
                   </div>
                )}
              </div>

              {/* CONTENU & IMAGE (Colonne Droite) */}
              <div className="md:w-2/3 w-full space-y-6">
                {item.image && (
                  <div className="relative w-full h-64 md:h-80 bg-stone-200 overflow-hidden">
                    <Image
                      src={`https://sblaaaf.pockethost.io/api/files/${item.collectionId}/${item.id}/${item.image}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div 
                  className="prose prose-stone text-stone-600 font-light leading-relaxed text-sm"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>

            </article>
          ))
        )}
      </div>
    </main>
  );
}