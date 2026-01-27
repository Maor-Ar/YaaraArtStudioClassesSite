import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { AboutComponent } from '../../components/about/about.component';
import { PillarsComponent } from '../../components/pillars/pillars.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { ClassesAlternatingComponent } from '../../components/classes-alternating/classes-alternating.component';
import { ClassesBackgroundComponent } from '../../components/classes-background/classes-background.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    PillarsComponent,
    GalleryComponent,
    ClassesAlternatingComponent,
    ClassesBackgroundComponent,
    TestimonialsComponent,
    FormComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  showWhatsAppButton = true;
  showAlternatingComponent: boolean;
  isWhatsAppExpanded = false;
  viewMode: 'adult' | 'child' | 'both' = 'both';

  constructor(private route: ActivatedRoute) {
    // Randomly choose which component to show (50/50 chance)
    this.showAlternatingComponent = Math.random() < 0.5;
  }

  ngOnInit(): void {
    // Read view query parameter and normalize values
    this.route.queryParams.subscribe(params => {
      const viewParam = params['view']?.toLowerCase();
      if (viewParam === 'adult' || viewParam === 'child') {
        this.viewMode = viewParam;
      } else {
        this.viewMode = 'both';
      }
    });
  }

  toggleWhatsAppOptions(): void {
    // If view mode is set, navigate directly instead of showing options
    if (this.viewMode === 'adult') {
      window.open('https://wa.me/972556646033', '_blank', 'noopener,noreferrer');
      return;
    } else if (this.viewMode === 'child') {
      window.open('https://wa.me/972549539515', '_blank', 'noopener,noreferrer');
      return;
    }
    // Default behavior: show options
    this.isWhatsAppExpanded = !this.isWhatsAppExpanded;
  }

  getWhatsAppUrl(): string {
    if (this.viewMode === 'adult') {
      return 'https://wa.me/972556646033';
    } else if (this.viewMode === 'child') {
      return 'https://wa.me/972549539515';
    }
    return '';
  }
}
