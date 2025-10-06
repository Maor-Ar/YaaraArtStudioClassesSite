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
  showPlayButton = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    console.log('Hero component initialized');
  }

  ngAfterViewInit(): void {
    // Only setup basic video handlers in browser environment
    if (typeof window !== 'undefined') {
      this.setupVideoHandlers();
    }
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
        this.showStaticBg = true;
      });

      video.addEventListener('play', () => {
        console.log('Video started playing');
      });

      // Try autoplay with a more aggressive approach
      this.attemptAutoplay(video);
    }
  }

  private attemptAutoplay(video: HTMLVideoElement): void {
    // First attempt - immediate play
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Video autoplay successful');
      }).catch((error) => {
        console.error('Video autoplay failed:', error);
        
        // Second attempt - after a short delay
        setTimeout(() => {
          video.play().then(() => {
            console.log('Video autoplay successful on retry');
          }).catch((retryError) => {
            console.error('Video autoplay retry failed:', retryError);
            
            // Third attempt - when user interacts with the page
            this.showPlayButton = true;
            this.setupUserInteractionHandlers(video);
          });
        }, 500);
      });
    }
  }

  private setupUserInteractionHandlers(video: HTMLVideoElement): void {
    const playVideoOnInteraction = () => {
      video.play().then(() => {
        console.log('Video started playing after user interaction');
        this.showPlayButton = false;
        // Remove all event listeners after successful play
        this.removeInteractionListeners();
      }).catch(console.error);
    };

    // Listen for various user interactions
    const events = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, playVideoOnInteraction, { once: true, passive: true });
    });
  }

  private removeInteractionListeners(): void {
    // This method can be used to clean up listeners if needed
    // For now, we use { once: true } so they auto-remove
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

  onPlayButtonClick(): void {
    if (this.heroVideo?.nativeElement) {
      this.heroVideo.nativeElement.play().then(() => {
        console.log('Video started playing from play button');
        this.showPlayButton = false;
      }).catch(console.error);
    }
  }

  getLogoSrc(): string {
    return this.themeService.isDark()
      ? 'assets/images/LogoDarkPurpleBG.jpeg'
      : 'assets/images/LogoLightPinkBG.jpeg';
  }
}