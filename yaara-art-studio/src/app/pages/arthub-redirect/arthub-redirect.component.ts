import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

const ARTHUB_URL = 'https://arthub.studiobuda.co.il/';
const REDIRECT_DELAY_MS = 2000;

@Component({
  selector: 'app-arthub-redirect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arthub-redirect.component.html',
  styleUrl: './arthub-redirect.component.scss',
})
export class ArthubRedirectComponent implements OnInit, OnDestroy {
  readonly arthubUrl = ARTHUB_URL;
  secondsLeft = 2;
  private redirectTimer: ReturnType<typeof setTimeout> | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    const pageTitle = 'ArtHub | סטודיו בודה — הרשמה לשיעורים, יומן אישי וניהול כניסות';
    const description =
      'ArtHub של סטודיו בודה הוא האפליקציה לניהול שיעורי הציור: הרשמה לשיעורים, יומן אישי, מעקב כניסות ומנויים. עברו לאפליקציה בכתובת arthub.studiobuda.co.il';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'ArtHub, סטודיו בודה, הרשמה לשיעורים, יומן ציור, אפליקציית סטודיו, ניהול שיעורים, Studio Buda',
    });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: 'https://studiobuda.co.il/arthub' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'he_IL' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Studio Buda' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    // Soft redirect for crawlers that honor meta refresh; JS handles modern browsers.
    this.meta.updateTag({
      'http-equiv': 'refresh',
      content: `2;url=${ARTHUB_URL}`,
    });

    this.ensureCanonical('https://studiobuda.co.il/arthub');

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.countdownTimer = setInterval(() => {
      this.secondsLeft = Math.max(0, this.secondsLeft - 1);
    }, 1000);

    this.redirectTimer = setTimeout(() => {
      this.document.location.href = ARTHUB_URL;
    }, REDIRECT_DELAY_MS);
  }

  ngOnDestroy(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    this.meta.removeTag('http-equiv="refresh"');
  }

  goNow(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.location.href = ARTHUB_URL;
    }
  }

  private ensureCanonical(href: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
