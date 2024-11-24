import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWorkoutDialogComponent } from './daily-workout-dialog.component';

describe('DailyWorkoutDialogComponent', () => {
  let component: DailyWorkoutDialogComponent;
  let fixture: ComponentFixture<DailyWorkoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyWorkoutDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyWorkoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
