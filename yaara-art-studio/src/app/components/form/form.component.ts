import { Component, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
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
export class FormComponent {
  @ViewChild('formElement') formElement!: ElementRef<HTMLFormElement>;
  
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
    
    // Initialize with adult class dates/times (default)
    this.updateDatesAndTimes('בשבילי');
    
    // Watch for changes in classFor and update dates/times accordingly
    this.registrationForm.get('classFor')?.valueChanges.subscribe(value => {
      console.log('🔵 [Form] classFor value changed:', value);
      if (value) {
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

  /**
   * Update available dates and times based on classFor selection
   */
  private updateDatesAndTimes(classFor: string): void {
    if (classFor === 'בשביל הילד שלי') {
      // Children classes: Monday (1), Tuesday (2), Thursday (4)
      // Times: 15:00-16:30, 16:30-18:00
      this.availableDates = this.generateAvailableDates([1, 2, 4]);
      this.availableTimes = ['15:00-16:30', '16:30-18:00'];
      console.log('🔵 [Form] Updated to children class schedule:', {
        dates: this.availableDates.length,
        times: this.availableTimes
      });
    } else {
      // Adult classes: Sunday (0), Tuesday (2), Wednesday (3)
      // Times: 18:00-19:30, 19:30-21:00
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
   */
  private generateAvailableDates(targetDays: number[]): string[] {
    const dates: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate two weeks from today
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    
    // Dates to exclude
    const excludedDates = [
      new Date('2025-12-09'), // 9.12.2025
      new Date('2025-12-10')  // 10.12.2025
    ];
    excludedDates.forEach(d => d.setHours(0, 0, 0, 0));
    
    // Start from today and go up to two weeks ahead
    const currentDate = new Date(today);
    
    while (currentDate <= twoWeeksFromNow) {
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
    
    console.log('🔵 [Form] Generated dates for target days:', targetDays, 'Total dates:', dates.length);
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
      
      // Log form data that will be sent to Formspree
      const formData = this.registrationForm.value;
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
        
        // Navigate to payment page
        this.isSubmitting = false;
        this.registrationForm.reset();
        this.router.navigate(['/payments']);
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
