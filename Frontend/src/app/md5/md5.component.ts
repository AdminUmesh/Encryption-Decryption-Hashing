// src/app/app.component.ts  (standalone component)
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div
      style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;max-width:820px;margin:2rem auto;padding:1.25rem;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.06)"
    >
      <h1 style="margin:0 0 1rem 0">MD5 Hashing</h1>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <!-- Register Card -->
        <section style="padding:1rem;border-radius:8px;background:#fbfbfb;">
          <h3 style="margin-top:0">Register</h3>

          <label style="font-size:0.9rem">Username</label>
          <input
            [(ngModel)]="regUserName"
            placeholder="username"
            style="width:100%;padding:8px;margin-bottom:8px"
          />

          <label style="font-size:0.9rem">Password</label>
          <input
            [(ngModel)]="regPassword"
            placeholder="password"
            type="password"
            style="width:100%;padding:8px;margin-bottom:8px"
          />

          <div style="display:flex;gap:0.5rem;margin-top:6px">
            <button
              (click)="register()"
              style="padding:8px 12px;border-radius:6px;border:0;cursor:pointer"
            >
              Register
            </button>
            <button
              (click)="clearRegister()"
              style="padding:8px 12px;border-radius:6px;border:1px solid #ddd;background:#fff;cursor:pointer"
            >
              Clear
            </button>
          </div>

          <div
            *ngIf="regMessage"
            style="margin-top:10px;color:var(--regColor, #333);word-break:break-word"
          >
            <strong>{{ regMessage }}</strong>
          </div>

          <div
            *ngIf="registeredHash"
            style="margin-top:10px;background:#fff;padding:8px;border-radius:6px;border:1px dashed #e0e0e0"
          >
            <div style="font-size:0.85rem;color:#666">
              Returned PasswordHash (demo only)
            </div>
            <div
              style="font-family:monospace;font-size:0.85rem;overflow:auto;margin-top:6px"
            >
              {{ registeredHash }}
            </div>
          </div>
        </section>

        <!-- Login Card -->
        <section style="padding:1rem;border-radius:8px;background:#fbfbfb;">
          <h3 style="margin-top:0">Login</h3>

          <label style="font-size:0.9rem">Username</label>
          <input
            [(ngModel)]="loginUserName"
            placeholder="username"
            style="width:100%;padding:8px;margin-bottom:8px"
          />

          <label style="font-size:0.9rem">Password</label>
          <input
            [(ngModel)]="loginPassword"
            placeholder="password"
            type="password"
            style="width:100%;padding:8px;margin-bottom:8px"
          />

          <div style="display:flex;gap:0.5rem;margin-top:6px">
            <button
              (click)="login()"
              style="padding:8px 12px;border-radius:6px;border:0;cursor:pointer"
            >
              Login
            </button>
            <button
              (click)="clearLogin()"
              style="padding:8px 12px;border-radius:6px;border:1px solid #ddd;background:#fff;cursor:pointer"
            >
              Clear
            </button>
          </div>

          <div
            *ngIf="loginMessage"
            style="margin-top:10px;color:var(--loginColor,#333)"
          >
            <strong>{{ loginMessage }}</strong>
          </div>
        </section>
      </div>

      <!-- Debug / API URL -->
      <div style="margin-top:1rem;font-size:0.85rem;color:#666">
        Backend: <code>{{ backend }}</code>
      </div>
    </div>
  `,
})
export class Md5Component {
  // form fields - register
  regUserName = '';
  regPassword = '';
  regMessage = '';
  registeredHash: string | null = null;

  // form fields - login
  loginUserName = '';
  loginPassword = '';
  loginMessage = '';

  // backend base URL - change if your API is on another port/path
  backend = 'https://localhost:7153/api/md5';

  private http = inject(HttpClient);

  register(): void {
    this.regMessage = '';
    this.registeredHash = null;

    if (!this.regUserName || !this.regPassword) {
      this.regMessage = 'Please provide username and password.';
      (document.documentElement.style as any).setProperty(
        '--regColor',
        '#b85b5b'
      );
      return;
    }

    const payload = { userName: this.regUserName, password: this.regPassword };
    // expecting JSON with { user.Id, user.UserName, user.PasswordHash }
    this.http.post<any>(this.backend + '/register', payload).subscribe({
      next: (res) => {
        this.regMessage = 'Registered successfully';
        (document.documentElement.style as any).setProperty(
          '--regColor',
          '#2b7a2b'
        );
        this.registeredHash = res?.passwordHash ?? res?.PasswordHash ?? null;
      },
      error: (err) => {
        const msg = err?.error?.message ?? err?.message ?? 'Register failed';
        this.regMessage = msg;
        (document.documentElement.style as any).setProperty(
          '--regColor',
          '#b85b5b'
        );
      },
    });
  }

  login(): void {
    this.loginMessage = '';

    if (!this.loginUserName || !this.loginPassword) {
      this.loginMessage = 'Please provide username and password.';
      (document.documentElement.style as any).setProperty(
        '--loginColor',
        '#b85b5b'
      );
      return;
    }

    const payload = {
      userName: this.loginUserName,
      password: this.loginPassword,
    };
    this.http.post<any>(this.backend + '/login', payload).subscribe({
      next: (res) => {
        this.loginMessage = res?.message ?? 'Login successful';
        (document.documentElement.style as any).setProperty(
          '--loginColor',
          '#2b7a2b'
        );
      },
      error: (err) => {
        const msg = err?.error?.message ?? err?.message ?? 'Login failed';
        this.loginMessage = msg;
        (document.documentElement.style as any).setProperty(
          '--loginColor',
          '#b85b5b'
        );
      },
    });
  }

  clearRegister(): void {
    this.regUserName = '';
    this.regPassword = '';
    this.regMessage = '';
    this.registeredHash = null;
  }

  clearLogin(): void {
    this.loginUserName = '';
    this.loginPassword = '';
    this.loginMessage = '';
  }
}