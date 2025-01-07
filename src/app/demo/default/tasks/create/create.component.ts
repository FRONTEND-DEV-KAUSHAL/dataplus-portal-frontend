import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { IconModule, IconService } from '@ant-design/icons-angular';
import { CalendarOutline } from '@ant-design/icons-angular/icons';
import { TaskService } from '../../../../services/task.service';
import { ProjectService } from '../../../../services/project.service';
import { FileChangeEvent } from '@angular/compiler-cli/src/perform_watch';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { UserService } from '../../../../services/user.service';
import { SharedModule } from '../../../../theme/shared/shared.module';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    FormsModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    CardComponent,
    IconModule,
    NgbDropdownModule,
    NgSelectComponent,
    SharedModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  createTaskForm!: FormGroup;
  projectOptions = [];
  selectedDocuments: File[] = [];
  priorityOptions = ['High', 'Medium', 'Low'];
  formSubmitted = false;
  members = [];
  selectedMembers: string[] = [];
  selectedPermitedUsers: string[] = [];
  userDetails = JSON.parse(localStorage.getItem('user'));
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private iconService: IconService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private router: Router,
    private userService: UserService
  ) {
    this.iconService.addIcon(...[CalendarOutline]);
  }

  ngOnInit(): void {
    this.createTaskForm = this.fb.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: [null, Validators.required],
      project: ['', Validators.required]
    });
    this.getProjectList();
    this.getAllMembers();
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.isLoading = true;

    // Check if the form is valid
    if (this.createTaskForm.valid) {
      const allUsers = Array.from(new Set([...this.selectedMembers, ...this.selectedPermitedUsers]));

      const members = allUsers.map((user: any) => ({
        user: user._id,
        permissions: { canAddUsers: this.selectedPermitedUsers.includes(user) },
        role: this.selectedPermitedUsers.includes(user) ? 'Manager' : 'Developer'
      }));

      const formValue = {
        ...this.createTaskForm.value,
        document: this.selectedDocuments, // Include selected documents
        members
      };

      const formPayload = new FormData();

      // Loop through the form data and append to FormData object
      for (let key in formValue) {
        if (key === 'document') {
          // Handle document field (files)
          for (let file of formValue[key]) {
            formPayload.append('document', file);
          }
        } else if (key === 'dueDate') {
          // Convert dueDate to ISO string
          const dueDate = formValue[key];
          const formattedDate = new Date(dueDate.year, dueDate.month - 1, dueDate.day).toISOString();
          formPayload.append('dueDate', formattedDate);
        } else if (key === 'members') {
          formValue[key].forEach((item: any) => {
            formPayload.append('members', JSON.stringify(item));
          });
        } else {
          // Append other fields
          formPayload.append(key, formValue[key]);
        }
      }

      // Send the FormData to the backend
      this.taskService.createTask(formPayload).subscribe(
        (response) => {
          this.router.navigateByUrl('/tasks');
        },
        (error) => {
          console.error('Error Creating Task:', error);
        },
        () => {
          this.isLoading = false;
        }
      );
    } else {
      console.log('Form is invalid or missing required fields.');
    }
  }

  getProjectList() {
    this.projectService.getAllProjects(1, 1000).subscribe((res: any) => {
      this.projectOptions = res.projects;
    });
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    this.selectedDocuments.push(file);
  }
  getAllMembers() {
    this.userService.getAllUsers(1, 1000).subscribe((res: any) => {
      const filterData = res.users.filter((user) => user._id !== this.userDetails._id && user.isDeleted === false);
      this.members = filterData;
    });
  }
}
