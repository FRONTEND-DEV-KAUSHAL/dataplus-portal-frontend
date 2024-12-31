import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-identify-company',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule],
  templateUrl: './identify-company.component.html',
  styleUrl: './identify-company.component.scss',
  providers: [AuthService]
})
export class IdentifyCompanyComponent {
  company: string = '';
  SignInOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];

  constructor(private authService: AuthService, private router: Router) {
  }

  verify(){
    if(!this.company) return;

    this.authService.identifyCompany({company: this.company }).subscribe((res: {companyId: string, name: string}) => {
      localStorage.setItem('company', res.companyId);
      localStorage.setItem('companyName', res.name);
      this.router.navigateByUrl('/login')
    })
  }
}
