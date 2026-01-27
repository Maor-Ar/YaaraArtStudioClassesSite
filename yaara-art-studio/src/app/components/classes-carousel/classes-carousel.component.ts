import { Component, OnInit, OnDestroy, OnChanges, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface ArtClass {
  title: string;
  description: string;
  days: string;
  times: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-classes-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classes-carousel.component.html',
  styleUrl: './classes-carousel.component.scss'
})
export class ClassesCarouselComponent implements OnInit, OnDestroy, OnChanges {
  @Input() viewMode: 'adult' | 'child' | 'both' = 'both';
  
  classes: ArtClass[] = [
    {
      title: 'תרגיל מתחלף - שיעור הדגל',
      description: 'זהו שיעור שמכוון למתקדמים. יהיו בו תרגילים מתחלפים, פעם בכמה שבועות. יהיו בהם מלא סוגים של רעיונות, טכניקות שונות להשתפר בהם, והמון מוטיבציה, השראה ואתגר. זה מקום מצויין לחפש את הנישה שלכם באומנות, לחדד את היצירתיות, לפתוח את הראש, ולהביא את העבודות שלכם צעד אחד קדימה.',
      days: 'ימי רביעי',
      times: ['18:00-19:30', '19:30-21:00'],
      imageUrl: 'https://github.com/user-attachments/assets/dd4df961-c2ba-4b6f-adca-6af5f78812f0'
    },
    {
      title: 'פורטרט',
      description: 'בשיעורים האלו אנחנו נתמקד בציור פנים במגוון סגנונות- עם דגש על ריאליזם. נלמד את כל האלמנטים השונים, מצבעים נכונים לעור הפנים, ועד לשיער ובדים. נעבוד בעיקר באקריליק ובצבעי שמן.',
      days: 'ימי שלישי',
      times: ['18:00-19:30', '19:30-21:00'],
      imageUrl: 'https://github.com/user-attachments/assets/e2f56a0a-016d-4224-8ffb-60e29bb48371'
    },
    {
      title: 'רישום',
      description: 'שיעור זה מתאים גם למתחילים ומתעסק בשיפור ודיוק טכניקת הרישום, שהיא הבסיס החזק ביותר גם לכל שאר התחומים. נלמד איך להגיע לריאליזם ברמה גבוהה, גם מהתבוננות וגם מתמונה, בעזרת עפרונות ופחם.',
      days: 'ימי ראשון',
      times: ['18:00-19:30', '19:30-21:00'],
      imageUrl: 'https://github.com/user-attachments/assets/24c737c6-5154-43e1-9936-b4ffec1c74b6'
    },
    {
      title: 'שיעורים לילדים',
      description: 'בשיעורים האלה נשים דגש על עידוד הביטחון העצמי, הקניית כלים וידע, ויצירה עצמאית באמנות. נעבוד בטכניקות של רישום ואקריליק. מיועד לגילאי 6-16.',
      days: 'שני, שלישי וחמישי',
      times: ['15:00-16:30', '16:30-18:00'],
      imageUrl: 'https://github.com/user-attachments/assets/ac703243-78ca-46e1-a996-a62f532898c8'
    }
  ];

  filteredClasses: ArtClass[] = [];
  currentIndex = 0;
  private autoSlideInterval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.updateFilteredClasses();
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  ngOnChanges(): void {
    this.updateFilteredClasses();
    // Reset current index when filtered classes change
    if (this.currentIndex >= this.filteredClasses.length) {
      this.currentIndex = 0;
    }
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private updateFilteredClasses(): void {
    if (this.viewMode === 'adult') {
      this.filteredClasses = this.classes.filter(c => c.title !== 'שיעורים לילדים');
    } else if (this.viewMode === 'child') {
      this.filteredClasses = this.classes.filter(c => c.title === 'שיעורים לילדים');
    } else {
      this.filteredClasses = this.classes; // both
    }
  }

  startAutoSlide(): void {
    if (this.filteredClasses.length <= 1) return; // Don't auto-slide if only one item
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  nextSlide(): void {
    if (this.filteredClasses.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.filteredClasses.length;
  }

  previousSlide(): void {
    if (this.filteredClasses.length === 0) return;
    this.currentIndex = this.currentIndex === 0 
      ? this.filteredClasses.length - 1 
      : this.currentIndex - 1;
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.filteredClasses.length) return;
    this.currentIndex = index;
    if (isPlatformBrowser(this.platformId) && this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.startAutoSlide();
    }
  }

  get currentClass(): ArtClass {
    return this.filteredClasses[this.currentIndex];
  }
}

