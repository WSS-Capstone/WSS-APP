import {Injectable} from "@angular/core";
import {CookieService, SameSite} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private cookieService: CookieService) {}

  /**
   * Get cookie value by name
   * @param name cookie name
   */
  getCookieByName(name: string): string {
    return this.cookieService.get(name);
  }

  setCookie(
    name: string,
    value: string,
    expires?: number | Date,
    path = '/',
    domain?: string,
    secure = true,
    sameSite: SameSite = 'Strict'
  ) {
    this.cookieService.set(name, value, expires, path, domain, secure, sameSite);
  }

  removeCookie(name: string): void {
    this.cookieService.delete(name);
  }

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  removeLocalStorage(key: string) {
    return localStorage.removeItem(key);
  }
}
