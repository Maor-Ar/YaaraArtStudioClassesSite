import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CountdownParts {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-course-promo-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-promo-banner.component.html',
  styleUrl: './course-promo-banner.component.scss'
})
export class CoursePromoBannerComponent implements OnInit, OnDestroy {
  /** Next beginner course opens Thursday 17.12.2026 at 10:00 Israel time. */
  readonly courseStartsAt = new Date('2026-12-17T10:00:00+02:00');
  readonly originalPrice = '3,200₪';
  readonly salePrice = '1,800₪';

  courseStarted = false;
  countdownReady = false;
  countdown: CountdownParts = { days: '00', hours: '00', minutes: '00', seconds: '00' };

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.courseStarted = Date.now() >= this.courseStartsAt.getTime();
    if (!isPlatformBrowser(this.platformId) || this.courseStarted) {
      return;
    }
    this.countdownReady = true;
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(): void {
    const remaining = this.courseStartsAt.getTime() - Date.now();
    if (remaining <= 0) {
      this.courseStarted = true;
      this.countdownReady = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    this.countdown = {
      days: String(Math.floor(totalSeconds / 86400)).padStart(2, '0'),
      hours: String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0'),
      minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
      seconds: String(totalSeconds % 60).padStart(2, '0')
    };
  }
}
