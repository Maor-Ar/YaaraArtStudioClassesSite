import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface WhatsAppTestimonial {
  id: string;
  src: string;
  alt: string;
  /** width / height */
  ratio: number;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  private readonly autoplayMs = 4500;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private resumeTimer: ReturnType<typeof setTimeout> | null = null;

  activeIndex = 0;
  spotlightLeaving = false;
  lightboxSrc: string | null = null;

  readonly testimonials: WhatsAppTestimonial[] = [
    {
      id: 't1',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.47.jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 3.02,
    },
    {
      id: 't2',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.47 (1).jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 2.19,
    },
    {
      id: 't3',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.47 (2).jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 1.35,
    },
    {
      id: 't4',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.48.jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 3.16,
    },
    {
      id: 't5',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.48 (1).jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 1.52,
    },
    {
      id: 't6',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.48 (2).jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 2.06,
    },
    {
      id: 't7',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.48 (3).jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 3.61,
    },
    {
      id: 't8',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.48 (4).jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 3.37,
    },
    {
      id: 't9',
      src: this.asset('WhatsApp Image 2026-07-14 at 16.20.48 (5).jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 2.8,
    },
    {
      id: 't10',
      src: this.asset('WhatsApp Image 2026-07-14 at 17.53.29.jpeg'),
      alt: 'המלצה מוואטסאפ',
      ratio: 0.68,
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
  }

  get activeTestimonial(): WhatsAppTestimonial {
    return this.testimonials[this.activeIndex];
  }

  isPortrait(item: WhatsAppTestimonial): boolean {
    return item.ratio < 1;
  }

  selectSpotlight(index: number, fromUser = false): void {
    if (index === this.activeIndex || this.spotlightLeaving) {
      return;
    }
    if (fromUser) {
      this.pauseAutoplayTemporarily();
    }
    this.spotlightLeaving = true;
    window.setTimeout(() => {
      this.activeIndex = index;
      this.spotlightLeaving = false;
    }, 200);
  }

  nextSpotlight(fromUser = false): void {
    this.selectSpotlight((this.activeIndex + 1) % this.testimonials.length, fromUser);
  }

  prevSpotlight(): void {
    this.selectSpotlight(
      (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length,
      true
    );
  }

  openLightbox(src: string): void {
    this.pauseAutoplayTemporarily();
    this.lightboxSrc = src;
  }

  closeLightbox(): void {
    this.lightboxSrc = null;
    this.startAutoplay();
  }

  trackById(_: number, item: WhatsAppTestimonial): string {
    return item.id;
  }

  private startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId) || this.testimonials.length < 2) {
      return;
    }
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      if (this.lightboxSrc || this.spotlightLeaving) {
        return;
      }
      this.nextSpotlight(false);
    }, this.autoplayMs);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /** Pause while user interacts, then resume after a short delay */
  private pauseAutoplayTemporarily(): void {
    this.stopAutoplay();
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }
    this.resumeTimer = setTimeout(() => {
      this.resumeTimer = null;
      if (!this.lightboxSrc) {
        this.startAutoplay();
      }
    }, this.autoplayMs * 2);
  }

  private asset(filename: string): string {
    return `assets/images/testamonials/${encodeURIComponent(filename)}`;
  }
}
