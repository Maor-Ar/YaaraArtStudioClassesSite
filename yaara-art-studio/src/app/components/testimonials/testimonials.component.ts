import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface Testimonial {
  text: string;
  name: string;
  details: string;
  rating: number;
  avatarColor: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  testimonials: Testimonial[] = [
    {
      text: "הרגשתי שגיליתי מחדש את היצירה שלי. יערה ליוותה אותי בכל שלב עם סבלנות רבה ונתנה לי כלים מקצועיים להתפתח.",
      name: "נועה",
      details: "תלמידה במשך שנה וחצי",
      rating: 5,
      avatarColor: "linear-gradient(135deg, #FF6B6B, #4ECDC4)"
    },
    {
      text: "האווירה קסומה, והלימוד בגובה העיניים. אף פעם לא הרגשתי שאני לא מספיק טובה, תמיד עודדו אותי לנסות דברים חדשים.",
      name: "תומר",
      details: "תלמיד במשך 8 חודשים",
      rating: 5,
      avatarColor: "linear-gradient(135deg, #96CEB4, #FECA57)"
    },
    {
      text: "הסטודיו הפך לבית שני שלי. כל שיעור הוא חוויה מיוחדת שממלאת אותי באנרגיה יצירתית. יערה יודעת איך לעורר השראה.",
      name: "מיכל",
      details: "תלמידה במשך שנתיים",
      rating: 5,
      avatarColor: "linear-gradient(135deg, #45B7D1, #96CEB4)"
    },
    {
      text: "התחלתי בלי שום ניסיון בציור, והיום אני מציירת יצירות שאני גאה בהן. השיעורים האישיים עזרו לי להתקדם בקצב שלי.",
      name: "דני",
      details: "תלמיד במשך שנה",
      rating: 5,
      avatarColor: "linear-gradient(135deg, #A8E6CF, #FFD3A5)"
    },
    {
      text: "הגעתי לסטודיו אחרי שנים שלא ציירתי. יערה החזירה לי את הביטחון ואת האהבה לאמנות. המקום הזה הוא קסם אמיתי.",
      name: "רחל",
      details: "תלמידה במשך 6 חודשים",
      rating: 5,
      avatarColor: "linear-gradient(135deg, #FF9A9E, #FECFEF)"
    },
    {
      text: "השילוב בין מקצועיות לחום אנושי הוא מושלם. כל שיעור לימד אותי משהו חדש, וגם כשטעיתי - זה היה חלק מהתהליך.",
      name: "עמית",
      details: "תלמיד במשך שנה ושלושה חודשים",
      rating: 5,
      avatarColor: "linear-gradient(135deg, #667eea, #764ba2)"
    }
  ];

  getStars(rating: number): string {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars;
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Check if we're on the main page or need to navigate there first
    const currentRoute = this.router.url.split('?')[0];
    const isMainPage = currentRoute === '/' || currentRoute === '';
    
    if (!isMainPage) {
      // Navigate to main page with fragment and query params
      const queryParams = this.route.snapshot.queryParams;
      this.router.navigate(['/'], {
        fragment: sectionId,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      });
    } else {
      // Preserve query parameters
      const queryParams = this.route.snapshot.queryParams;
      
      // Navigate with fragment and query params preserved
      this.router.navigate([], {
        fragment: sectionId,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }).then(() => {
        // Scroll to section after navigation
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      });
    }
  }
}