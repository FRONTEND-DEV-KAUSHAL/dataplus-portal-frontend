import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICity, ICountry, IState, Country, State } from 'country-state-city';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CardComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  personalInfoForm!: FormGroup;
  userId: string;
  constructor(private fb: FormBuilder, private  authService: AuthService,private userService: UserService) { }

  ngOnInit(): void {
    this.personalInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      company: [{ value:'', disabled:true }],
    });
    this.getUser();
  }

  onSubmit(): void {
    if (this.personalInfoForm.valid) {
      let payload = {
        ...this.personalInfoForm.value,
        name: this.personalInfoForm.get('firstName').value + ' ' + this.personalInfoForm.get('lastName').value,
      }
      delete this.personalInfoForm.value.firstName;
      delete this.personalInfoForm.value.lastName;

      this.userService.updateUser(this.userId, payload).subscribe((res) => {
      })
    } else {
      console.error('Form is invalid');
    }
  }

  getUser(){
    this.authService.getLoggedInUser().subscribe((user: any) => {
      this.userId = user['_id'];
      this.personalInfoForm.patchValue({ ...user, firstName: user.name.split(' ')[0], lastName: user.name.split(' ')[1], company: user.company.name });
    })
  }



}