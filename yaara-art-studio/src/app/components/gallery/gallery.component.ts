import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Artwork {
  title: string;
  description: string;
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
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  isLightboxOpen = false;
  currentArtworkIndex = 0;
  displayedCount = 6; // Show 6 images initially

  artworks: Artwork[] = [
    {
      title: "פסטל שמן על בריסטול",
      description: "42X30 ס״מ",
      imageUrl: "https://i.imgur.com/tEtzdsd.jpeg"
    },
    {
      title: "גיר לבן על בריסטול שחור",
      description: "30X40 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/dd4df961-c2ba-4b6f-adca-6af5f78812f0"
    },
    {
      title: "עפרונות צבעוניים על בריסטול",
      description: "30X42 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/e2f56a0a-016d-4224-8ffb-60e29bb48371"
    },
    {
      title: "שמן על בד",
      description: "30X40 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/c6d6ebb2-75c9-4654-909b-d6132ceebb9d"
    },
    {
      title: "פסטל שמן על בריסטול",
      description: "20X30 ס״מ",
      imageUrl: "https://i.imgur.com/sw7DEHh.jpeg"
    },
    {
      title: "שמן על בד",
      description: "30X40 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/6d64e201-45eb-40a2-a4ab-5ff37d395d31"
    },
    //{
    //  title: "אקריליק על קנבס",
    //  description: "80X60 ס״מ",
    //  imageUrl: "https://github.com/user-attachments/assets/ac703243-78ca-46e1-a996-a62f532898c8"
    //},
    {
      title: "אקריליק על קנבס",
      description: "13X18 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/26cbda52-de95-4a3d-8e26-23b4c3e0cdba"
    },
    {
      title: "רישום דיגיטלי",
      description: "",
      imageUrl: "https://i.imgur.com/pGJQA3e.jpeg?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "אקריליק על קנבס",
      description: "25 ס״מ קוטר",
      imageUrl: "https://github.com/user-attachments/assets/57f9dda9-64bf-4bd8-a6cc-40f8c563a1e8"
    },
    {
      title: "אקריליק על בד",
      description: "50X40 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/3dee6ac2-8d32-4ecc-8f14-734b994ceabf"
    },
    {
      title: "ציור דיגיטלי",
      description: "",
      imageUrl: "https://i.imgur.com/MtoacMq.jpeg?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "אקריליק על קנבס",
      description: "80X60 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/4f961b14-6c8b-4060-bfae-d44da6451851"
    },
    {
      title: "אקריליק על קנבס",
      description: "80X50 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/16cbc997-8727-40b6-8015-c1c111b2f76c"
    },
    {
      title: "אקריליק על קנבס",
      description: "25X25 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/8b571af9-0491-4d66-a0c1-26902fa3f691"
    }
  ];

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