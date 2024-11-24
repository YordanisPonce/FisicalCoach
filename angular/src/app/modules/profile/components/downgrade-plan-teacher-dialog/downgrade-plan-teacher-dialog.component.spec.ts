import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowngradePlanTeacherDialogComponent } from './downgrade-plan-teacher-dialog.component';

describe('DowngradePlanTeacherDialogComponent', () => {
  let component: DowngradePlanTeacherDialogComponent;
  let fixture: ComponentFixture<DowngradePlanTeacherDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DowngradePlanTeacherDialogComponent]
    });
    fixture = TestBed.createComponent(DowngradePlanTeacherDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
