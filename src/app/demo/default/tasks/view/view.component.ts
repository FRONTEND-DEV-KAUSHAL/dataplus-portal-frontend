import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../../../services/task.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, NgbDropdownModule, RouterLink],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit {
  task: any = {};
  comments: any = [];
  active = 1;
  statuses: string[] = ['Open', 'In Progress', 'Needs Work', 'On Hold', 'To Be Tested', 'Closed'];
  priorities: string[] = ['High', 'Medium', 'Low'];
  taskId: string = '';
  newComment = {
    text: '',
    file: null
  };
  userDetails: any = JSON.parse(localStorage.getItem('user'));
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id') || '';
      this.getTaskDetails();
    });
  }

  getFileName(url: string): string {
    return url.split('/').pop() || 'Unknown File';
  }

  previewFile(file: string): void {
    const fileURL = environment.fileBaseUrl + '/' + file;
    window.open(fileURL, '_blank');
  }

  changeStatus(task: any, newStatus: string): void {
    task.status = newStatus;
    // this.taskService.updateTask(task._id, { status: newStatus}).subscribe()
  }
  changePriority(task: any, newPriority: string): void {
    task.priority = newPriority;
    // this.taskService.updateTask(task._id, { priority: newPriority}).subscribe()
  }
  getTaskDetails(): void {
    this.taskService.getTaskById(this.taskId).subscribe((res: any) => {
      this.task = res;
      this.comments = res.comments || [];
      console.log(this.comments);
    });
  }
  addComment(): void {
    if (this.newComment.text.trim() || this.newComment.file) {
      const newCommentData = {
        author: this.userDetails._id, // Replace with dynamic author name
        message: this.newComment.text,
        file: this.newComment.file
      };
      const formData = new FormData();
      for (let k in newCommentData) {
        formData.append(k, newCommentData[k]);
      }

      this.taskService.addComment(this.taskId, formData).subscribe((res: any) => {
        console.log(res);
        this.newComment.text = '';
        this.newComment.file = null;
        this.getAllComments();
      });

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
    });
  }
  handleCommentFileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newComment.file = file;
      console.log('Comment file uploaded:', file);
    }
  }
}
