import { Component, Inject, PLATFORM_ID, Input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, PopupComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() viewMode: 'adult' | 'child' | 'both' = 'both';
  showPrivacyPopup = false;
  showTermsPopup = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  privacyPolicyContent = `
    <h1>מדיניות פרטיות</h1>
    <h2>1. מבוא</h2>
    <p>מדיניות פרטיות זו מפרטת כיצד אנו אוספים, משתמשים ומגייסים את המידע האישי של המשתמשים באתר סטודיו בודה ("האתר", "אנו", "שלנו"). מדיניות זו חלה על כל המידע הנמסר לנו, בין אם במהלך השימוש באתר ובין אם במהלך הרשמה לשירותים השונים.</p>
    
    <h2>2. איסוף מידע אישי</h2>
    <p><strong>2.1</strong> בעת השימוש באתר, אנו עשויים לאסוף מידע אישי, כגון: שם, כתובת דוא"ל, פרטי יצירת קשר, פרטי תשלום, ומידע נוסף הנדרש לצורך מתן השירותים.</p>
    <p><strong>2.2</strong> המידע הנאסף ישמש לשם מתן שירותים, יצירת קשר עם המשתמש, ושיפור חוויית השימוש באתר.</p>
    
    <h2>3. שימוש במידע אישי</h2>
    <p><strong>3.1</strong> המידע שנאסף ישמש אך ורק לצורך מטרותיו של האתר, כולל אך לא מוגבל לתקשורת עם המשתמש, חיוב בגין קורסים, משלוח חומר לימוד או מידע נוסף, וכן לצורך התאמת השירותים להעדפות המשתמש.</p>
    <p><strong>3.2</strong> ייתכן ונשתף מידע אישי עם צדדים שלישיים במקרים הבאים:</p>
    <ul>
      <li>במקרה של בקשות משפטיות או דרישה לפי החוק.</li>
      <li>במקרים של שיתוף פעולה עם ספקי שירותים חיצוניים, אשר מסייעים לנו במתן השירותים (כגון חברות סליקת תשלומים).</li>
    </ul>
    
    <h2>4. שמירה על המידע</h2>
    <p><strong>4.1</strong> אנו ננקוט באמצעי אבטחה סבירים כדי להגן על המידע האישי שהוזן באתר.</p>
    <p><strong>4.2</strong> למרות המאמצים שלנו, לא ניתן להבטיח הגנה מלאה על המידע, ואנו לא נהיה אחראים לכל נזק שיגרם כתוצאה משימוש לרעה במידע.</p>
    
    <h2>5. שימוש בעוגיות (Cookies)</h2>
    <p>האתר משתמש בקובצי עוגיות ("Cookies") כדי לשפר את חוויית השימוש של המשתמש. הקובצים עשויים לכלול מידע אודות הממשק, הגדרות המשתמש, ומידע נוסף שיסייע לנו לשפר את השירותים שלנו.</p>
    
    <h2>6. זכויות המשתמש</h2>
    <p><strong>6.1</strong> למשתמש יש את הזכות לבקש לעדכן, לתקן או למחוק את המידע האישי שנמצא ברשותנו.</p>
    <p><strong>6.2</strong> המשתמש יכול לבחור שלא לקבל דיוורים שיווקיים על ידי עדכון ההגדרות בחשבון האישי או על ידי פנייה ישירה אלינו.</p>
    
    <h2>7. שינויים במדיניות פרטיות</h2>
    <p>אנו שומרים על הזכות לשנות את מדיניות הפרטיות בכל עת, וללא הודעה מראש. כל שינוי ייכנס לתוקף מרגע פרסומו באתר.</p>
    
    <h2>8. פניות</h2>
    <p>באם יש לך שאלות אודות מדיניות הפרטיות שלנו, אתה מוזמן לפנות אלינו בכתובת דוא"ל: yaarabuda1@gmail.com.</p>
  `;

  termsOfServiceContent = `
    <h1>תנאי שימוש</h1>
    <h2>1. מבוא</h2>
    <p>ברוכים הבאים לאתר סטודיו בודה ("האתר", "אנו", "שלנו"), המציע קורסים, שיעורים וסדנאות ציור. כל שימוש באתר ובשירותים הניתנים בו כפוף לתנאים המפורטים במסמך זה. כל אדם המשתמש באתר מאשר כי הוא קרא, הבין ומסכים להיכנס להסכם זה.</p>
    
    <h2>2. זכויות יוצרים</h2>
    <p>כל התוכן המוצג באתר, לרבות אך לא מוגבל לתמונות, טקסטים, גרפיקה, לוגו, וידאו, שיטות לימוד וכולי, מוגן בזכויות יוצרים והינו רכושו של האתר או של צדדים שלישיים, ואין להעתיק, לשכפל או להפיץ את התוכן ללא הסכמתנו המפורשת בכתב.</p>
    
    <h2>3. גישה לשירותים</h2>
    <p><strong>3.1</strong> השימוש בשירותי האתר מותנה בהרשמה מראש ו/או יצירת חשבון אישי.</p>
    <p><strong>3.2</strong> המשתמש מתחייב כי כל המידע שסיפק במסגרת ההרשמה נכון, מדויק ומעודכן.</p>
    <p><strong>3.3</strong> אנו שומרים על הזכות לשלול את גישת המשתמש לאתר במקרה של הפרת תנאי השימוש או כל פעילות שמפרה את החוק.</p>
    
    <h2>4. מדיניות תשלום והחזרות</h2>
    <p><strong>4.1</strong> כל המחירים המופיעים באתר הם בשקלים חדשים וכוללים מע"מ, אלא אם כן צוין אחרת.</p>
    <p><strong>4.2</strong> תשלום עבור קורסים וסדנאות יתבצע מראש באמצעות אמצעי התשלום הזמינים באתר.</p>
    <p><strong>4.3</strong> בקשה להחזר כספי תתבצע בהתאם לתנאי הביטול של כל קורס או סדנא כפי שמופיעים בעת הרכישה.</p>
    
    <h2>5. תנאי ביטול</h2>
    <p><strong>5.1</strong> ביטול הרשמה לקורס או סדנה יכול להתבצע בתוך 7 ימים ממועד ההרשמה, בכפוף לתנאים המפורטים בדף הקורס.</p>
    <p><strong>5.2</strong> במקרה של ביטול לאחר הזמן הנדרש, ייתכן ולא יינתן החזר כספי, או שההחזר יהיה חלקי בלבד.</p>
    
    <h2>6. אחריות</h2>
    <p><strong>6.1</strong> השימוש באתר ובשירותיו הינו על אחריות המשתמש בלבד.</p>
    <p><strong>6.2</strong> האתר עושה כל מאמץ לספק שירותים ברמה הגבוהה ביותר, אך איננו אחראים לכל נזק ישיר או עקיף שייגרם למשתמש בעקבות השימוש בשירותים המוצעים באתר.</p>
    
    <h2>7. שינויי תנאי השימוש</h2>
    <p>אנו שומרים על הזכות לשנות את תנאי השימוש בכל עת, וללא הודעה מוקדמת. כל שינוי בתנאים יפורסם באתר ויתחייב מרגע פרסומו.</p>
    
    <h2>8. סיום השימוש</h2>
    <p>המשתמש רשאי להפסיק את השימוש באתר בכל עת, ואנו שומרים על הזכות להפסיק את השימוש מצדנו במקרה של הפרת תנאי השימוש.</p>
    
    <h2>9. כללי</h2>
    <p><strong>9.1</strong> תנאי שימוש אלו כפופים לחוקי מדינת ישראל, והם יפות לכל הליך משפטי שיתקיים במדינה זו.</p>
    <p><strong>9.2</strong> כל מחלוקת הנוגעת לשימוש באתר תועבר להכרעה בלעדית לבית המשפט המוסמך בתל אביב.</p>
  `;

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
    
    // Preserve query parameters
    const queryParams = this.route.snapshot.queryParams;
    
    if (!isMainPage) {
      // Navigate to main page with fragment and query params
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

  openPrivacyPopup(): void {
    this.showPrivacyPopup = true;
  }

  openTermsPopup(): void {
    this.showTermsPopup = true;
  }

  closePrivacyPopup(): void {
    this.showPrivacyPopup = false;
  }

  closeTermsPopup(): void {
    this.showTermsPopup = false;
  }

  navigateToPayments(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    // Preserve query parameters when navigating to payments
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['/payments'], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }
}