# סטודיו יערה - Yaara Art Studio

אתר מודרני ללימודי ציור באנגולר 17, מעוצב במיוחד עבור סטודיו יערה - מרחב יצירתי לשיעורי ציור חווייתיים בליווי אישי.

## 🎨 תכונות

### עיצוב ותוכן
- **RTL עברי מלא** - תמיכה מלאה בעברית וכיוון ימין לשמאל
- **עיצוב מודרני** - מערכת עיצוב מותאמת אישית עם צבעים חמים ואווירה אמנותית
- **תוכן בעברית** - כל הטקסטים והממשק בעברית
- **אנימציות חלקות** - אפקטי מעבר, hover ופראלוקס

### רכיבים
- **Header** - ניווט עם תפריט נייד (דרייבר)
- **Hero** - סקציה ראשית עם CTA לשיעור ניסיון
- **About** - מידע על הסטודיו והגישה הייחודית
- **Pillars** - שלושת העמודים: מקצועיות, השראה, נוחות
- **Gallery** - גלריה אינטראקטיבית עם lightbox
- **Testimonials** - המלצות תלמידים
- **Registration Form** - טופס הרשמה לשיעור ניסיון
- **Footer** - קישורים ופרטי התקשרות

### תכונות טכניות
- **SEO מובנה** - Meta tags, Open Graph, JSON-LD
- **PWA Ready** - Manifest.json ו-service worker
- **Responsive Design** - מותאם לכל המכשירים
- **Accessibility** - תמיכה בנגישות וקוראי מסך
- **Future Payment Integration** - מוכן לשילוב Bit ו-PayBox

## 🚀 התקנה והרצה

### דרישות מקדימות
- Node.js (גרסה 18 או גבוהה יותר)
- npm או yarn
- Angular CLI 17

### התקנה
```bash
# הורדת התלויות
npm install

# הרצת השרת המקומי
ng serve

# בניית הפרויקט לייצור
ng build

# בנייה עם SSR
ng build --configuration production
```

### הרצה מקומית
```bash
ng serve
```
האתר יהיה זמין בכתובת: `http://localhost:4200`

## 🛠️ פיתוח

### מבנה הפרויקט
```
src/
├── app/
│   ├── components/
│   │   ├── header/          # רכיב הניווט
│   │   ├── hero/            # סקציה ראשית
│   │   ├── about/           # אודות הסטודיו
│   │   ├── pillars/         # שלושת העמודים
│   │   ├── gallery/         # גלריה אינטראקטיבית
│   │   ├── testimonials/    # המלצות
│   │   ├── form/            # טופס הרשמה
│   │   ├── footer/          # כותרת תחתונה
│   │   └── payment/         # תשלומים (עתידי)
│   ├── services/
│   │   └── payment.service.ts # שירות תשלומים
│   └── app.routes.ts        # נתיבי האפליקציה
├── styles.scss              # עיצוב גלובלי
└── index.html               # HTML ראשי
```

### עיצוב
- **צבעים**: Primary (#241A35), Secondary (#362947), Accent (#FFC9C9)
- **פונטים**: Frank Ruhl Libre (כותרות), Assistant (טקסט)
- **מערכת עיצוב**: CSS Custom Properties עם תמיכה ב-RTL

### שילוב תשלומים עתידי
הפרויקט כולל תשתית מוכנה לשילוב:
- **Bit Payment Gateway**
- **PayBox Payment Gateway**
- PaymentService עם ממשק API מוכן

## 📱 תמיכה במכשירים
- **Desktop** - Chrome, Firefox, Safari, Edge
- **Mobile** - iOS Safari, Chrome Mobile
- **Tablet** - iPad, Android tablets

## 🌐 SEO ונגישות
- **Meta Tags** - תיאורים ומילות מפתח בעברית
- **Open Graph** - שיתוף ברשתות חברתיות
- **JSON-LD** - נתונים מובנים עבור מנועי חיפוש
- **Accessibility** - ARIA labels, keyboard navigation
- **Performance** - אופטימיזציה למהירות טעינה

## 📞 יצירת קשר
- **טלפון**: 050-123-4567
- **אימייל**: info@yaaraartstudio.com
- **WhatsApp**: [קישור ישיר]
- **Instagram**: [@yaaraartstudio]

## 📄 רישיון
כל הזכויות שמורות © Yaara Art Studio 2025

---

**פותח באהבה עבור סטודיו יערה** 🎨✨