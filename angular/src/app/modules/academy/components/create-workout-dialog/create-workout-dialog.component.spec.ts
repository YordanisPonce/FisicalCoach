import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkoutDialogComponent } from './create-workout-dialog.component';

describe('CreateWorkoutDialogComponent', () => {
  let component: CreateWorkoutDialogComponent;
  let fixture: ComponentFixture<CreateWorkoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWorkoutDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
