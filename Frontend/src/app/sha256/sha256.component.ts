// src/app/sha256-ui.component.ts
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sha256-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div
      style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; max-width:760px; margin:2rem auto; padding:1rem;"
    >
      <h2>SHA-256 Hashing</h2>
      <p style="color:gray; margin-top:0;">
        Register / Login using SHA-256 hashing.
      </p>

      <section
        style="border:1px solid #e5e7eb; padding:1rem; border-radius:8px; margin-bottom:1rem;"
      >
        <h3 style="margin:0 0 .5rem 0;">Register</h3>
        <label style="display:block; font-weight:600; margin-bottom:.25rem;"
          >Username</label
        >
        <input
          [(ngModel)]="regUser"
          placeholder="username"
          style="width:100%; padding:.5rem; margin-bottom:.5rem;"
        />

        <label style="display:block; font-weight:600; margin-bottom:.25rem;"
          >Password</label
        >
        <input
          [(ngModel)]="regPass"
          type="password"
          placeholder="password"
          style="width:100%; padding:.5rem; margin-bottom:.75rem;"
        />

        <div style="display:flex; gap:.5rem;">
          <button
            (click)="register()"
            [disabled]="loading"
            style="padding:.5rem 1rem; border-radius:6px;"
          >
            Register
          </button>
          <button
            (click)="clearRegister()"
            style="padding:.5rem 1rem; border-radius:6px; background:#f3f4f6;"
          >
            Clear
          </button>
        </div>

        <div
          *ngIf="regResult"
          style="margin-top:.75rem; background:#f9fafb; padding:.5rem; border-radius:6px; border:1px solid #eee;"
        >
          <div><strong>Registered:</strong> {{ regResult.userName }}</div>
          <div style="word-break:break-all;">
            <strong>PasswordHash:</strong> {{ regResult.passwordHash }}
          </div>
          <div><strong>Id:</strong> {{ regResult.id }}</div>
        </div>

        <div *ngIf="regError" style="color:#b91c1c; margin-top:.5rem;">
          {{ regError }}
        </div>
      </section>

      <section
        style="border:1px solid #e5e7eb; padding:1rem; border-radius:8px;"
      >
        <h3 style="margin:0 0 .5rem 0;">Login</h3>
        <label style="display:block; font-weight:600; margin-bottom:.25rem;"
          >Username</label
        >
        <input
          [(ngModel)]="loginUser"
          placeholder="username"
          style="width:100%; padding:.5rem; margin-bottom:.5rem;"
        />

        <label style="display:block; font-weight:600; margin-bottom:.25rem;"
          >Password</label
        >
        <input
          [(ngModel)]="loginPass"
          type="password"
          placeholder="password"
          style="width:100%; padding:.5rem; margin-bottom:.75rem;"
        />

        <div style="display:flex; gap:.5rem;">
          <button
            (click)="login()"
            [disabled]="loading"
            style="padding:.5rem 1rem; border-radius:6px;"
          >
            Login
          </button>
          <button
            (click)="clearLogin()"
            style="padding:.5rem 1rem; border-radius:6px; background:#f3f4f6;"
          >
            Clear
          </button>
        </div>

        <div
          *ngIf="loginMessage"
          style="margin-top:.75rem; background:#f9fafb; padding:.5rem; border-radius:6px; border:1px solid #eee;"
        >
          {{ loginMessage }}
        </div>

        <div *ngIf="loginError" style="color:#b91c1c; margin-top:.5rem;">
          {{ loginError }}
        </div>
      </section>

      <p style="margin-top:.75rem; color:gray; font-size:.9rem;">
        Note: This UI sends raw password over HTTPS to backend. Always use HTTPS
        in production. This UI does not store tokens.
      </p>
    </div>
  `,
  styles: [],
})
export class Sha256Component {
  // bindable fields for register
  regUser = '';
  regPass = '';
  regResult: { id?: string; userName?: string; passwordHash?: string } | null =
    null;
  regError = '';

  // bindable fields for login
  loginUser = '';
  loginPass = '';
  loginMessage = '';
  loginError = '';

  // backend base - change if your API uses different port/path
  backend = 'https://localhost:7153/api/sha256';

  loading = false;

  private http = inject(HttpClient);

  register(): void {
    this.regError = '';
    this.regResult = null;
    if (!this.regUser || !this.regPass) {
      this.regError = 'Enter username and password';
      return;
    }

    this.loading = true;
    this.http
      .post<any>(this.backend + '/register', {
        userName: this.regUser,
        password: this.regPass,
      })
      .subscribe({
        next: (r) => {
          // Expecting: { userName, id, passwordHash }
          this.regResult = {
            id: r?.id ?? r?.Id,
            userName: r?.userName ?? r?.UserName,
            passwordHash: r?.passwordHash ?? r?.PasswordHash,
          };
          this.loading = false;
        },
        error: (err) => {
          this.regError = err?.error?.message ?? 'Register failed';
          this.loading = false;
        },
      });
  }

  login(): void {
    this.loginError = '';
    this.loginMessage = '';
    if (!this.loginUser || !this.loginPass) {
      this.loginError = 'Enter username and password';
      return;
    }

    this.loading = true;
    this.http
      .post<any>(this.backend + '/login', {
        userName: this.loginUser,
        password: this.loginPass,
      })
      .subscribe({
        next: (r) => {
          // controller returns success message on success
          this.loginMessage = r?.message ?? 'Login successful';
          this.loading = false;
        },
        error: (err) => {
          this.loginError = err?.error?.message ?? 'Login failed';
          this.loading = false;
        },
      });
  }

  clearRegister(): void {
    this.regUser = '';
    this.regPass = '';
    this.regResult = null;
    this.regError = '';
  }

  clearLogin(): void {
    this.loginUser = '';
    this.loginPass = '';
    this.loginMessage = '';
    this.loginError = '';
  }
}
