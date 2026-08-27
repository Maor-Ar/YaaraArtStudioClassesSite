import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Artwork, getArtworks } from '../../data/artworks';

@Component({
  selector: 'app-workshop-gallery-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshop-gallery-carousel.component.html',
  styleUrl: './workshop-gallery-carousel.component.scss'
})
export class WorkshopGalleryCarouselComponent implements OnInit, OnDestroy {
  @Input() autoplayMs = 4200;

  artworks: Artwork[] = getArtworks();
  activeIndex = 0;
  lightboxOpen = false;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.unlockScroll();
  }

  get currentArtwork(): Artwork {
    return this.artworks[this.activeIndex];
  }

  get prevArtwork(): Artwork {
    return this.artworks[this.prevIndex];
  }

  get nextArtwork(): Artwork {
    return this.artworks[this.nextIndex];
  }

  get prevIndex(): number {
    return (this.activeIndex - 1 + this.artworks.length) % this.artworks.length;
  }

  get nextIndex(): number {
    return (this.activeIndex + 1) % this.artworks.length;
  }

  select(index: number, fromUser = false): void {
    if (index === this.activeIndex) {
      return;
    }
    this.activeIndex = (index + this.artworks.length) % this.artworks.length;
    if (fromUser) {
      this.pauseThenResume();
    }
  }

  next(fromUser = false): void {
    this.select(this.nextIndex, fromUser);
  }

  prev(): void {
    this.select(this.prevIndex, true);
  }

  openLightbox(): void {
    this.lightboxOpen = true;
    this.stopAutoplay();
    this.lockScroll();
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.unlockScroll();
    this.startAutoplay();
  }

  private startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId) || this.artworks.length < 2) {
      return;
    }
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      if (!this.lightboxOpen) {
        this.next(false);
      }
    }, this.autoplayMs);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private pauseThenResume(): void {
    this.stopAutoplay();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (!this.lightboxOpen) {
          this.startAutoplay();
        }
      }, this.autoplayMs * 2);
    }
  }

  private lockScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  private unlockScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
