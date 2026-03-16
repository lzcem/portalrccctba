import { useState } from 'react';
     import placeholder from '../assets/placeholder-1200x400.jpg';

     const Carousel = () => {
       const [currentSlide, setCurrentSlide] = useState(0);
       const slides = [
         { image: placeholder, title: 'Evento 1', description: 'Descrição do evento 1' },
         { image: placeholder, title: 'Evento 2', description: 'Descrição do evento 2' },
         { image: placeholder, title: 'Evento 3', description: 'Descrição do evento 3' },
       ];

       const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
       const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);

       return (
         <div className="relative w-full max-w-7xl mx-auto">
           <img
             src={slides[currentSlide].image}
             alt={slides[currentSlide].title}
             className="w-full h-[400px] object-cover rounded-lg"
           />
           <div className="absolute inset-0 flex items-center justify-between px-4 bg-black bg-opacity-40 rounded-lg">
             <button
               onClick={prevSlide}
               className="text-white text-4xl bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
             >
               ←
             </button>
             <div className="text-center text-white max-w-md mx-auto">
               <h2 className="text-3xl font-bold">{slides[currentSlide].title}</h2>
               <p className="text-lg">{slides[currentSlide].description}</p>
             </div>
             <button
               onClick={nextSlide}
               className="text-white text-4xl bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
             >
               →
             </button>
           </div>
         </div>
       );
     };

     export default Carousel;