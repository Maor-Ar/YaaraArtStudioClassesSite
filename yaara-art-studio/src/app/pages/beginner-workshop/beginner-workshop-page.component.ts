import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Theme, ThemeService } from '../../services/theme.service';
import { WorkshopHeroComponent } from '../../components/workshop-hero/workshop-hero.component';
import { WorkshopGalleryCarouselComponent } from '../../components/workshop-gallery-carousel/workshop-gallery-carousel.component';
import { WorkshopLeadFormComponent } from '../../components/workshop-lead-form/workshop-lead-form.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { FooterComponent } from '../../components/footer/footer.component';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function splitAfterQuestions(text: string): string[] {
  return text
    .split(/(?<=\?)\s*/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

@Component({
  selector: 'app-beginner-workshop-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    WorkshopHeroComponent,
    WorkshopGalleryCarouselComponent,
    WorkshopLeadFormComponent,
    TestimonialsComponent,
    FooterComponent
  ],
  templateUrl: './beginner-workshop-page.component.html',
  styleUrl: './beginner-workshop-page.component.scss'
})
export class BeginnerWorkshopPageComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Offer stays up through 24.9.2026 and hides from 25.9.2026 00:00 Israel time. */
  readonly extraDiscountUntil = new Date('2026-09-25T00:00:00+03:00');
  extraDiscountActive = false;
  countdownReady = false;
  countdown: CountdownParts = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  showStickyCta = false;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private heroObserver: IntersectionObserver | null = null;
  private previousTheme: Theme | null = null;

  readonly quotes = [
    'לא האמנתי שזה יקרה אבל אני מציירת עכשיו כמעט כל יום אחרי ששנים רק ראיתי ציורים מהצד ולא העזתי לנסות',
    'הציור השני שציירתי היה כבר כל כך יפה והייתי בהלם שאני זאת שעשיתי אותו! שנים חשבתי שזה מסובך וגיליתי שבכלל לא',
    'איך לא ידעתי את זה לפני, הייתי מתחיל עוד הרבה קודם..'
  ];

  readonly painTitle = 'רוצים גם ללמוד לצייר בצורה מסודרת ונכונה ולהצליח ליצור בעצמכם יצירות מדהימות?';
  readonly painBody = 'נמאס לכם לרצות לצייר ולא לדעת מאיפה להתחיל? לנסות לצייר משהו שראיתם ולהתבאס שהתוצאה לא דומה? להרגיש שיש לכם רצון לצייר, אבל אין לכם את הכלים והביטחון לעשות את זה?';
  readonly painTitleLines = splitAfterQuestions(this.painTitle);
  readonly painBodyLines = splitAfterQuestions(this.painBody);

  readonly curriculum = [
    {
      title: 'היכרות עם עולם הציור והעפרונות',
      body: 'איך לעבוד נכון עם עפרונות, למצוא פרופורציות ולבנות ציור בצורה מדויקת.'
    },
    {
      title: 'איך יוצרים עומק ונפח בציור?',
      body: 'נלמד הצללות, אור וצל, ואיך לעבוד עם קצוות חדים ורכים כדי לגרום לציור להיראות תלת־ממדי.'
    },
    {
      title: 'איך מציירים טקסטורות?',
      body: 'נלמד להסתכל על המרקם של מה שאנחנו מציירים ולתרגם אותו לנייר בצורה משכנעת.'
    },
    {
      title: 'תיאוריית הצבעים בלי להסתבך',
      body: 'איך מערבבים גוונים מדויקים, איך מבינים את היחסים בין צבעים ואיך משתמשים בהם כדי ליצור אור, צל ועומק.'
    },
    {
      title: 'פרויקט סיום – ציור מלא בצבע',
      body: 'ניישם את כל מה שלמדנו לאורך הקורס ונעבוד שלב־שלב על ציור שלם, מההתחלה ועד הפרטים האחרונים.'
    },
    {
      title: 'כל החומרים שתצטרכו כלולים!',
      body: 'אתם רק מגיעים להנות!'
    }
  ];

  readonly valuePoints = [
    'במקום להמשיך לנסות ללמוד לבד ולנחש מה אתם עושים לא נכון — תקבלו בסיס מסודר וברור לציור שעליו תוכלו להמשיך לבנות.',
    'תוך 6 מפגשים תעברו מלהחזיק עיפרון בלי לדעת מאיפה להתחיל, ליצירת ציור שלם בצבע, מהסקיצה ועד הפרטים האחרונים.',
    'תצאו עם כלים שתוכלו להשתמש בהם גם הרבה אחרי שהקורס נגמר. פרופורציות, אור וצל, טקסטורות, עבודה עם צבע, ערבוב גוונים ועוד.'
  ];

  readonly notFor = [
    'למי שכבר יש לו בסיס בציור ומחפש להעמיק בטכניקות מורכבות',
    'למי שמחפש קורס דיגיטלי שאפשר ללמוד לבד (הקורס פרונטלי בכפר סבא)',
    'למי שמחפש רק לצייר לכיף בלי ללמוד את הטכניקות שבונות את התהליך'
  ];

  constructor(
    private title: Title,
    private meta: Meta,
    private themeService: ThemeService,
    private host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.previousTheme = this.themeService.getCurrentTheme();
      this.themeService.setTheme('dark');
    }
  }

  ngOnInit(): void {
    const pageTitle = 'ארגז כלים לציור | סטודיו בודה';
    const description = 'הופכים לציירים תוך 6 שבועות. קורס פרונטלי בכפר סבא למתחילים — שיטה מסודרת לציור עצמאי, בלי ניסיון קודם.';
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: 'https://studiobuda.co.il/BegginerArtistWorkshop' });
    this.extraDiscountActive = this.isEarlyBirdOfferActive();
    if (isPlatformBrowser(this.platformId)) {
      this.themeService.setTheme('dark');
      this.countdownReady = true;
      this.updateCountdown();
      this.countdownTimer = setInterval(() => this.updateCountdown(), 1000);
    }
  }

  ngAfterViewInit(): void {
    this.observeHeroForStickyBar();
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.heroObserver?.disconnect();
    this.heroObserver = null;
    if (isPlatformBrowser(this.platformId) && this.previousTheme) {
      this.themeService.setTheme(this.previousTheme);
    }
  }

  get displayPrice(): number {
    return 1800;
  }

  scrollToRegister(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private observeHeroForStickyBar(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const hero = this.host.nativeElement.querySelector('.workshop-hero');
    if (!hero) {
      return;
    }
    this.heroObserver = new IntersectionObserver(
      ([entry]) => {
        this.showStickyCta = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      },
      { threshold: 0 }
    );
    this.heroObserver.observe(hero);
  }

  private isEarlyBirdOfferActive(): boolean {
    return Date.now() < this.extraDiscountUntil.getTime();
  }

  private updateCountdown(): void {
    const remaining = this.extraDiscountUntil.getTime() - Date.now();
    this.extraDiscountActive = this.isEarlyBirdOfferActive();
    if (!this.extraDiscountActive) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    this.countdown = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  }
}
