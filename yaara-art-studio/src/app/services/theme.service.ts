import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'yaara-art-studio-theme';
  
  // Signal for current theme
  private _currentTheme = signal<Theme>(this.getInitialTheme());
  
  // Computed signal for theme class
  public themeClass = computed(() => this._currentTheme());
  
  // Computed signal for isDark mode
  public isDark = computed(() => this._currentTheme() === 'dark');
  
  // Computed signal for logo variant
  public logoVariant = computed(() => this._currentTheme() === 'dark' ? 'light' : 'dark');

  constructor() {
    this.applyTheme(this._currentTheme());
  }

  private getInitialTheme(): Theme {
    // Always return dark mode - no client storage needed
    return 'dark';
  }

  public toggleTheme(): void {
    const newTheme: Theme = this._currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  public setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    this.applyTheme(theme);
    
    // No localStorage saving - always start with dark mode
  }

  private applyTheme(theme: Theme): void {
    // Only apply theme if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme class
    root.classList.add(`${theme}-theme`);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#241A35' : '#FFECEE');
    }
  }

  public getCurrentTheme(): Theme {
    return this._currentTheme();
  }
}