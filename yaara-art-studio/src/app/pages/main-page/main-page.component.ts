import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class MainPageComponent {
  showWhatsAppButton = true;
  showAlternatingComponent: boolean;

  constructor() {
    // Randomly choose which component to show (50/50 chance)
    this.showAlternatingComponent = Math.random() < 0.5;
  }
}
