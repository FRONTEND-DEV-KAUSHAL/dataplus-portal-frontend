import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IconModule, IconService } from '@ant-design/icons-angular';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { DeleteOutline, EditOutline, MoreOutline } from '@ant-design/icons-angular/icons';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DatePipe, IconModule, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbPagination, ReactiveFormsModule,FormsModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  page = 1;
  pageSize = 10;
  users = [];
  totalUsers = 0;
  selectedItemToDelete: string = '';
  userDetails = JSON.parse(localStorage.getItem('user'));
  constructor(
    private iconService: IconService,
    private userService: UserService,
    private modalService: NgbModal
  ) {
    this.iconService.addIcon(...[EditOutline, DeleteOutline, MoreOutline]);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getAllUsers(this.page, this.pageSize).subscribe((res: any) => {
      this.users = res.users;
      this.totalUsers = res.total;
    });
  }

  open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  deleteItem() {
    this.userService.deleteUser(this.selectedItemToDelete).subscribe((res: any) => {
      this.page = 1;
      this.loadData();
    });
    // Implement delete logic here
  }
}
