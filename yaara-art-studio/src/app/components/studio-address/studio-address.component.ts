import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { STUDIO_ADDRESS_LINES, STUDIO_MAP_IMAGE } from '../../data/studio-location';

@Component({
  selector: 'app-studio-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './studio-address.component.html',
  styleUrl: './studio-address.component.scss',
})
export class StudioAddressComponent implements AfterViewChecked, OnDestroy {
  readonly addressLines = STUDIO_ADDRESS_LINES;
  readonly mapSrc = STUDIO_MAP_IMAGE;
  mapOpen = false;

  @ViewChild('mapOverlay') private mapOverlay?: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  openMap(): void {
    this.mapOpen = true;
    this.setBodyScrollLocked(true);
  }

  closeMap(): void {
    this.mapOpen = false;
    this.setBodyScrollLocked(false);
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeMap();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mapOpen) {
      this.closeMap();
    }
  }

  ngAfterViewChecked(): void {
    if (!this.mapOpen || !isPlatformBrowser(this.platformId)) {
      return;
    }
    const overlay = this.mapOverlay?.nativeElement;
    if (overlay && overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }
  }

  ngOnDestroy(): void {
    this.setBodyScrollLocked(false);
  }

  private setBodyScrollLocked(locked: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.body.style.overflow = locked ? 'hidden' : '';
  }
}
