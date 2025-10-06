import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
export class HeroComponent implements OnInit, AfterViewInit {
  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;
  showStaticBg = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    console.log('Hero component initialized');
  }

  ngAfterViewInit(): void {
    this.setupVideoHandlers();
  }

  private setupVideoHandlers(): void {
    if (this.heroVideo?.nativeElement) {
      const video = this.heroVideo.nativeElement;
      
      // Add event listeners for debugging
      video.addEventListener('loadstart', () => {
        console.log('Video loading started');
      });

      video.addEventListener('loadeddata', () => {
        console.log('Video data loaded');
      });

      video.addEventListener('canplay', () => {
        console.log('Video can start playing');
      });

      video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        console.error('Video error details:', video.error);
      });

      video.addEventListener('play', () => {
        console.log('Video started playing');
      });

      // Try to play the video
      video.play().then(() => {
        console.log('Video autoplay successful');
      }).catch((error) => {
        console.error('Video autoplay failed:', error);
        // Try to play with user interaction
        document.addEventListener('click', () => {
          video.play().catch(console.error);
        }, { once: true });
      });
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  onVideoError(event: any): void {
    console.error('Video failed to load, showing static background');
    this.showStaticBg = true;
  }

  getLogoSrc(): string {
    return this.themeService.isDark()
      ? 'assets/images/LogoDarkPurpleBG.jpeg'
      : 'assets/images/LogoLightPinkBG.jpeg';
  }
}