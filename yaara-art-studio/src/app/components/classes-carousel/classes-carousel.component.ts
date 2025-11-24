import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
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
export class ClassesCarouselComponent implements OnInit, OnDestroy {
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
    }
  ];

  currentIndex = 0;
  private autoSlideInterval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.classes.length;
  }

  previousSlide(): void {
    this.currentIndex = this.currentIndex === 0 
      ? this.classes.length - 1 
      : this.currentIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    if (isPlatformBrowser(this.platformId) && this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.startAutoSlide();
    }
  }

  get currentClass(): ArtClass {
    return this.classes[this.currentIndex];
  }
}

