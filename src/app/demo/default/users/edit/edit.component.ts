import { Component } from '@angular/core';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconService } from '@ant-design/icons-angular';
import { UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  editUserForm: FormGroup;
  members = [];
  editUserId = '';
  selectedMembers: string[] = [];
  selectedPermitedUsers: string[] = [];
  roles = ['Admin', 'User', "SuperAdmin"];
  userDetails = JSON.parse(localStorage.getItem('user'));

  constructor(private fb: FormBuilder,  private iconService: IconService, private userService: UserService,   private route: ActivatedRoute, private router: Router,) {
    this.iconService.addIcon(...[CalendarOutline])
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.editUserId = params.get('id') || '';
      this.getEditUserDetails();
    });
    this.editUserForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      let payload = {
        ...this.editUserForm.value,
      }

      this.userService.updateUser(this.editUserId,payload).subscribe((res) => {
        this.router.navigateByUrl('/users')
      })
    }
  }
  getEditUserDetails() {
    this.userService.getUserById(this.editUserId).subscribe((data: any) => {
      const user = data;
      this.editUserForm.patchValue(user);
    });
  }
}
