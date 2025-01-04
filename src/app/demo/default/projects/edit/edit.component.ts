import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../../../theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../services/project.service';
import { NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, SharedModule, NgbDatepickerModule, NgbModalModule, NgSelectComponent, NgSelectModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  editProjectForm: FormGroup;
  projectId: string;
  members = [];
  selectedMembers: string[] = [];
  selectedPermitedUsers: string[] = [];
  budgetType = ['Hourly', 'Fixed'];
  userDetails = JSON.parse(localStorage.getItem('user'));
  editPermission: boolean = false;

  constructor(
    private fb: FormBuilder,
    private iconService: IconService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private modalService: NgbModal,
    private userService: UserService
  ) {
    this.iconService.addIcon(...[CalendarOutline]);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('id') || '';
      this.getAllMembers();
      this.getProjectDetails();
    });
    this.editProjectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      budgetType: ['', [Validators.required]],
      budget: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', []],
      status: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.editProjectForm.valid) {
      const allUsers = Array.from(new Set([...this.selectedMembers, ...this.selectedPermitedUsers]));

      const members = allUsers.map((user: any) => ({
        user: user._id,
        permissions: { canAddUsers: this.selectedPermitedUsers.includes(user) },
        role : this.selectedPermitedUsers.includes(user) ? 'Manager' : "Developer"
      }));
      let payload = {
        ...this.editProjectForm.value,
        members
      };
      if (this.editProjectForm.value.startDate) {
        const date = this.editProjectForm.value.startDate;
        payload.startDate = new Date(date.year, date.month - 1, date.day + 1).toISOString();
      }
      if (this.editProjectForm.value.endDate) {
        const date = this.editProjectForm.value.endDate;
        payload.endDate = new Date(date.year, date.month - 1, date.day + 1).toISOString();
      }

      this.projectService.updateProjects(this.projectId, payload).subscribe((res) => {
        this.router.navigateByUrl('/projects');
      });
    } else {
      console.log('Form is invalid');
    }
  }

  getProjectDetails() {
    this.projectService.getProjectById(this.projectId).subscribe((data: any) => {
      const project = data.project;
      this.editProjectForm.patchValue({
        ...project,
        startDate: {
          year: new Date(project.startDate).getFullYear(),
          month: new Date(project.startDate).getMonth() + 1,
          day: new Date(project.startDate).getDate()
        },
        ...(project.endDate && {
          endDate: {
            year: new Date(project.endDate).getFullYear(),
            month: new Date(project.endDate).getMonth() + 1,
            day: new Date(project.endDate).getDate()
          }
        })
      });
      // Step 1: Prepopulate selected values
      this.selectedMembers = project.members
        .filter(member => member.permissions.canAddUsers === false)
        .map(member => member.user);

      this.selectedPermitedUsers = project.members
        .filter(member => member.permissions.canAddUsers === true)
        .map(member => member.user);

      if(project.members.some(member => member.role === "Client") || this.userDetails.role === "SuperAdmin") {
        this.editPermission = true;
      }
    });
  }

  open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  deleteItem() {
    this.projectService.deleteProject(this.projectId).subscribe((res: any) => {
      this.router.navigateByUrl('/projects');
    });
  }
  getAllMembers(){
    this.userService.getAllUsers(1, 1000).subscribe((res: any) => {
      const filterData = res.users.filter(user => user._id !== this.userDetails._id && user.isDeleted === false);
      this.members = filterData;
    })
  }
}
