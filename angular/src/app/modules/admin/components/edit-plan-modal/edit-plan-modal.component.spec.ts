import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanModalComponent } from './edit-plan-modal.component';

describe('EditPlanModalComponent', () => {
  let component: EditPlanModalComponent;
  let fixture: ComponentFixture<EditPlanModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPlanModalComponent]
    });
    fixture = TestBed.createComponent(EditPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
