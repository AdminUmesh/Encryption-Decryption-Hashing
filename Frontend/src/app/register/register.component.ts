import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  userName = '';
  password = '';
  message = '';
  constructor(private auth: AuthService) {}
  register() {
    this.auth.register(this.userName, this.password).subscribe({
      next: () => (this.message = 'Registered successfully'),
      error: (e) => (this.message = e.error?.message ?? 'Error'),
    });
  }
}
