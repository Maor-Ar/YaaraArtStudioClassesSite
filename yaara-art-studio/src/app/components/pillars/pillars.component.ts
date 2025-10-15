import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pillars',
  standalone: true,
  templateUrl: './pillars.component.html',
  styleUrl: './pillars.component.scss'
})
export class PillarsComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}