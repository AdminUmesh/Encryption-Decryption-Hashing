//import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'https://localhost:5001/api/auth';

  constructor(private http: HttpClient) {}

  register(userName: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/register`, { userName, password });
  }

  login(userName: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/login`, { userName, password });
  }

  storeToken(token: string) {
    localStorage.setItem('access_token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  logout() {
    localStorage.removeItem('access_token');
  }
}
function Injectable(arg0: { providedIn: string; }): (target: typeof AuthService) => void | typeof AuthService {
  throw new Error('Function not implemented.');
}

