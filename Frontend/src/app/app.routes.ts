import { Routes } from '@angular/router';
import { AesGCMComponent } from './aes-gcm/aes-gcm.component';
import { BcryptComponent } from './bcrypt/bcrypt.component';
import { Md5Component } from './md5/md5.component';
import { Sha256Component } from './sha256/sha256.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  // default redirect to a demo (change to any you prefer)
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // feature pages
  { path: 'home', component: HomeComponent, title: 'AES-GCM Demo' },
  { path: 'aes-gcm', component: AesGCMComponent, title: 'AES-GCM Demo' },
  { path: 'bcrypt', component: BcryptComponent, title: 'BCrypt Demo' },
  { path: 'md5', component: Md5Component, title: 'MD5 Demo' },
  { path: 'sha256', component: Sha256Component, title: 'SHA-256 Demo' },

  // fallback
  { path: '**', redirectTo: '' },
];
