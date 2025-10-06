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
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'light'; // Default for SSR
    }
    
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light
    return 'light';
  }

  public toggleTheme(): void {
    const newTheme: Theme = this._currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  public setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
    this.applyTheme(theme);
    
    // Only save to localStorage if we're in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_KEY, theme);
    }
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