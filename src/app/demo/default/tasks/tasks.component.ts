import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { NgbDropdownModule, NgbModal, NgbModalModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { IconModule, IconService } from '@ant-design/icons-angular';
import {
  DeleteOutline,
  EditOutline, MoreOutline
} from '@ant-design/icons-angular/icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CardComponent, NgbDropdownModule, CommonModule, IconModule, NgbPagination, FormsModule, RouterLink, NgbModalModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  tasksOverview = {
    open: 0,
    inProgress: 0,
    highPriority: 0
  };
  page = 1;
  pageSize = 4;
  tasks = [];
  totalTasks = 0;
  selectedItemToDelete: string = '';
  // Status options
  statuses: string[] = ['Pending', 'In Progress', 'Completed'];
  userDetails = JSON.parse(localStorage.getItem('user'));
  priorities: string[] = ['High', 'Medium', 'Low'];

  constructor(private iconService: IconService, private taskService: TaskService, private modalService: NgbModal) {
    this.iconService.addIcon(...[EditOutline, DeleteOutline, MoreOutline]);
  }

  ngOnInit() {
    this.loadData();
  }

  // Change status method
  changeStatus(task: any, newStatus: string): void {
    task.status = newStatus;
    this.taskService.updateTask(task._id, { status: newStatus}).subscribe()

  }

  changePriority(task: any, newPriority: string): void {
    task.priority = newPriority;
    this.taskService.updateTask(task._id, { priority: newPriority}).subscribe()
  }

  loadData() {
    this.taskService.getAllTasks(this.page, this.pageSize).subscribe((res: any) => {
      this.tasks = res.tasks;
      this.totalTasks = res.total;
      this.tasksOverview = {
        open: res.openTasks,
        inProgress: res.inProgressTasks,
        highPriority: res.highPriorityTasks,
      };
    })
  }

  open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  deleteItem() {
    this.taskService.deleteTask(this.selectedItemToDelete).subscribe((res: any) => {
      this.page = 1;
      this.loadData();
    })
    // Implement delete logic here
  }
}
