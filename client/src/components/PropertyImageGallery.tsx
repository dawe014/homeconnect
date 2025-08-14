import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { PhotoIcon } from "@heroicons/react/24/solid";

interface GalleryProps {
  images: string[];
  title: string;
}

export default function HeroImageGrid({ images, title }: GalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const imageUrls = images;

  const slides = imageUrls.map((url) => ({ src: url }));

  const openLightbox = (imageIndex: number) => {
    setLightboxIndex(imageIndex);
    setIsLightboxOpen(true);
  };

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-200 h-96 rounded-lg shadow-inner">
        <PhotoIcon className="h-24 w-24 text-gray-400" />
        <p className="mt-2 text-gray-500">No Images Available</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 h-[32rem]">
          <div
            className="col-span-2 row-span-2 cursor-pointer group"
            onClick={() => openLightbox(0)}
          >
            <img
              src={imageUrls[0]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {imageUrls.slice(1, 4).map((img, i) => (
            <div
              key={i}
              className={`cursor-pointer group ${i === 2 ? "relative" : ""}`}
              onClick={() => openLightbox(i + 1)}
            >
              <img
                src={img}
                alt={`${title} ${i + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {i === 2 && imageUrls.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg hover:bg-black/70 transition-all">
                  +{imageUrls.length - 4} more
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="sm:hidden relative h-96 cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={imageUrls[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(0);
              }}
              className="bg-white/80 backdrop-blur-sm text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white transition-all"
            >
              View all {imageUrls.length} photos
            </button>
          </div>
        </div>
      </div>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
        on={{
          view: ({ index: currentIndex }) => setLightboxIndex(currentIndex),
        }}
        plugins={[Thumbnails, Zoom]}
      />
    </>
  );
}
