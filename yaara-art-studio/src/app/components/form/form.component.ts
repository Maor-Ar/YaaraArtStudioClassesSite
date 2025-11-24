import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  lessonOptions: string[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.lessonOptions = this.generateLessonOptions();
    
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      lessonDate: ['', [Validators.required]],
      background: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  private generateLessonOptions(): string[] {
  const options: string[] = [];
  const today = new Date();
  const studioOpeningDate = new Date('2025-12-07'); // Studio opening date
  
  // Determine the starting Sunday
  let startingSunday: Date;
  
  if (today < studioOpeningDate) {
    // Before studio opens, start with December 7, 2025 (first Sunday)
    startingSunday = new Date('2025-12-07');
  } else {
    // After studio opens, find the next Sunday from today
    startingSunday = new Date(today);
    const daysUntilSunday = (7 - today.getDay()) % 7; // Sunday is day 0
    if (daysUntilSunday === 0 && today.getDay() === 0) {
      // If today is Sunday, check if we should include it or move to next Sunday
      // Include today only if it's still before the first class time
      const todayTime = today.getHours() * 60 + today.getMinutes();
      if (todayTime >= 18 * 60) {
        // After 18:00, move to next Sunday
        startingSunday.setDate(today.getDate() + 7);
      }
    } else {
      startingSunday.setDate(today.getDate() + daysUntilSunday);
    }
  }
  
  // Generate options for next 2 Sundays
  for (let i = 0; i < 2; i++) {
    const sunday = new Date(startingSunday);
    sunday.setDate(startingSunday.getDate() + (i * 7));
    
    const dateStr = sunday.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    // Add two time slots for each Sunday
    options.push(`${dateStr} 18:00-19:30`);
    options.push(`${dateStr} 19:30-21:00`);
  }
  
  return options;
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
      console.log('Data being sent to Formspree:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        experience: formData.experience,
        lessonType: formData.lessonType,
        lessonDate: formData.lessonDate,
        message: formData.message
      });
      
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
    
    console.log('Preparing to submit form to Formspree with data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      lessonDate: formData.lessonDate,
      background: formData.background
    });
    
    // Create FormData object for Formspree
    const formDataToSend = new FormData();
    formDataToSend.append('_subject', 'הרשמה חדשה לשיעור ניסיון - סטודיו בודה');
    formDataToSend.append('_replyto', 'noreply@studiobuda.co.il');
    formDataToSend.append('_captcha', 'false');
    formDataToSend.append('firstName', formData.firstName || '');
    formDataToSend.append('lastName', formData.lastName || '');
    formDataToSend.append('phone', formData.phone || '');
    formDataToSend.append('lessonDate', formData.lessonDate || '');
    formDataToSend.append('background', formData.background || '');
    
    console.log('Sending data to Formspree...');
    
    try {
      const response = await fetch('https://formspree.io/f/xovklpvr', {
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
        
        // Save form data to localStorage before navigating to payment
        const formData = this.registrationForm.value;
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const nowIso = new Date().toISOString();
        
        localStorage.setItem('formFirstName', formData.firstName || '');
        localStorage.setItem('formLastName', formData.lastName || '');
        localStorage.setItem('formFullName', fullName);
        localStorage.setItem('formPhone', formData.phone || '');
        localStorage.setItem('formLessonDate', formData.lessonDate || '');
        localStorage.setItem('formBackground', formData.background || '');
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
}
