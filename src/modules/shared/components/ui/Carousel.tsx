import { useState, useEffect, useCallback } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface CarouselImage {
  title: string
  url: string
  imageUrl: string
}

interface IProps {
  images: CarouselImage[]
}

export const ImageCarousel = ( { images } : IProps ) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    //preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div {...handlers} className="relative h-64 overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <a key={ index } href={ image.url }>
            <div
              className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={ image.imageUrl }
                alt={ image.title }
                className="w-full h-full object-cover"
              />
            </div>
          </a>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 focus:outline-none hover:bg-opacity-75 transition-all"
        aria-label="Previous image"
      >
        <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 focus:outline-none hover:bg-opacity-75 transition-all"
        aria-label="Next image"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-800" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full focus:outline-none transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
