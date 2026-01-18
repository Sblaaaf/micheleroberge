'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  recordId: string;
  collectionId: string;
  title: string;
}

export default function ImageGallery({ images, recordId, collectionId, title }: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) return <div className="bg-stone-200 h-full w-full" />;

  return (
    <div className="space-y-4">
      {/* Image Principale */}
      <div className="relative w-full aspect-[4/5] bg-stone-100 overflow-hidden">
        <Image 
          src={`https://sblaaaf.pockethost.io/api/files/${collectionId}/${recordId}/${mainImage}`}
          alt={title}
          fill
          className="object-cover transition-all duration-500"
          priority
        />
      </div>

      {/* Miniatures (s'il y en a plusieurs) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img) => (
            <button 
              key={img} 
              onClick={() => setMainImage(img)}
              className={`relative w-20 h-20 flex-shrink-0 border-2 transition-all ${mainImage === img ? 'border-stone-900 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
              <Image 
                src={`https://sblaaaf.pockethost.io/api/files/${collectionId}/${recordId}/${img}`}
                alt="Miniature" fill className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}