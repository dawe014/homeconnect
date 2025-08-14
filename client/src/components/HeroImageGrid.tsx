import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PhotoIcon } from "@heroicons/react/24/solid";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

interface GalleryProps {
  images: string[];
  title: string;
}

export default function HeroImageGrid({ images, title }: GalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const imageUrls = images.map((img) =>
    img.startsWith("http") ? img : `${SERVER_URL}${img}`
  );

  const slides = imageUrls.map((url) => ({ src: url }));

  const openLightbox = (imageIndex: number) => {
    setIndex(imageIndex);
    setOpen(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-200 h-96 rounded-lg">
        <PhotoIcon className="h-24 w-24 text-gray-400" />
        <p className="mt-2 text-gray-500">No Images Available</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[32rem] rounded-lg overflow-hidden shadow-lg">
        <div
          className="col-span-4 sm:col-span-2 row-span-2 cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <img
            src={imageUrls[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        {imageUrls.slice(1, 3).map((img, i) => (
          <div
            key={i}
            className=" sm:block cursor-pointer"
            onClick={() => openLightbox(i + 1)}
          >
            <img
              src={img}
              alt={`${title} ${i + 2}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
        <div
          className="hidden sm:block relative cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          {imageUrls[3] && (
            <img
              src={imageUrls[3]}
              alt={`${title} 4`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg hover:bg-black/60 transition-all">
            View All
          </div>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        on={{ view: ({ index: currentIndex }) => setIndex(currentIndex) }}
      />
    </>
  );
}
