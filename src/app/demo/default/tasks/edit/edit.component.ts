import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { IconModule, IconService } from '@ant-design/icons-angular';
import { NgbInputDatepicker, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../../../theme/shared/shared.module';
import { CalendarOutline } from '@ant-design/icons-angular/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { environment } from '../../../../../environments/environment';
import { ProjectService } from '../../../../services/project.service';
import { UserService } from '../../../../services/user.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CardComponent, IconModule, NgbInputDatepicker, ReactiveFormsModule, SharedModule, NgbModalModule, NgSelectComponent],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  editTaskForm!: FormGroup;
  projectOptions = [];
  priorityOptions = ['High', 'Medium', 'Low'];
  formSubmitted = false;
  taskId: string = '';
  selectedDocuments: File[] = [];
  backendFiles: string[] = [];
  filesToRemove: string[] = [];
  itemToDelete: string = '';
  members = [];
  selectedMembers: string[] = [];
  selectedPermitedUsers: string[] = [];
  userDetails = JSON.parse(localStorage.getItem('user'));
  comments = [];
  newComment = {
    text: '',
    file: null,
  };
  curruntUserPermission: "Developer" | 'Client' | 'Manager' = 'Developer';


  constructor(
    private fb: FormBuilder,
    private iconService: IconService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private projectService: ProjectService,
    private modalService: NgbModal,
    private router: Router,
    private userService: UserService
  ) {
    this.iconService.addIcon(...[CalendarOutline]);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id') || '';
      this.getTaskDetails();
    });

    this.editTaskForm = this.fb.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: [null, Validators.required],
      completedAt: [''],
      project: ['', Validators.required],
      document: [null]
    });
    this.getProjectList();
    this.getAllMembers();
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.editTaskForm.invalid) {
      console.log('Form is invalid.');
      return;
    }
    const allUsers = Array.from(new Set([...this.selectedMembers, ...this.selectedPermitedUsers]));

    const members = allUsers.map((user: any) => ({
      user: user._id,
      permissions: { canAddUsers: this.selectedPermitedUsers.includes(user) },
      role: this.selectedPermitedUsers.includes(user) ? 'Manager' : 'Developer'
    }));

    const formPayload = new FormData();

    // Append form values except for specific keys
    Object.keys(this.editTaskForm.value).forEach((key) => {
      if (key === 'dueDate') {
        const dueDate = this.editTaskForm.value['dueDate'];
        const formattedDate = new Date(dueDate.year, dueDate.month - 1, dueDate.day).toISOString();
        formPayload.append('dueDate', formattedDate);
      } else if (key !== 'document') {
        formPayload.append(key, this.editTaskForm.value[key]);
      }
      if (key === 'completedAt') {
        const completedAt = this.editTaskForm.value['completedAt'];
        const formattedDate = new Date(completedAt.year, completedAt.month - 1, completedAt.day).toISOString();
        formPayload.append('completedAt', formattedDate);
      }
    });

    // Append new uploaded documents
    this.selectedDocuments.forEach((file) => {
      formPayload.append('document', file);
    });

    // Append files to remove
    this.filesToRemove.forEach((file) => {
      formPayload.append('filesToRemove', file);
    });

    members.forEach((item: any) => {
      formPayload.append('members', JSON.stringify(item));
    });

    // Make the API call to update the task
    this.taskService.updateTask(this.taskId, formPayload).subscribe(
      (res) => {
        this.router.navigateByUrl('/tasks');
      },
      (err) => {
        console.error('Error updating task:', err);
      }
    );
  }

  getFileName(url: string): string {
    return url.split('/').pop() || 'Unknown File';
  }

  previewFile(file: string): void {
    const fileURL = environment.fileBaseUrl + '/' + file;
    window.open(fileURL, '_blank');
  }

  removeBackendFile(file: string, index: number): void {
    this.backendFiles.splice(index, 1);
    this.filesToRemove.push(file);
  }

  getTaskDetails(): void {
    this.taskService.getTaskById(this.taskId).subscribe((res: any) => {
      this.backendFiles = res.files || [];
      const [findCurrentUser] = res.members.filter((user: any) => user._id === this.userDetails._id);
      res.members.map((data) => {
        console.log(data.user._id, this.userDetails._id);
      })
      console.log(findCurrentUser)
      this.editTaskForm.patchValue({
        name: res.name,
        status: res.status,
        description: res.description,
        priority: res.priority,
        dueDate: {
          year: new Date(res.dueDate).getFullYear(),
          month: new Date(res.dueDate).getMonth() + 1,
          day: new Date(res.dueDate).getDate() + 1
        },
        completedAt: {
          year: new Date(res.completedAt).getFullYear(),
          month: new Date(res.completedAt).getMonth() + 1,
          day: new Date(res.completedAt).getDate() + 1
        },
        project: res.project._id
      });
      this.selectedMembers = res.members
        .filter(member => member.permissions.canAddUsers === false)
        .map(member => member.user);

      this.selectedPermitedUsers = res.members
        .filter(member => member.permissions.canAddUsers === true)
        .map(member => member.user);

      this.comments = res.comments || [];
      console.log(this.comments);
    });
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

  open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  deleteItem() {
    this.taskService.deleteTask(this.taskId).subscribe((res: any) => {
      this.router.navigateByUrl('/tasks');
    });
    // Implement delete logic here
  }

  getAllMembers(){
    this.userService.getAllUsers(1, 1000).subscribe((res: any) => {
      console.log(res)
      const filterData = res.users.filter(user => user._id !== this.userDetails._id)
      this.members = filterData;
    })
  }

  // Add Comment Functionality (Separate from onSubmit)
  addComment(): void {
    if (this.newComment.text.trim() || this.newComment.file) {
      const newCommentData = {
        author: this.userDetails._id, // Replace with dynamic author name
        message: this.newComment.text,
        file: this.newComment.file
      };
      const formData = new FormData();
      for(let k in newCommentData){
        formData.append(k, newCommentData[k]);
      }

      this.taskService.addComment(this.taskId, formData).subscribe((res: any) => {
        console.log(res);
        this.newComment.text = '';
        this.newComment.file = null;
        this.getAllComments();
      })

      // Call the API to add the comment
      // this.commentService.addComment(this.taskId, newCommentData).subscribe(
      //   (response) => {
      //     this.comments.push(newCommentData); // Update the local comment list with the new comment
      //     console.log('Comment added:', response);
      //
      //     // Reset the comment form
      //     this.newComment.text = '';
      //     this.newComment.file = null;
      //   },
      //   (error) => {
      //     console.error('Error adding comment:', error);
      //   }
      // );
    }
  }

  getAllComments(): void {
    this.taskService.getAllComments(this.taskId).subscribe((res: any) => {
      this.comments = res.comments;
    })
  }

  handleCommentFileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newComment.file = file;
      console.log('Comment file uploaded:', file);
    }
  }

  disableFields(){
    const roles = {
      admin: [],
      manager: [],
      developer: [
        'name',
        'description',
        'priority',
        'dueDate',
        'project',
        'document'
      ]
    }
  }
}
