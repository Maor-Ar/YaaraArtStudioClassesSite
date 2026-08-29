import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

/** Optional object properties supported by the standard Lead event. */
export interface MetaPixelLeadParams {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}

/**
 * Browser-side Meta Pixel helper.
 * Standard events must be sent with fbq('track', ...) after the conversion happens,
 * not on page load. See https://developers.facebook.com/docs/meta-pixel/reference
 */
@Injectable({
  providedIn: 'root'
})
export class MetaPixelService {
  private static readonly retryDelayMs = 500;
  private static readonly maxAttempts = 6;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Fire the standard Lead event. Call only after the signup is accepted
   * (successful form response), never on click or page view.
   */
  trackLead(params?: MetaPixelLeadParams): void {
    this.track('Lead', params);
  }

  private track(event: string, params?: MetaPixelLeadParams, attempt = 0): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', event, params);
      } else {
        window.fbq('track', event);
      }
      return;
    }

    if (attempt < MetaPixelService.maxAttempts) {
      setTimeout(() => this.track(event, params, attempt + 1), MetaPixelService.retryDelayMs);
    }
  }
}
