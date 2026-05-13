import * as React from 'react';
import { X } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../ui/carousel';

type RangeCarouselMedia = {
  kind: 'image' | 'video';
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type RangeCarouselSection = {
  id: string;
  label: string;
  title: string;
  media: RangeCarouselMedia[];
};

type HomepageRangeCarouselProps = {
  sections: RangeCarouselSection[];
};

export default function HomepageRangeCarousel({
  sections,
}: HomepageRangeCarouselProps) {
  const [activeSectionId, setActiveSectionId] = React.useState<string | null>(
    null,
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);
  const lastTriggerRef = React.useRef<HTMLElement | null>(null);

  const activeSection = React.useMemo(
    () => sections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId, sections],
  );

  const focusNextButton = React.useCallback(() => {
    if (nextButtonRef.current && !nextButtonRef.current.disabled) {
      nextButtonRef.current.focus();
      return;
    }

    dialogRef.current
      ?.querySelector<HTMLElement>(
        'button:not(:disabled), video[controls], [href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )
      ?.focus();
  }, []);

  const getDialogFocusableElements = React.useCallback(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return [];
    }

    return Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button:not(:disabled), video[controls], [href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);
  }, []);

  const closeCarousel = React.useCallback(() => {
    setActiveSectionId(null);
    setApi(undefined);
    setCurrentSlide(0);
    lastTriggerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>(
        '[data-range-carousel-trigger]',
      );

      if (!trigger) {
        return;
      }

      const sectionId = trigger.dataset.rangeCarouselTrigger;
      const sectionExists = sections.some((section) => section.id === sectionId);

      if (!sectionId || !sectionExists) {
        return;
      }

      lastTriggerRef.current = trigger;
      setCurrentSlide(0);
      setActiveSectionId(sectionId);
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [sections]);

  React.useEffect(() => {
    if (!activeSection) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCarousel();
        return;
      }

      if (
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight') &&
        !(document.activeElement instanceof HTMLVideoElement)
      ) {
        event.preventDefault();

        if (event.key === 'ArrowLeft') {
          api?.scrollPrev();
        } else {
          api?.scrollNext();
        }

        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const dialog = dialogRef.current;
      const focusableElements = getDialogFocusableElements();

      if (!dialog || focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        focusNextButton();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeSection,
    api,
    closeCarousel,
    focusNextButton,
    getDialogFocusableElements,
  ]);

  React.useEffect(() => {
    if (!activeSection || !api) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(focusNextButton);
    const timeout = window.setTimeout(focusNextButton, 0);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, [activeSection, api, focusNextButton]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

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

  React.useEffect(() => {
    if (!activeSection) {
      return;
    }

    const videos =
      dialogRef.current?.querySelectorAll<HTMLVideoElement>('video') ?? [];

    videos.forEach((video, index) => {
      if (index !== currentSlide) {
        video.pause();
        return;
      }

      video.muted = true;
      video.play().catch(() => {
        // Autoplay can still be blocked by browser settings; controls remain available.
      });
    });
  }, [activeSection, currentSlide]);

  if (!activeSection) {
    return null;
  }

  return (
    <div
      ref={dialogRef}
      className="homepage-range-carousel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="homepage-range-carousel-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeCarousel();
        }
      }}
    >
      <div className="homepage-range-carousel__panel">
        <header className="homepage-range-carousel__header">
          <div>
            <p>{activeSection.label}</p>
            <h2 id="homepage-range-carousel-title">{activeSection.title}</h2>
          </div>
          <button
            className="homepage-range-carousel__icon-button"
            type="button"
            aria-label="Close carousel"
            onClick={closeCarousel}
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <Carousel
          key={activeSection.id}
          setApi={setApi}
          opts={{ align: 'start', loop: activeSection.media.length > 1 }}
          className="homepage-range-carousel__carousel"
        >
          <CarouselContent className="homepage-range-carousel__track">
            {activeSection.media.map((media) => (
              <CarouselItem
                className="homepage-range-carousel__slide"
                key={media.src}
              >
                <figure
                  className={`homepage-range-carousel__media-frame homepage-range-carousel__media-frame--${media.kind}`}
                >
                  {media.kind === 'image' ? (
                    <img
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      decoding="async"
                    />
                  ) : (
                    <video
                      autoPlay
                      controls
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={media.alt}
                    >
                      <source src={media.src} type="video/mp4" />
                    </video>
                  )}
                  <figcaption className="visually-hidden">
                    {media.alt}
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>

          <footer className="homepage-range-carousel__controls">
            <CarouselPrevious
              className="homepage-range-carousel__icon-button"
              aria-label="Previous slide"
            />
            <span aria-live="polite">
              {currentSlide + 1} / {activeSection.media.length}
            </span>
            <CarouselNext
              ref={nextButtonRef}
              className="homepage-range-carousel__icon-button"
              aria-label="Next slide"
            />
          </footer>
        </Carousel>
      </div>
    </div>
  );
}
