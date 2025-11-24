import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ArtClass {
  title: string;
  description: string;
  days: string;
  times: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-classes-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classes-background.component.html',
  styleUrl: './classes-background.component.scss'
})
export class ClassesBackgroundComponent {
  classes: ArtClass[] = [
    {
      title: 'תרגיל מתחלף - שיעור הדגל',
      description: 'זהו שיעור שמכוון למתקדמים. יהיו בו תרגילים מתחלפים, פעם בכמה שבועות. יהיו בהם מלא סוגים של רעיונות, טכניקות שונות להשתפר בהם, והמון מוטיבציה, השראה ואתגר. זה מקום מצויין לחפש את הנישה שלכם באומנות, לחדד את היצירתיות, לפתוח את הראש, ולהביא את העבודות שלכם צעד אחד קדימה.',
      days: 'ימי רביעי',
      times: ['18:00-19:30', '19:30-21:00'],
      imageUrl: 'https://github.com/user-attachments/assets/a7b893c4-365f-4585-9e73-dc89882cbe60'
    },
    {
      title: 'פורטרט',
      description: 'בשיעורים האלו אנחנו נתמקד בציור פנים במגוון סגנונות- עם דגש על ריאליזם. נלמד את כל האלמנטים השונים, מצבעים נכונים לעור הפנים, ועד לשיער ובדים. נעבוד בעיקר באקריליק ובצבעי שמן.',
      days: 'ימי שלישי',
      times: ['18:00-19:30', '19:30-21:00'],
      imageUrl: 'https://github.com/user-attachments/assets/688c4461-63c8-4485-ac54-133e08bb5ffc'
    },
    {
      title: 'רישום',
      description: 'שיעור זה מתאים גם למתחילים ומתעסק בשיפור ודיוק טכניקת הרישום, שהיא הבסיס החזק ביותר גם לכל שאר התחומים. נלמד איך להגיע לריאליזם ברמה גבוהה, גם מהתבוננות וגם מתמונה, בעזרת עפרונות ופחם.',
      days: 'ימי ראשון',
      times: ['18:00-19:30', '19:30-21:00'],
      imageUrl: 'https://github.com/user-attachments/assets/2b623d39-9c60-4f8f-b36c-00d253f4c89a'
    }
  ];
}

