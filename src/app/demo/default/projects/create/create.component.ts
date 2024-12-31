import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { IconModule, IconService } from '@ant-design/icons-angular';
import { NgbDatepickerModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { CalendarOutline } from '@ant-design/icons-angular/icons';
import { ProjectService } from '../../../../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CardComponent, CommonModule, IconModule, NgbDatepickerModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit {
  projectForm: FormGroup;

  budgetType = ['Hourly', 'Fixed'];

  constructor(private fb: FormBuilder,  private iconService: IconService, private projectService: ProjectService, private router: Router) {
    this.iconService.addIcon(...[CalendarOutline])
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      budgetType: ['', [Validators.required]],
      budget: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      status: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      let payload = {
        ...this.projectForm.value,
        company: localStorage.getItem('company'),
      }
      if(this.projectForm.value.startDate){
        const date = this.projectForm.value.startDate
        payload.startDate =  new Date(
          date.year,
          date.month - 1,
          date.day+1
        ).toISOString();
      }
      if(this.projectForm.value.endDate){
        const date = this.projectForm.value.endDate
        payload.endDate =  new Date(
          date.year,
          date.month - 1,
          date.day+ 1
        ).toISOString();
      }

      this.projectService.createProject(payload).subscribe((res) => {
        this.router.navigateByUrl('/projects')
      })
    }
  }
}
