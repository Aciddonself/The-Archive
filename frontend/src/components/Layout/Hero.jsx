import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import hat from "../../assets/hat.jpg";
import afrwear1 from "../../assets/afrwear1.webp";
import afrwear2 from "../../assets/Afrwear2.webp";
import dress1 from "../../assets/dress1.jpg";
import man1 from "../../assets/man1.webp";
import men2 from "../../assets/men2.jpg";
import kenya from "../../assets/kenya.jpg";
import ug2 from "../../assets/ug2.jpg";
import woman4 from "../../assets/woman4.jpg";
import wear5 from "../../assets/wear5.jpg";
import wear2 from "../../assets/wear2.jpg";
import woman5 from "../../assets/woman5.jpg";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroImages = [
    {
      src: hat,
      alt: "African Fashion Collection"
    },
    {
      src: afrwear1,
      alt: "African Print Ankara"
    },
    {
      src: afrwear2,
      alt: "Traditional Wear"
    },
    {
      src: dress1,
      alt: "Elegant Dress"
    },
    {
      src: man1,
      alt: "Modern Menswear"
    },
    {
      src: men2,
      alt: "Executive Style"
    },
    {
      src: kenya,
      alt: "Kenyan Fashion"
    },
    {
      src: ug2,
      alt: "Ugandan Elegance"
    },
    {
      src: woman4,
      alt: "African Women's Fashion"
    },
    {
      src: wear5,
      alt: "Colorful Prints"
    },
    {
      src: wear2,
      alt: "Trendy African Wear"
    },
    {
      src: woman5,
      alt: "Modern African Style"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      {/* Background Images with Transition */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={image.src} 
            alt={image.alt} 
            className="object-cover w-full h-full"
          />
        </div>
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <div className="px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">Welcome To Aromo-Mit Fashions Archive!</h1>
          <p className="text-xl md:text-2xl lg:text-3xl">Discover Authentic African Fashion</p>
          <Link to="/shop" className="inline-block px-8 py-3 mt-6 text-lg font-semibold text-white transition-colors bg-gray-900 rounded-lg hover:bg-red-600">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
