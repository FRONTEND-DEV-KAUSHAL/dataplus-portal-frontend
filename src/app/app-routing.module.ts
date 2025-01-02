// angular import
import { inject, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import * as path from 'node:path';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [() => {
      const router = inject(Router);
      // const company = localStorage.getItem('company');
      const token = localStorage.getItem('token');

      // if (!company) {
      //   router.navigate(['/identify-company']);
      //   return false;
      // }

      if (!token) {
        router.navigate(['/login']);
        return false;
      }

      return true; // User has both company and token
    }],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./demo/default/tasks/tasks.component').then((c) => c.TasksComponent)
      },
      {
        path: 'tasks/create',
        loadComponent: () => import('./demo/default/tasks/create/create.component').then((c) => c.CreateComponent)
      },
      {
        path: 'tasks/edit/:id',
        loadComponent: () => import('./demo/default/tasks/edit/edit.component').then((c) => c.EditComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./demo/default/projects/projects.component').then((c) => c.ProjectsComponent)
      },
      {
        path: 'projects/create',
        loadComponent: () => import('./demo/default/projects/create/create.component').then((c) => c.CreateComponent)
      },
      {
        path: 'projects/edit/:id',
        loadComponent: () => import('./demo/default/projects/edit/edit.component').then((c) => c.EditComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>  import('./demo/default/profile/profile.component').then((c) => c.ProfileComponent)
      }
    ],

  },
  {
    path: 'login',
    loadComponent: () =>  import('./demo/authentication/login/login.component').then((c) => c.default),
  },
  // {
  //   path: 'identify-company',
  //   loadComponent: () => import('./demo/authentication/identify-company/identify-company.component').then(c => c.IdentifyCompanyComponent)
  // },
  {
    path: 'register',
    loadComponent: () => import('./demo/authentication/register/register.component').then(c => c.default)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
