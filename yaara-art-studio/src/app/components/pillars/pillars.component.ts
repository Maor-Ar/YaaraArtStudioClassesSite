import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pillars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pillars.component.html',
  styleUrl: './pillars.component.scss'
})
export class PillarsComponent {
  @Input() viewMode: 'adult' | 'child' | 'both' = 'both';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Check if we're on the main page or need to navigate there first
    const currentRoute = this.router.url.split('?')[0];
    const isMainPage = currentRoute === '/' || currentRoute === '';
    
    if (!isMainPage) {
      // Navigate to main page with fragment and query params
      const queryParams = this.route.snapshot.queryParams;
      this.router.navigate(['/'], {
        fragment: sectionId,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      });
    } else {
      // Preserve query parameters
      const queryParams = this.route.snapshot.queryParams;
      
      // Navigate with fragment and query params preserved
      this.router.navigate([], {
        fragment: sectionId,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }).then(() => {
        // Scroll to section after navigation
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      });
    }
  }
}