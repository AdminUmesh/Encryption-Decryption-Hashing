// src/app/app.component.ts (standalone)
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterOutlet],
  template: `
    <div style="font-family:sans-serif;max-width:700px;margin:2rem;">
      <h2>BCrypt Hashing</h2>

      <h3>Register</h3>
      <input [(ngModel)]="regUser" placeholder="username" /><br />
      <input
        [(ngModel)]="regPass"
        placeholder="password"
        type="password"
      /><br />
      <button (click)="register()">Register</button>
      <div style="color:green">{{ regMsg }}</div>
      <hr />

      <h3>Login</h3>
      <input [(ngModel)]="loginUser" placeholder="username" /><br />
      <input
        [(ngModel)]="loginPass"
        placeholder="password"
        type="password"
      /><br />
      <button (click)="login()">Login</button>
      <div style="color:green">{{ loginMsg }}</div>
    </div>

    <router-outlet></router-outlet>
  `,
  styleUrls: [],
})
export class BcryptComponent {
  regUser = '';
  regPass = '';
  regMsg = '';

  loginUser = '';
  loginPass = '';
  loginMsg = '';

  backend = 'https://localhost:7153/api/bcrypt';
  private http = inject(HttpClient);

  register(): void {
    this.regMsg = '';
    this.http
      .post(
        this.backend + '/register',
        { userName: this.regUser, password: this.regPass },
        { responseType: 'json' }
      )
      .subscribe({
        next: () => {
          this.regMsg = 'Registered successfully';
        },
        error: (err) => {
          this.regMsg = err?.error?.message ?? 'Register failed';
        },
      });
  }

  login(): void {
    this.loginMsg = '';
    this.http
      .post(
        this.backend + '/login',
        { userName: this.loginUser, password: this.loginPass },
        { responseType: 'json' }
      )
      .subscribe({
        next: (res: any) => {
          this.loginMsg = res?.message ?? 'Login success';
        },
        error: (err) => {
          this.loginMsg = err?.error?.message ?? 'Login failed';
        },
      });
  }
}
