import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import type { HeroSlide } from '@/data/eventContent';

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateCurrentSlide = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    updateCurrentSlide();
    api.on('select', updateCurrentSlide);
    api.on('reInit', updateCurrentSlide);

    return () => {
      api.off('select', updateCurrentSlide);
      api.off('reInit', updateCurrentSlide);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused) return;

    const autoplay = window.setInterval(() => {
      api.scrollNext();
    }, 5200);

    return () => window.clearInterval(autoplay);
  }, [api, isPaused]);

  const selectedSlide = slides[currentSlide];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-x-8 top-6 z-20 flex items-start justify-between gap-4">
        <div className="inline-flex max-w-fit items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
          {selectedSlide.badge}
        </div>
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition hover:bg-black/30"
          aria-label={isPaused ? 'Reanudar slider' : 'Pausar slider'}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }} className="overflow-hidden rounded-[2rem]">
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.title} className="pl-0">
              <div className="relative h-[430px] overflow-hidden rounded-[2rem] border border-white/40 bg-[#163323] shadow-[0_35px_90px_-40px_rgba(22,51,35,0.9)] sm:h-[520px] lg:h-[600px]">
                <img
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
                />
                <img
                  src={slide.image}
                  alt={`${slide.title} - ${slide.location}`}
                  className="relative z-10 h-full w-full object-contain"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,10,0.12)_0%,rgba(6,16,10,0.34)_40%,rgba(6,16,10,0.82)_100%)]" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
