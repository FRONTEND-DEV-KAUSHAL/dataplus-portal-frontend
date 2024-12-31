// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import tableData from 'src/fake-data/default-data.json';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { DashboardService } from '../../../services/dashboard.service';

interface CardTab {
  title: string;
  count: number;
}


export interface TimeTrackingEntry {
  project: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: string;
}
@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DefaultComponent implements OnInit {
  // constructor
  constructor(private iconService: IconService, private dashboardService: DashboardService) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  recentOrder = tableData;

  AnalyticEcommerce: CardTab[] = [
    {
      title: 'Task In Progress',
      count: 0
    },
    {
      title: 'Tasks Open',
      count: 0
    },
    {
      title: 'Tasks Closed',
      count: 0
    },
    {
      title: 'Total Tasks',
      count: 0
    }
  ];
  tasksOverview = {
    week: {
      tasks: 0,
      hours: 0
    },
    monthly: {
      tasks: 0,
      hours: 0
    }
  };

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((data: any) => {
      const stats = data.data.taskStats;

      // Update AnalyticEcommerce based on the response
      this.AnalyticEcommerce = [
        {
          title: 'Task In Progress',
          count: stats.tasksInProgress || 0,
        },
        {
          title: 'Tasks Open',
          count: stats.tasksOpen || 0,
        },
        {
          title: 'Tasks Closed',
          count: stats.tasksClosed || 0,
        },
        {
          title: 'Total Tasks',
          count: stats.totalTasks || 0,
        },
      ];
      // Update tasksOverview
      this.tasksOverview = {
        week: {
          tasks: stats.weekly.tasksCompleted || 0,
          hours: stats.weekly.hours || 0,
        },
        monthly: {
          tasks: stats.monthly.tasksCompleted || 0,
          hours: stats.monthly.hours || 0,
        },
      };
    });
  }
}
