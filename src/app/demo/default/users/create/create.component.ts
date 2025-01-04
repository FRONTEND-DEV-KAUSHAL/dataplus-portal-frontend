import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { IconModule, IconService } from '@ant-design/icons-angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../../services/project.service';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { CalendarOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CardComponent, IconModule, NgSelectComponent, NgbInputDatepicker, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  userForm: FormGroup;
  members = [];
  selectedMembers: string[] = [];
  selectedPermitedUsers: string[] = [];
  roles = ['Admin', 'User', "SuperAdmin"];
  userDetails = JSON.parse(localStorage.getItem('user'));

  constructor(private fb: FormBuilder,  private iconService: IconService, private userService: UserService, private router: Router) {
    this.iconService.addIcon(...[CalendarOutline])
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      let payload = {
        ...this.userForm.value,
      }

      this.userService.createUser(payload).subscribe((res) => {
        this.router.navigateByUrl('/users')
      })
    }
  }
}
