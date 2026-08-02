import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
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

  const selectedSlide = slides[currentSlide] ?? slides[0];

  const goToPrevious = () => api?.scrollPrev();
  const goToNext = () => api?.scrollNext();

  return (
    <div
      className="group relative outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goToPrevious();
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goToNext();
        }
      }}
      tabIndex={0}
      aria-label="Galería fotográfica Wayra Trail"
    >
      <div className="absolute inset-x-8 top-6 z-20 flex items-start justify-between gap-4">
        {selectedSlide.badge.trim() !== '' ? (
          <div className="inline-flex max-w-fit items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
            {selectedSlide.badge}
          </div>
        ) : (
          <div aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          aria-label={isPaused ? 'Reanudar slider' : 'Pausar slider'}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }} className="overflow-hidden rounded-[2rem]">
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={`${slide.title}-${index}`} className="pl-0">
              <div className="relative h-[430px] overflow-hidden rounded-[2rem] border border-white/40 bg-[#163323] shadow-[0_35px_90px_-40px_rgba(22,51,35,0.9)] sm:h-[520px] lg:h-[600px]">
                <img
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
                />
                <img
                  src={slide.image}
                  alt={[slide.title, slide.location].filter(Boolean).join(' - ') || 'Imagen del carrusel Wayra Trail'}
                  className="relative z-10 h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.012]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,10,0.08)_0%,rgba(6,16,10,0.18)_52%,rgba(6,16,10,0.72)_100%)]" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#071a12]/55 text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl transition hover:scale-105 hover:bg-[#071a12]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:left-6 sm:h-14 sm:w-14"
            aria-label="Ver fotografía anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#071a12]/55 text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl transition hover:scale-105 hover:bg-[#071a12]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:right-6 sm:h-14 sm:w-14"
            aria-label="Ver fotografía siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-[#071a12]/60 px-4 py-3 text-white shadow-xl backdrop-blur-xl sm:bottom-7">
            <span className="min-w-9 text-center text-[11px] font-bold tabular-nums tracking-[0.16em] text-white/75">
              {String(currentSlide + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Seleccionar fotografía">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'w-7 bg-emerald-300' : 'w-1.5 bg-white/35 hover:bg-white/65'
                  }`}
                  aria-label={`Ir a la fotografía ${index + 1}`}
                  aria-selected={currentSlide === index}
                  role="tab"
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
