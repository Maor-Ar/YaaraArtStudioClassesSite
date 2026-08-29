import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaPixelService } from '../../services/meta-pixel.service';

@Component({
  selector: 'app-workshop-lead-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workshop-lead-form.component.html',
  styleUrl: './workshop-lead-form.component.scss'
})
export class WorkshopLeadFormComponent {
  @Input() instanceId = 'register';
  @Input() heading = 'ממלאים פרטים ונחזור אליכם לבדיקת התאמה';
  @Input() showSchedule = true;
  @Input() closingLine = '';

  leadForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  submitError = '';

  private readonly formspreeUrl = 'https://formspree.io/f/xovklpvr';

  constructor(
    private fb: FormBuilder,
    private metaPixel: MetaPixelService
  ) {
    this.leadForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      message: ['']
    });
  }

  get firstNameId(): string {
    return `workshop-firstName-${this.instanceId}`;
  }

  get lastNameId(): string {
    return `workshop-lastName-${this.instanceId}`;
  }

  get phoneId(): string {
    return `workshop-phone-${this.instanceId}`;
  }

  get messageId(): string {
    return `workshop-message-${this.instanceId}`;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.leadForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
    this.submitError = '';
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const value = this.leadForm.getRawValue();
    const formData = new FormData();
    formData.append('_subject', 'הרשמה לקורס ארגז כלים לציור');
    formData.append('_captcha', 'false');
    formData.append('firstName', value.firstName || '');
    formData.append('lastName', value.lastName || '');
    formData.append('phone', value.phone || '');
    formData.append('message', value.message || '');
    formData.append('course', 'ארגז כלים לציור');

    try {
      const response = await fetch(this.formspreeUrl, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        this.metaPixel.trackLead({
          content_name: 'ארגז כלים לציור',
          content_category: 'BeginnerArtistWorkshop'
        });
        this.showSuccessMessage = true;
        this.leadForm.reset();
      } else {
        this.submitError = 'שגיאה בשליחת הטופס. אנא נסו שוב או צרו קשר בטלפון.';
      }
    } catch {
      this.submitError = 'שגיאת רשת. אנא בדקו את החיבור לאינטרנט ונסו שוב.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
