import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Artwork, getArtworks } from '../../data/artworks';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  isLightboxOpen = false;
  currentArtworkIndex = 0;
  displayedCount = 6;

  artworks: Artwork[] = getArtworks();

  ngOnInit(): void {
    this.shuffleArtworks();
  }

  private shuffleArtworks(): void {
    let seed = 123456789;
    const rand = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4294967296;
    };

    for (let i = this.artworks.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = this.artworks[i];
      this.artworks[i] = this.artworks[j];
      this.artworks[j] = tmp;
    }
  }

  get currentArtwork(): Artwork | undefined {
    return this.artworks[this.currentArtworkIndex];
  }

  get displayedArtworks(): Artwork[] {
    return this.artworks.slice(0, this.displayedCount);
  }

  get canLoadMore(): boolean {
    return this.displayedCount < this.artworks.length;
  }

  get remainingArtworksCount(): number {
    return this.artworks.length - this.displayedCount;
  }

  openLightbox(index: number): void {
    this.currentArtworkIndex = index;
    this.isLightboxOpen = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  nextArtwork(): void {
    this.currentArtworkIndex = (this.currentArtworkIndex + 1) % this.artworks.length;
  }

  previousArtwork(): void {
    this.currentArtworkIndex = this.currentArtworkIndex === 0
      ? this.artworks.length - 1
      : this.currentArtworkIndex - 1;
  }

  loadMoreArtworks(): void {
    this.displayedCount = Math.min(this.displayedCount + 6, this.artworks.length);
  }
}
