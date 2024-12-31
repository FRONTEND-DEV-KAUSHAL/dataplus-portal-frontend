// angular import
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
export default class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  login(){
    const companyId: string = localStorage.getItem('company');

    if(!companyId || !this.email || !this.password) return;
    const payload = {
      email: this.email,
      password: this.password,
      companyId
    }
    this.authService.login(payload).subscribe((response: {token: string, message: string}) => {
      localStorage.setItem('token', response.token);
      this.router.navigateByUrl('/dashboard');
    })
  }
}
