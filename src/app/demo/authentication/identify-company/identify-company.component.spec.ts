import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyCompanyComponent } from './identify-company.component';

describe('IdentifyCompanyComponent', () => {
  let component: IdentifyCompanyComponent;
  let fixture: ComponentFixture<IdentifyCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentifyCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentifyCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
