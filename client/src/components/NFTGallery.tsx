import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import img1 from '@assets/IMG_8510_1762679975228.jpeg';
import img2 from '@assets/IMG_8511_1762679975228.jpeg';
import img3 from '@assets/IMG_8512_1762679975228.jpeg';
import img4 from '@assets/IMG_8513_1762679975228.jpeg';

const nftImages = [
  { src: img1, alt: 'Liminal Dreams NFT - Nature Guardian' },
  { src: img2, alt: 'Liminal Dreams NFT - Cosmic Warrior' },
  { src: img3, alt: 'Liminal Dreams NFT - Steampunk Explorer' },
  { src: img4, alt: 'Liminal Dreams NFT - Cyberpunk Hero' },
];

export default function NFTGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Collection Sneak Peek
          </h2>
          <p className="text-muted-foreground">
            Swipe to explore the Liminal Dreams universe
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {nftImages.map((image, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_80%] md:flex-[0_0_60%] lg:flex-[0_0_50%]"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-primary/20 shadow-2xl hover-elevate transition-all duration-300">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      data-testid={`img-nft-${index}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className="pointer-events-auto bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
              data-testid="button-gallery-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className="pointer-events-auto bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
              data-testid="button-gallery-next"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {nftImages.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-primary w-8'
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
              data-testid={`button-gallery-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
