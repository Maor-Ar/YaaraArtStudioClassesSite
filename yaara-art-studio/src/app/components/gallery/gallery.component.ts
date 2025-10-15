import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  isLightboxOpen = false;
  currentArtworkIndex = 0;
  displayedCount = 6; // Show 6 images initially

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
    },
    // New unique images from GitHub issue
    {
      title: "יצירת אמנות 7",
      description: "ציור אקריליק על קנבס, קומפוזיציה מודרנית",
      technique: "אקריליק על קנבס",
      size: "50x70 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/24c737c6-5154-43e1-9936-b4ffec1c74b6"
    },
    {
      title: "יצירת אמנות 8",
      description: "צבעי מים על נייר, נוף טבעי מרהיב",
      technique: "צבעי מים על נייר",
      size: "40x55 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/c6d6ebb2-75c9-4654-909b-d6132ceebb9d"
    },
    {
      title: "יצירת אמנות 9",
      description: "פחם על נייר, דיוקן אקספרסיבי",
      technique: "פחם על נייר",
      size: "35x50 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/6d64e201-45eb-40a2-a4ab-5ff37d395d31"
    },
    {
      title: "יצירת אמנות 10",
      description: "שמן על בד, טבע דומם קלאסי",
      technique: "שמן על בד",
      size: "60x80 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/ac703243-78ca-46e1-a996-a62f532898c8"
    },
    {
      title: "יצירת אמנות 11",
      description: "צבעי פסטל על נייר, דיוקן עדין",
      technique: "פסטל על נייר",
      size: "45x60 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/26cbda52-de95-4a3d-8e26-23b4c3e0cdba"
    },
    {
      title: "יצירת אמנות 12",
      description: "אקוורל על נייר, נוף עירוני",
      technique: "אקוורל על נייר",
      size: "30x40 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/57f9dda9-64bf-4bd8-a6cc-40f8c563a1e8"
    },
    {
      title: "יצירת אמנות 13",
      description: "ציור אקריליק, קומפוזיציה מופשטת",
      technique: "אקריליק על בד",
      size: "70x90 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/3dee6ac2-8d32-4ecc-8f14-734b994ceabf"
    },
    {
      title: "יצירת אמנות 14",
      description: "שמן על קנבס, נוף ימי רומנטי",
      technique: "שמן על קנבס",
      size: "50x65 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/dd4df961-c2ba-4b6f-adca-6af5f78812f0"
    },
    {
      title: "יצירת אמנות 15",
      description: "פחם על נייר, דיוקן עצמי אמנותי",
      technique: "פחם על נייר",
      size: "40x55 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/4f961b14-6c8b-4060-bfae-d44da6451851"
    },
    {
      title: "יצירת אמנות 16",
      description: "צבעי מים על נייר, פרחים עדינים",
      technique: "צבעי מים על נייר",
      size: "35x45 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/16cbc997-8727-40b6-8015-c1c111b2f76c"
    },
    {
      title: "יצירת אמנות 17",
      description: "אקריליק על בד, קומפוזיציה צבעונית",
      technique: "אקריליק על בד",
      size: "55x70 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/8b571af9-0491-4d66-a0c1-26902fa3f691"
    },
    {
      title: "יצירת אמנות 18",
      description: "פסטל על נייר, נוף כפרי שליו",
      technique: "פסטל על נייר",
      size: "45x60 ס״מ",
      imageUrl: "https://github.com/user-attachments/assets/e2f56a0a-016d-4224-8ffb-60e29bb48371"
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