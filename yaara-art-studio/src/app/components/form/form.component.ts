import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaymentComponent],
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
  showPaymentButtons = false;
  lessonOptions: string[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.lessonOptions = this.generateLessonOptions();
    
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      experience: [''],
      lessonType: [''],
      lessonDate: [''],
      message: ['']
    });
  }

  private generateLessonOptions(): string[] {
    const options: string[] = [];
    const today = new Date();
    
    // Find the next Tuesday
    let nextTuesday = new Date(today);
    const daysUntilTuesday = (2 - today.getDay() + 7) % 7; // Tuesday is day 2
    if (daysUntilTuesday === 0 && today.getDay() !== 2) {
      nextTuesday.setDate(today.getDate() + 7); // If today is Tuesday, get next Tuesday
    } else {
      nextTuesday.setDate(today.getDate() + daysUntilTuesday);
    }
    
    // Generate options for next 2 Tuesdays
    for (let i = 0; i < 2; i++) {
      const tuesday = new Date(nextTuesday);
      tuesday.setDate(nextTuesday.getDate() + (i * 7));
      
      const dateStr = tuesday.toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      // Add two time slots for each Tuesday
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
      experience: formData.experience,
      lessonType: formData.lessonType,
      lessonDate: formData.lessonDate,
      message: formData.message
    });
    
    // Create FormData object for Formspree
    const formDataToSend = new FormData();
    formDataToSend.append('_subject', 'הרשמה חדשה לשיעור ניסיון - סטודיו יערה');
    formDataToSend.append('_replyto', 'noreply@yaaraartstudio.com');
    formDataToSend.append('_captcha', 'false');
    formDataToSend.append('firstName', formData.firstName || '');
    formDataToSend.append('lastName', formData.lastName || '');
    formDataToSend.append('phone', formData.phone || '');
    formDataToSend.append('experience', formData.experience || '');
    formDataToSend.append('lessonType', formData.lessonType || '');
    formDataToSend.append('lessonDate', formData.lessonDate || '');
    formDataToSend.append('message', formData.message || '');
    
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
        
        // Show payment buttons instead of success message
        this.isSubmitting = false;
        this.showPaymentButtons = true;
        this.registrationForm.reset();
        
        // Navigate to payment section
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
   * Handle payment success - show success message and navigate back
   */
  onPaymentSuccess(): void {
    this.showPaymentButtons = false;
    this.showSuccessMessage = true;
    
    // Hide success message after 5 seconds and navigate back to form
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.router.navigate(['/'], { fragment: 'contact' });
    }, 5000);
  }
}