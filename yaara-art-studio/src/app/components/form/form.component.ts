import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonToggleModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class FormComponent implements OnInit, OnChanges {
  @ViewChild('formElement') formElement!: ElementRef<HTMLFormElement>;
  @Input() viewMode: 'adult' | 'child' | 'both' = 'both';
  
  registrationForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  availableDates: string[] = [];
  availableTimes: string[] = ['18:00-19:30', '19:30-21:00'];

  // Formspree endpoints
  private readonly FORMSPREE_URL_ADULT = 'https://formspree.io/f/xovklpvr';
  private readonly FORMSPREE_URL_CHILDREN = 'https://formspree.io/f/mkogdnnb';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      selectedDate: ['', [Validators.required]],
      selectedTime: ['', [Validators.required]],
      background: ['', [Validators.required, Validators.minLength(2)]],
      classFor: ['', [Validators.required]] // בשביל מי השיעור
    });
    
    // Watch for changes in classFor and update dates/times accordingly (only when viewMode is 'both')
    this.registrationForm.get('classFor')?.valueChanges.subscribe(value => {
      if (this.viewMode === 'both' && value) {
        console.log('🔵 [Form] classFor value changed:', value);
        this.updateDatesAndTimes(value);
        // Reset selected date and time when class type changes
        this.registrationForm.patchValue({
          selectedDate: '',
          selectedTime: ''
        }, { emitEvent: false });
      }
    });
    
    // Check if Meta Pixel is loaded on component initialization
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.fbq) {
          console.log('✅ [Meta Pixel] fbq is available on form component init');
        } else {
          console.warn('⚠️ [Meta Pixel] fbq is NOT available on form component init');
        }
      }, 500);
    }
  }

  ngOnInit(): void {
    this.applyViewMode();
  }

  ngOnChanges(): void {
    this.applyViewMode();
  }

  private applyViewMode(): void {
    if (this.viewMode === 'adult') {
      this.registrationForm.patchValue({ classFor: 'בשבילי' });
      this.registrationForm.get('classFor')?.disable();
      this.updateDatesAndTimes('בשבילי');
    } else if (this.viewMode === 'child') {
      this.registrationForm.patchValue({ classFor: 'בשביל הילד שלי' });
      this.registrationForm.get('classFor')?.disable();
      this.updateDatesAndTimes('בשביל הילד שלי');
    } else {
      // both - enable toggle and initialize with adult
      this.registrationForm.get('classFor')?.enable();
      if (!this.registrationForm.get('classFor')?.value) {
        this.registrationForm.patchValue({ classFor: 'בשבילי' });
        this.updateDatesAndTimes('בשבילי');
      }
    }
  }

  /**
   * Update available dates and times based on classFor selection
   */
  private updateDatesAndTimes(classFor: string): void {
    if (classFor === 'בשביל הילד שלי') {
      // Children classes: Monday (1), Tuesday (2), Thursday (4)
      // Times: 15:00-16:30, 16:30-18:00
      // Start date: max(26.1.2026, today) - children classes open on 26.1.2026
      const childrenOpeningDate = new Date('2026-01-26');
      childrenOpeningDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = today > childrenOpeningDate ? today : childrenOpeningDate;
      
      this.availableDates = this.generateAvailableDates([1, 2, 4], startDate);
      this.availableTimes = ['15:00-16:30', '16:30-18:00'];
      console.log('🔵 [Form] Updated to children class schedule:', {
        dates: this.availableDates.length,
        times: this.availableTimes,
        startDate: startDate.toLocaleDateString('he-IL')
      });
    } else {
      // Adult classes: Sunday (0), Tuesday (2), Wednesday (3)
      // Times: 18:00-19:30, 19:30-21:00
      // Start from today (current behavior)
      this.availableDates = this.generateAvailableDates([0, 2, 3]);
      this.availableTimes = ['18:00-19:30', '19:30-21:00'];
      console.log('🔵 [Form] Updated to adult class schedule:', {
        dates: this.availableDates.length,
        times: this.availableTimes
      });
    }
  }

  /**
   * Generate available dates based on target days of the week
   * @param targetDays Array of day numbers (0=Sunday, 1=Monday, ..., 6=Saturday)
   * @param startDate Optional start date. If not provided, uses today's date
   */
  private generateAvailableDates(targetDays: number[], startDate?: Date): string[] {
    const dates: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Use provided startDate or default to today
    const start = startDate ? new Date(startDate) : new Date(today);
    start.setHours(0, 0, 0, 0);
    
    // Calculate two weeks from start date
    const twoWeeksFromStart = new Date(start);
    twoWeeksFromStart.setDate(start.getDate() + 14);
    
    // Dates to exclude
    const excludedDates = [
      new Date('2025-12-09'), // 9.12.2025
      new Date('2025-12-10')  // 10.12.2025
    ];
    excludedDates.forEach(d => d.setHours(0, 0, 0, 0));
    
    // Start from the calculated start date and go up to two weeks ahead
    const currentDate = new Date(start);
    
    while (currentDate <= twoWeeksFromStart) {
      const dayOfWeek = currentDate.getDay();
      
      // Check if this is one of our target days
      if (targetDays.includes(dayOfWeek)) {
        // Check if this date should be excluded
        const shouldExclude = excludedDates.some(excluded => {
          return currentDate.getTime() === excluded.getTime();
        });
        
        if (!shouldExclude) {
          const dateStr = currentDate.toLocaleDateString('he-IL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          dates.push(dateStr);
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log('🔵 [Form] Generated dates for target days:', targetDays, 'Start date:', start.toLocaleDateString('he-IL'), 'Total dates:', dates.length);
    return dates;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    console.log('Form submission started');
    console.log('Form valid:', this.registrationForm.valid);
    console.log('Form value:', this.registrationForm.value);
    console.log('Form errors:', this.registrationForm.errors);
    
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      console.log('Form is valid, submitting...');
      
      // Use getRawValue() to include disabled controls (needed when viewMode is set)
      const formData = this.registrationForm.getRawValue();
      // Combine date and time for lessonDate
      const lessonDate = `${formData.selectedDate} ${formData.selectedTime}`;
      console.log('🔵 [Form] Data being sent to Formspree:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        lessonDate: lessonDate,
        background: formData.background,
        classFor: formData.classFor
      });
      console.log('🔵 [Form] Selected classFor option:', formData.classFor);
      
      // Submit the form using fetch API
      this.submitToFormspree();
    } else {
      console.log('Form is invalid, showing validation errors');
      console.log('Form control errors:', this.getFormErrors());
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private async submitToFormspree(): Promise<void> {
    const formData = this.registrationForm.value;
    
    // Combine date and time for lessonDate
    const lessonDate = `${formData.selectedDate} ${formData.selectedTime}`;
    
    // Determine which Formspree endpoint to use based on classFor selection
    const formspreeUrl = formData.classFor === 'בשביל הילד שלי' 
      ? this.FORMSPREE_URL_CHILDREN
      : this.FORMSPREE_URL_ADULT;
    
    console.log('🔵 [Form] Preparing to submit form to Formspree with data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      lessonDate: lessonDate,
      background: formData.background,
      classFor: formData.classFor
    });
    console.log('🔵 [Form] Selected classFor:', formData.classFor);
    console.log('🔵 [Form] Using Formspree URL:', formspreeUrl);
    
    // Create FormData object for Formspree
    const formDataToSend = new FormData();
    formDataToSend.append('_subject', 'הרשמה חדשה לשיעור ניסיון - סטודיו בודה');
    formDataToSend.append('_replyto', 'noreply@studiobuda.co.il');
    formDataToSend.append('_captcha', 'false');
    formDataToSend.append('firstName', formData.firstName || '');
    formDataToSend.append('lastName', formData.lastName || '');
    formDataToSend.append('phone', formData.phone || '');
    formDataToSend.append('lessonDate', lessonDate || '');
    formDataToSend.append('background', formData.background || '');
    formDataToSend.append('classFor', formData.classFor || '');
    
    console.log('🔵 [Form] Sending data to Formspree...');
    // Log FormData contents for debugging
    const formDataEntries: string[] = [];
    formDataToSend.forEach((value, key) => {
      formDataEntries.push(`${key}: ${value}`);
    });
    console.log('🔵 [Form] FormData contents:', formDataEntries);
    
    try {
      const response = await fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Formspree response status:', response.status);
      console.log('Formspree response ok:', response.ok);
      
      if (response.ok) {
        console.log('Form submitted successfully to Formspree!');
        const result = await response.json();
        console.log('Formspree response:', result);
        
        // Track Meta Pixel Lead event
        console.log('🔵 [Meta Pixel] About to track Lead event...');
        this.trackMetaPixelLead();
        
        // Save form data to localStorage before navigating to payment
        const formData = this.registrationForm.value;
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const nowIso = new Date().toISOString();
        
        localStorage.setItem('formFirstName', formData.firstName || '');
        localStorage.setItem('formLastName', formData.lastName || '');
        localStorage.setItem('formFullName', fullName);
        localStorage.setItem('formPhone', formData.phone || '');
        localStorage.setItem('formLessonDate', lessonDate || '');
        localStorage.setItem('formBackground', formData.background || '');
        localStorage.setItem('formClassFor', formData.classFor || '');
        localStorage.setItem('formSubmissionTime', nowIso);
        
        // Redirect based on "סוג השיעור" (classFor): children → Smartbee; adults → existing payment page
        const classFor = this.registrationForm.getRawValue().classFor || '';
        this.isSubmitting = false;
        this.registrationForm.reset();
        if (classFor === 'בשביל הילד שלי') {
          // שיעורי ילדים ונוער → Smartbee payment page
          window.location.href = 'https://smartbee.co.il/public-pages/?redirect-path=pay/69a2ef381b25b0a8f0d555ed';
        } else {
          // שיעורי בוגרים → existing payment flow
          this.router.navigate(['/payments']);
        }
      } else {
        console.error('Form submission failed:', response.status, response.statusText);
        const error = await response.text();
        console.error('Error details:', error);
        
        // Show error message to user
        this.isSubmitting = false;
        alert('שגיאה בשליחת הטופס. אנא נסו שוב או צרו קשר בטלפון.');
      }
    } catch (error) {
      console.error('Network error submitting form:', error);
      this.isSubmitting = false;
      alert('שגיאת רשת. אנא בדקו את החיבור לאינטרנט ונסו שוב.');
    }
  }

  /**
   * Track Meta Pixel Lead event
   */
  private trackMetaPixelLead(): void {
    console.log('🔵 [Meta Pixel] trackMetaPixelLead called');
    
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('🔵 [Meta Pixel] Not in browser platform, skipping');
      return;
    }

    console.log('🔵 [Meta Pixel] Checking if fbq is available...');
    console.log('🔵 [Meta Pixel] typeof window:', typeof window);
    console.log('🔵 [Meta Pixel] window.fbq exists:', typeof window !== 'undefined' && !!window.fbq);
    console.log('🔵 [Meta Pixel] window.fbq type:', typeof window !== 'undefined' && window.fbq ? typeof window.fbq : 'N/A');

    // Check if fbq is available on window object
    if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
      try {
        console.log('🔵 [Meta Pixel] Calling fbq("track", "Lead")...');
        // Call fbq to track Lead event
        window.fbq('track', 'Lead');
        console.log('✅ [Meta Pixel] Lead event tracked successfully!');
      } catch (error) {
        console.error('❌ [Meta Pixel] Error tracking Meta Pixel Lead event:', error);
      }
    } else {
      console.warn('⚠️ [Meta Pixel] fbq is not available or not a function');
      console.warn('⚠️ [Meta Pixel] This might mean Meta Pixel script has not loaded yet');
      
      // Try to wait a bit and retry (in case script is still loading)
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
          console.log('🔵 [Meta Pixel] Retry: Calling fbq("track", "Lead")...');
          try {
            window.fbq('track', 'Lead');
            console.log('✅ [Meta Pixel] Lead event tracked successfully on retry!');
          } catch (error) {
            console.error('❌ [Meta Pixel] Error on retry:', error);
          }
        } else {
          console.error('❌ [Meta Pixel] fbq still not available after retry');
        }
      }, 1000);
    }
  }
}
