import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlanModalComponent } from './create-plan-modal.component';

describe('CreatePlanModalComponent', () => {
  let component: CreatePlanModalComponent;
  let fixture: ComponentFixture<CreatePlanModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePlanModalComponent]
    });
    fixture = TestBed.createComponent(CreatePlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
