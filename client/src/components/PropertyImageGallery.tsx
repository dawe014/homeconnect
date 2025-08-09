import { useState } from "react";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

interface GalleryProps {
  images: string[];
  title: string;
}

export default function PropertyImageGallery({ images, title }: GalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  const imageUrls = images.map((img) =>
    img.startsWith("http") ? img : `${SERVER_URL}${img}`
  );
  const mainImageUrl = mainImage?.startsWith("http")
    ? mainImage
    : `${SERVER_URL}${mainImage}`;

  if (!images || images.length === 0) {
    return (
      <img
        src="https://via.placeholder.com/800x600.png?text=No+Image+Available"
        alt="Placeholder"
        className="w-full rounded-lg shadow-lg"
      />
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="mb-4">
        <img
          src={mainImageUrl}
          alt={title}
          className="w-full h-[30rem] object-cover rounded-lg shadow-lg transition-all"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-3">
        {imageUrls.map((img, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setMainImage(images[index])}
          >
            <img
              src={img}
              alt={`${title} thumbnail ${index + 1}`}
              className={`w-full h-24 object-cover rounded-md transition-all duration-300 ${
                images[index] === mainImage
                  ? "ring-4 ring-indigo-500"
                  : "ring-2 ring-transparent hover:ring-indigo-300"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
