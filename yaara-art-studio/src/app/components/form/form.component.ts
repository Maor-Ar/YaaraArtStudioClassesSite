import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

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

  constructor(private fb: FormBuilder) {
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
      
      // Let Formspree handle the actual submission
      // We'll show success message after a short delay
      setTimeout(() => {
        console.log('Form submission completed (simulated)');
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        this.registrationForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }, 1000);
      
      // Submit the form using HTML form submission (Formspree doesn't allow AJAX without custom key)
      this.submitFormToFormspree();
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

  private submitFormToFormspree(): void {
    const formData = this.registrationForm.value;
    const form = this.formElement.nativeElement;
    
    console.log('Preparing to submit form to Formspree with data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      experience: formData.experience,
      lessonType: formData.lessonType,
      lessonDate: formData.lessonDate,
      message: formData.message
    });
    
    // Update the form fields with the actual values from Angular reactive form
    const firstNameInput = form.querySelector('[name="firstName"]') as HTMLInputElement;
    const lastNameInput = form.querySelector('[name="lastName"]') as HTMLInputElement;
    const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;
    const experienceSelect = form.querySelector('[name="experience"]') as HTMLSelectElement;
    const lessonTypeSelect = form.querySelector('[name="lessonType"]') as HTMLSelectElement;
    const lessonDateSelect = form.querySelector('[name="lessonDate"]') as HTMLSelectElement;
    const messageTextarea = form.querySelector('[name="message"]') as HTMLTextAreaElement;
    
    if (firstNameInput) firstNameInput.value = formData.firstName || '';
    if (lastNameInput) lastNameInput.value = formData.lastName || '';
    if (phoneInput) phoneInput.value = formData.phone || '';
    if (experienceSelect) experienceSelect.value = formData.experience || '';
    if (lessonTypeSelect) lessonTypeSelect.value = formData.lessonType || '';
    if (lessonDateSelect) lessonDateSelect.value = formData.lessonDate || '';
    if (messageTextarea) messageTextarea.value = formData.message || '';
    
    console.log('Form fields updated, submitting to Formspree...');
    
    // Submit the form (this will cause a page redirect to Formspree)
    setTimeout(() => {
      form.submit();
    }, 2000); // Give time for success message to show
  }
}