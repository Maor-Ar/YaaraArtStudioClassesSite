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
  }

  ngAfterViewInit(): void {
    // Only setup video in browser environment
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure DOM is fully ready
      setTimeout(() => {
        this.setupVideo();
      }, 0);
    }
  }

  private setupVideo(): void {
    if (this.heroVideo?.nativeElement) {
      const video = this.heroVideo.nativeElement;
      
      // Ensure video properties are set correctly
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.preload = 'auto';
      
      // Simple event listeners
      video.addEventListener('loadstart', () => {
        console.log('Video loading started');
      });

      video.addEventListener('loadeddata', () => {
        console.log('Video data loaded');
      });

      video.addEventListener('canplay', () => {
        console.log('Video can start playing');
        // Try to play as soon as it can
        video.play().catch((error) => {
          console.error('Video autoplay failed on canplay:', error);
        });
      });

      video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        this.showStaticBg = true;
      });

      video.addEventListener('play', () => {
        console.log('Video started playing');
      });

      // Multiple attempts to play
      const attemptPlay = () => {
        video.play().catch((error) => {
          console.error('Video autoplay failed:', error);
        });
      };

      // Try immediately
      attemptPlay();
      
      // Try after a short delay
      setTimeout(attemptPlay, 100);
      setTimeout(attemptPlay, 500);
      setTimeout(attemptPlay, 1000);
    }
  }

  scrollToSection(sectionId: string): void {
    if (typeof window === 'undefined') {
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