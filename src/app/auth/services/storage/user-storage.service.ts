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
    return user ? user.role : '';
  }
  

  isAdminLoggedIn(): boolean {
    return this.getToken() !== null && this.getUserRole() === 'ADMIN';
  }


  isCustomerLoggedIn(): boolean {
    return this.getToken() !== null && this.getUserRole() === 'CUSTOMER';
  }

  
  signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
    this.userSubject.next(null); // Notify UI about logout
  }
}
