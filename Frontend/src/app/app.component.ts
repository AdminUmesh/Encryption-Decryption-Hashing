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
      <h2>AES-GCM Demo (Angular & .NET)</h2>

      <label>Plain text</label><br/>
      <textarea [(ngModel)]="plain" rows="3" style="width:100%"></textarea><br/>

      <button (click)="encrypt()">Encrypt</button>
      <button (click)="getKey()">Show Demo Key (base64)</button>
      <br/><br/>

      <label>Encrypted (base64 package - nonce|tag|ciphertext)</label><br/>
      <textarea [(ngModel)]="encrypted" rows="4" style="width:100%"></textarea><br/>

      <button (click)="decrypt()">Decrypt</button>
      <br/><br/>

      <label>Decrypted plain text</label><br/>
      <textarea [(ngModel)]="decrypted" rows="3" style="width:100%"></textarea>
    </div>

    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // simple reactive string fields (works with ngModel)
  plain = 'Hello from Angular!';
  encrypted = '';
  decrypted = '';

  // point to backend API (update port if needed)
  backend = 'https://localhost:7153/api/crypto';

  // modern DI with inject()
  private http = inject(HttpClient);

  encrypt(): void {
    // responseType:'text' so the observable returns a plain string
    this.http
      .post(this.backend + '/encrypt', { plain: this.plain }, { responseType: 'text' })
      .subscribe({
        next: (r) => this.encrypted = r,
        error: () => alert('Encrypt error')
      });
  }

  decrypt(): void {
    this.http
      .post(this.backend + '/decrypt', { base64Package: this.encrypted }, { responseType: 'text' })
      .subscribe({
        next: (r) => this.decrypted = r,
        error: () => alert('Decrypt error')
      });
  }

  getKey(): void {
    this.http.get(this.backend + '/key', { responseType: 'text' })
      .subscribe({
        //debugger;
        next: (r) => alert('Demo key (base64): ' + r),
        error: () => alert('Get key error')
      });
  }
}
