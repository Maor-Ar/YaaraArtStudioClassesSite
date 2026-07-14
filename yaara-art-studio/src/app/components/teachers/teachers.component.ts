import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Teacher {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  role?: string;
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss',
})
export class TeachersComponent {
  private readonly collapsedHeightPx = 115;

  expandedIds = new Set<string>();

  readonly teachers: Teacher[] = [
    {
      id: 'shira',
      name: 'שירה אלן',
      imageUrl: 'assets/images/shira.jpeg',
      role: 'מורה בסטודיו',
      bio: 'אני מציירת ויוצרת מאז שאני זוכרת את עצמי, והאומנות תמיד הייתה חלק משמעותי מהחיים שלי. לאורך השנים התנסיתי במגוון רחב של תחומים וטכניקות, מתוך סקרנות, אהבה ליצירה ורצון מתמיד ללמוד ולהתפתח. למדתי במגמת עיצוב תעשייתי ובהמשך השלמתי תואר ראשון בהוראת אומנויות העיצוב. במהלך הלימודים נחשפתי לעולמות יצירה רבים ולעבודה עם חומרים, מדיומים וטכניקות מגוונות, מה שהעניק לי הסתכלות רחבה על אומנות ועל תהליכי יצירה. אני מאמינה שהדרך הטובה ביותר ללמוד היא דרך העשייה עצמה. לכן בשיעורים שלי אני שמה דגש על התנסות ותרגול מתמיד, מתוך הבנה שהביטחון והמיומנות נבנים תוך כדי עבודה. חשוב לי ליצור מרחב נעים ומעודד שבו אפשר ללמוד, להתנסות, לטעות, להשתפר ובעיקר ליהנות מהתהליך.',
    },
    {
      id: 'noa',
      name: 'נועה קרני',
      imageUrl: 'assets/images/Noa.jpeg',
      role: 'ילדים ונוער',
      bio: 'היצירה מלווה אותי כבר הרבה שנים. בשבילי ציור הוא לא רק תוצאה יפה, אלא דרך לבטא, להירגע, להתפתח ולהאמין בעצמנו קצת יותר. פתחתי את החוג של הילדים והנוער לאחר עבודה ממושכת עם אותם גילאים, וגיליתי כמה שהתהליך משמעותי, ולא רק בשבילם. כשהם יוצרים אני רואה שינויים מדהימים, הם משתחררים, נפתחים, מדמיינים, נרגעים, הבטחון שלהם עולה ואיתו גם לאט לאט הסבלנות. רציתי לתת להם מקום לביטוי עצמי אמיתי, דבר שהם לא מקבלים תמיד במסגרות אחרות. הגישה שלי לכל אחד מהציירים שאני מלמדת היא יחס אישי, מקום לטעות, סבלנות בשפע, התקדמות בקצב אישי, חוויה נעימה ורגועה ושילוב בין טכניקה לדמיון. אני רואה שהתהליכים הללו עוזרים להם לפתח את כושר ההתמדה, הסבלנות, היכולת להתמודד עם טעויות, בטחון בעצמם וחופש ביטוי. החלום שלי הוא שכל ילד וילדה, נער ונערה שייכנסו לסטודיו ירגישו שיש להם מקום ליצור, לנסות, לטעות, להשתפר - ובעיקר ליהנות ממה שהם עושים. ואם אתם חדשים כאן, אשמח שנתחיל את המסע הזה ביחד.',
    },
    {
      id: 'yaara',
      name: 'יערה בודה',
      imageUrl: 'assets/images/Yaara.jpeg',
      role: 'מייסדת הסטודיו',
      bio: 'האהבה שלי לאמנות התחילה במקרה כשהתנסיתי בציור בסטודיו פרטי שעם הזמן נהיה המקום שלימד אותי הכי הרבה. רכשתי יסודות חזקים ובכלל את האהבה שלי לציור. בהמשך העמקתי את הידע שלי דרך קורסים בבצלאל והתנסויות מגוונות בעולם האמנות. לאורך השנים עסקתי בפרויקטים שונים, ביניהם ציורי חופות וציור באירועים, קריקטורות, יצירת סקיצות לקעקועים, ציורים בהזמנה אישית והשתתפות בתערוכות. כל אחד מהתחומים הללו אפשר לי לפגוש אנשים דרך האומנות ולגלות עד כמה יצירה מדויקת משפיעה על אנשים. את הסטודיו הקמתי מתוך רצון ליצור מקום שמאפשר לכל אדם לפתח את הצד הזה שלו. למצוא תחביב חדש, או להמשיך להתפתח גם אחרי הבסיס ברמה גבוהה. ובעיקר למצוא את המקום שיעשה לכם שקט בלב.',
    },
  ];

  isExpanded(id: string): boolean {
    return this.expandedIds.has(id);
  }

  toggleExpand(id: string, clipEl: HTMLElement): void {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.expandedIds.has(id)) {
      this.collapseBio(id, clipEl, prefersReduced);
    } else {
      this.expandBio(id, clipEl, prefersReduced);
    }
  }

  trackById(_: number, teacher: Teacher): string {
    return teacher.id;
  }

  private expandBio(id: string, clipEl: HTMLElement, reducedMotion: boolean): void {
    // Measure unrestricted content height (clipped scrollHeight can be wrong)
    clipEl.style.height = 'auto';
    const fullHeight = clipEl.scrollHeight;
    clipEl.style.height = `${this.collapsedHeightPx}px`;

    this.expandedIds = new Set(this.expandedIds).add(id);

    if (reducedMotion) {
      clipEl.style.height = 'auto';
      return;
    }

    // Force reflow so the browser registers the collapsed start value
    void clipEl.offsetHeight;
    clipEl.style.height = `${fullHeight}px`;

    const onEnd = (event: TransitionEvent): void => {
      if (event.propertyName !== 'height') {
        return;
      }
      clipEl.style.height = 'auto';
      clipEl.removeEventListener('transitionend', onEnd);
    };
    clipEl.addEventListener('transitionend', onEnd);
  }

  private collapseBio(id: string, clipEl: HTMLElement, reducedMotion: boolean): void {
    if (reducedMotion) {
      this.expandedIds = new Set([...this.expandedIds].filter((x) => x !== id));
      clipEl.style.height = `${this.collapsedHeightPx}px`;
      return;
    }

    // From auto/full → explicit px, then down to collapsed
    clipEl.style.height = `${clipEl.scrollHeight}px`;
    void clipEl.offsetHeight;
    clipEl.style.height = `${this.collapsedHeightPx}px`;

    const onEnd = (event: TransitionEvent): void => {
      if (event.propertyName !== 'height') {
        return;
      }
      this.expandedIds = new Set([...this.expandedIds].filter((x) => x !== id));
      clipEl.removeEventListener('transitionend', onEnd);
    };
    clipEl.addEventListener('transitionend', onEnd);
  }
}
