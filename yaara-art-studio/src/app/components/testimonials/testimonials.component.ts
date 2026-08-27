import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class TestimonialsComponent {
  @Input() title = 'מה אומרים עלינו';
  @Input() subtitle = '';

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

  get activeTestimonial(): WhatsAppTestimonial {
    return this.testimonials[this.activeIndex];
  }

  isPortrait(item: WhatsAppTestimonial): boolean {
    return item.ratio < 1;
  }

  selectSpotlight(index: number): void {
    if (index === this.activeIndex || this.spotlightLeaving) {
      return;
    }
    this.spotlightLeaving = true;
    window.setTimeout(() => {
      this.activeIndex = index;
      this.spotlightLeaving = false;
    }, 200);
  }

  nextSpotlight(): void {
    this.selectSpotlight((this.activeIndex + 1) % this.testimonials.length);
  }

  prevSpotlight(): void {
    this.selectSpotlight(
      (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length
    );
  }

  openLightbox(src: string): void {
    this.lightboxSrc = src;
  }

  closeLightbox(): void {
    this.lightboxSrc = null;
  }

  trackById(_: number, item: WhatsAppTestimonial): string {
    return item.id;
  }

  private asset(filename: string): string {
    return `assets/images/testamonials/${encodeURIComponent(filename)}`;
  }
}
