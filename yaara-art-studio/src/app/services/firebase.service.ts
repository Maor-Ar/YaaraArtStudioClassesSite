import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app: FirebaseApp | null = null;
  private firestore: Firestore | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getFirestore(): Firestore | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    if (!this.firestore) {
      this.app = getApps().length ? getApp() : initializeApp(environment.firebase);
      this.firestore = getFirestore(this.app);
    }

    return this.firestore;
  }
}
