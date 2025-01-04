import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { IconModule, IconService } from '@ant-design/icons-angular';
import { NgbDatepickerModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { CalendarOutline } from '@ant-design/icons-angular/icons';
import { ProjectService } from '../../../../services/project.service';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CardComponent, CommonModule, IconModule, NgbDatepickerModule,NgSelectModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  projectForm: FormGroup;
  members = [];
  selectedMembers: string[] = [];
  selectedPermitedUsers: string[] = [];
  budgetType = ['Hourly', 'Fixed'];
  userDetails = JSON.parse(localStorage.getItem('user'));

  constructor(private fb: FormBuilder,  private iconService: IconService, private projectService: ProjectService, private router: Router, private userService: UserService) {
    this.iconService.addIcon(...[CalendarOutline])
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      budgetType: ['', [Validators.required]],
      budget: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      status: ['', [Validators.required]],
    });
    this.getAllMembers()
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const allUsers = Array.from(new Set([...this.selectedMembers, ...this.selectedPermitedUsers]));

      const members = allUsers.map((user: any) => ({
        user: user._id,
        permissions: { canAddUsers: this.selectedPermitedUsers.includes(user) },
        role : this.selectedPermitedUsers.includes(user) ? 'Manager' : "Developer"
      }));

      let payload = {
        ...this.projectForm.value,
        members: members
      }
      if(this.projectForm.value.startDate){
        const date = this.projectForm.value.startDate
        payload.startDate =  new Date(
          date.year,
          date.month - 1,
          date.day+1
        ).toISOString();
      }
      if(this.projectForm.value.endDate){
        const date = this.projectForm.value.endDate
        payload.endDate =  new Date(
          date.year,
          date.month - 1,
          date.day+ 1
        ).toISOString();
      }

      this.projectService.createProject(payload).subscribe((res) => {
        this.router.navigateByUrl('/projects')
      })
    }
  }

  getAllMembers(){
    this.userService.getAllUsers(1, 1000).subscribe((res: any) => {
      const filterData = res.users.filter(user => user._id !== this.userDetails._id && user.isDeleted === false);
      this.members = filterData;
    })
  }
}
