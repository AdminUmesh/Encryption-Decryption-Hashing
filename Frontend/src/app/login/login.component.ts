import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({ selector: 'app-login', templateUrl: './login.component.html' })
export class LoginComponent {
  userName = '';
  password = '';
  message = '';
  constructor(private auth: AuthService) {}
  login() {
    this.auth.login(this.userName, this.password).subscribe({
      next: (res) => {
        if (res.token) {
          this.auth.storeToken(res.token);
          this.message = 'Login success';
        } else this.message = 'Login success (no token returned)';
      },
      error: () => (this.message = 'Login failed'),
    });
  }
}
