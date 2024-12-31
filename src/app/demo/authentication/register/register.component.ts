// angular import
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  // public method
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/), // Validates phone number
        ],
      ],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if(this.signupForm.invalid) return;
    const payload = { ...this.signupForm.value, name: this.signupForm.value.firstName + ' ' + this.signupForm.value.lastName};
    delete this.signupForm.value.firstName;
    delete this.signupForm.value.lastName;

    this.authService.register(payload).subscribe((response: any) => {
      localStorage.setItem('company', response.companyDetails._id);
      this.router.navigateByUrl('/login');
    })
  }
}
