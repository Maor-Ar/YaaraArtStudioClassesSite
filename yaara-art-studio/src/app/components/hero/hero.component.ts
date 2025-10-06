import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [
    trigger('heroAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          filter: 'blur(10px)',
          transform: 'translateY(30px)'
        }),
        animate('1s ease-out', style({ 
          opacity: 1, 
          filter: 'blur(0px)',
          transform: 'translateY(0px)'
        }))
      ])
    ])
  ]
})
export class HeroComponent {
  constructor(public themeService: ThemeService) {}
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  getLogoSrc(): string {
    return this.themeService.isDark()
      ? 'assets/images/LogoDarkPurpleBG.jpeg'
      : 'assets/images/LogoLightPinkBG.jpeg';
  }
}