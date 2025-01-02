import { Component, OnInit } from '@angular/core';
import { IconModule, IconService } from '@ant-design/icons-angular';
import { DatePipe, NgForOf } from '@angular/common';
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbModalModule,
  NgbPagination
} from '@ng-bootstrap/ng-bootstrap';
import { DeleteOutline, EditOutline, MoreOutline } from '@ant-design/icons-angular/icons';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [IconModule, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbPagination, FormsModule, RouterLink, NgbModalModule, DatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  page = 1;
  pageSize = 4;
  projects = [];
  totalProjects = 0;
  selectedItemToDelete: string = '';
  userDetails = JSON.parse(localStorage.getItem('user'));
  constructor(
    private iconService: IconService,
    private projectService: ProjectService,
    private modalService: NgbModal
  ) {
    this.iconService.addIcon(...[EditOutline, DeleteOutline, MoreOutline]);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.projectService.getAllProjects(this.page, this.pageSize).subscribe((res: any) => {
      this.projects = res.projects;
      this.totalProjects = res.total;
    });
  }

  open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  deleteItem() {
    this.projectService.deleteProject(this.selectedItemToDelete).subscribe((res: any) => {
      this.page = 1;
      this.loadData();
    });
    // Implement delete logic here
  }
}
