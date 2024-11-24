import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewExerciseDialogComponent } from './create-new-exercise-dialog.component';

describe('CreateNewExerciseDialogComponent', () => {
  let component: CreateNewExerciseDialogComponent;
  let fixture: ComponentFixture<CreateNewExerciseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewExerciseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewExerciseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
