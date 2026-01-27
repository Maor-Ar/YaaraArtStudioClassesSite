import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  constructor(
    public themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  getLogoSrc(): string {
    return this.themeService.isDark()
      ? 'assets/images/LogoDarkPurpleBG.jpeg'
      : 'assets/images/LogoLightPinkBG.jpeg';
  }

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
    
    // Preserve query parameters
    const queryParams = this.route.snapshot.queryParams;
    
    if (!isMainPage) {
      // Navigate to main page with fragment and query params
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