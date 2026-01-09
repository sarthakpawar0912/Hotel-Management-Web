import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

const TOKEN = 'token';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})

export class UserStorageService {

  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  constructor() {}

  // Decode JWT token to get payload
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  // Check if token is expired (only if token has exp claim)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    const decoded = this.decodeToken(token);
    // If no exp claim or decode fails, assume token is valid (let backend decide)
    if (!decoded || !decoded.exp) {
      return false;
    }

    // exp is in seconds, Date.now() is in milliseconds
    const expirationDate = decoded.exp * 1000;
    return Date.now() >= expirationDate;
  }

  // Check token validity and clear if expired
  checkTokenValidity(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    if (this.isTokenExpired()) {
      this.signOut();
      return false;
    }
    return true;
  }

  saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  saveUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
    this.userSubject.next(user); // Notify UI about change
  }

  getToken(): string | null {
    return window.localStorage.getItem(TOKEN);
  }

  getUser(): any {
    const user = window.localStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
  }

  getUserId(): string {
    const user = this.getUser();
    return user ? user.id : '';
  }

  getUserRole(): string {
    const user = this.getUser();
    if (!user) return '';
    // Handle different possible field names for role
    return user.role || user.userRole || user.roles?.[0] || '';
  }

  isAdminLoggedIn(): boolean {
    if (this.getToken() === null || this.isTokenExpired()) return false;
    const role = this.getUserRole()?.toUpperCase();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }

  isCustomerLoggedIn(): boolean {
    if (this.getToken() === null || this.isTokenExpired()) return false;
    const role = this.getUserRole()?.toUpperCase();
    return role === 'CUSTOMER' || role === 'ROLE_CUSTOMER' || role === 'USER' || role === 'ROLE_USER';
  }

  signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
    this.userSubject.next(null); // Notify UI about logout
  }
  
}
