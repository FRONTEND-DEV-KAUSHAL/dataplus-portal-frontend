// angular import
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline
} from '@ant-design/icons-angular/icons';
import { NotificationService } from '../../../../../services/notification.service';
import { debounce, debounceTime } from 'rxjs';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  @Input() styleSelectorToggle!: boolean;
  @Output() Customize = new EventEmitter();
  windowWidth: number;
  notificationCount: number;
  notificationList: any[];
  screenFull: boolean = true;
  userDetails: any;

  constructor(private iconService: IconService, private notificationService: NotificationService, private authService: AuthService, private router: Router) {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline
      ]
    );
  }

  profile = [
    // {
    //   icon: 'edit',
    //   title: 'Edit Profile'
    // },
    {
      icon: 'user',
      title: 'View Profile',
      path: '/profile'
    }
    // {
    //   icon: 'profile',
    //   title: 'Social Profile'
    // },
    // {
    //   icon: 'wallet',
    //   title: 'Billing'
    // }
  ];


  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.notificationService.getAllNotifications().subscribe(
      (notifications: any) => {
        this.notificationCount = notifications.unreadCount;
        this.notificationList = notifications.notifications;
      }
    )
    this.getUserProfile()
  }

  getNotificationTime(date:string){
    const createdAt = new Date(date);

// Get the hours and minutes
    let hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();

// Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

// Convert hours from 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

// Format minutes to always have two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

// Final time format
    const time = `${hours}:${formattedMinutes} ${ampm}`;

    return time;
  }

  readNotification(notification){
    notification.isRead = true;
    this.notificationService.readNotification({notificationIds: notification._id}).subscribe((res) => {
      this.getNotifications()
    })
  }

  getUserProfile(){
    this.authService.getLoggedInUser().subscribe((res) => {
      this.userDetails = res;
    })
  }

  logout(){
    this.router.navigate(['/login']);
    localStorage.clear();
  }
}
