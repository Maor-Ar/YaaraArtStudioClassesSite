import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Artwork {
  title: string;
  description: string;
  technique: string;
  size: string;
  imageUrl: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  isLightboxOpen = false;
  currentArtworkIndex = 0;

  artworks: Artwork[] = [
    {
      title: "יצירת אמנות 1",
      description: "ציור שמן על בד, יצירה של תלמידה בכירה",
      technique: "שמן על בד",
      size: "40x50 ס״מ",
      imageUrl: "https://i.imgur.com/mv2DaGr.jpeg"
    },
    {
      title: "יצירת אמנות 2",
      description: "פחם על נייר, ביטוי אישי ועמוק",
      technique: "פחם על נייר",
      size: "30x40 ס״מ",
      imageUrl: "https://i.imgur.com/tEtzdsd.jpeg"
    },
    {
      title: "יצירת אמנות 3",
      description: "אקוורל על נייר, עדינות וצבעוניות",
      technique: "אקוורל על נייר",
      size: "25x35 ס״מ",
      imageUrl: "https://i.imgur.com/sw7DEHh.jpeg"
    },
    {
      title: "יצירת אמנות 4",
      description: "צבעי אקריליק על בד, אנרגיה ותנועה",
      technique: "אקריליק על בד",
      size: "50x60 ס״מ",
      imageUrl: "https://i.imgur.com/prg4e8z.jpeg?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "יצירת אמנות 5",
      description: "צבעי פסטל על נייר, רכות וטבע",
      technique: "פסטל על נייר",
      size: "35x45 ס״מ",
      imageUrl: "https://i.imgur.com/pGJQA3e.jpeg?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "יצירת אמנות 6",
      description: "צבעי שמן על קנבס, צורות וצבעים",
      technique: "שמן על קנבס",
      size: "60x80 ס״מ",
      imageUrl: "https://i.imgur.com/MtoacMq.jpeg?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  get currentArtwork(): Artwork | undefined {
    return this.artworks[this.currentArtworkIndex];
  }

  openLightbox(index: number): void {
    this.currentArtworkIndex = index;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    document.body.style.overflow = 'auto';
  }

  nextArtwork(): void {
    this.currentArtworkIndex = (this.currentArtworkIndex + 1) % this.artworks.length;
  }

  previousArtwork(): void {
    this.currentArtworkIndex = this.currentArtworkIndex === 0 
      ? this.artworks.length - 1 
      : this.currentArtworkIndex - 1;
  }
}