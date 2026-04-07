import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Pause, Play } from 'lucide-react';
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
                  alt={`${slide.title} - ${slide.location}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,10,0.12)_0%,rgba(6,16,10,0.34)_40%,rgba(6,16,10,0.82)_100%)]" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-x-6 bottom-6 z-20 rounded-[1.75rem] border border-white/15 bg-black/20 p-5 text-white backdrop-blur-xl lg:inset-x-8 lg:bottom-8 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
              <MapPin className="h-3.5 w-3.5" />
              {selectedSlide.location}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-white lg:text-3xl">
              {selectedSlide.title}
            </h3>
            <p className="mt-2 text-sm font-semibold text-green-100 lg:text-base">
              {selectedSlide.subtitle}
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/78 lg:text-[15px]">
              {selectedSlide.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-12 bg-white' : 'w-6 bg-white/35 hover:bg-white/55'
                  }`}
                  aria-label={`Ir a la imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
