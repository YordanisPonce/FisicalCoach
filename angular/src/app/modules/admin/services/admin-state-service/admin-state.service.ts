import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminStateService {

  constructor() { }

  async loadMenu(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }
}
