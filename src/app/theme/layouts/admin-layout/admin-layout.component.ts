// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// Project import
import { SharedModule } from '../../shared/shared.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminComponent implements OnInit {
  // public props
  navCollapsed: boolean;
  navCollapsedMob: boolean;
  authPages: string[] = ['/login', '/identify-company', '/register'];
  isAuthPage: boolean = false;
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Get the current URL path
        this.isAuthPage = this.authPages.includes(this.router.url)
      }
    });
  }


  // public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.pc-sidebar')?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
    if (document.querySelector('app-navigation.pc-sidebar')?.classList.contains('navbar-collapsed')) {
      document.querySelector('app-navigation.pc-sidebar')?.classList.remove('navbar-collapsed');
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (document.querySelector('app-navigation.pc-sidebar')?.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pc-sidebar')?.classList.remove('mob-open');
    }
  }
}
