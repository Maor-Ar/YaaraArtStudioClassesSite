import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { PillarsComponent } from './components/pillars/pillars.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { FormComponent } from './components/form/form.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    PillarsComponent,
    GalleryComponent,
    TestimonialsComponent,
    FormComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Yaara Art Studio';
  showWhatsAppButton = true;
  private lastScrollY = 0;

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Initialize theme service only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.themeService.getCurrentTheme();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const currentScrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercentage = (currentScrollY + windowHeight) / documentHeight;
    
    // Hide button when at bottom of page (95% scrolled)
    if (scrollPercentage >= 0.95) {
      this.showWhatsAppButton = false;
    } else {
      // Show button when scrolling up or not at bottom
      this.showWhatsAppButton = true;
    }
    
    this.lastScrollY = currentScrollY;
  }
}