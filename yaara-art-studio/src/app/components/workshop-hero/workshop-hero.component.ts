import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject, Input, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-workshop-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshop-hero.component.html',
  styleUrl: './workshop-hero.component.scss'
})
export class WorkshopHeroComponent implements OnInit, AfterViewInit {
  @ViewChild('heroVideo', { static: false }) heroVideo!: ElementRef<HTMLVideoElement>;
  @Input() quotes: string[] = [];
  showStaticBg = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      setTimeout(() => this.setupVideo(), 0);
    }
  }

  private setupVideo(): void {
    if (!this.heroVideo?.nativeElement) {
      return;
    }

    const video = this.heroVideo.nativeElement;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';

    video.addEventListener('canplay', () => {
      video.play().catch(() => {
        this.showStaticBg = true;
      });
    });

    video.addEventListener('error', () => {
      this.showStaticBg = true;
    });

    const attemptPlay = () => {
      video.play().catch(() => {});
    };
    attemptPlay();
    setTimeout(attemptPlay, 100);
    setTimeout(attemptPlay, 500);
    setTimeout(attemptPlay, 1000);
  }

  scrollToRegister(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const element = document.getElementById('register');
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onVideoError(): void {
    this.showStaticBg = true;
  }
}
