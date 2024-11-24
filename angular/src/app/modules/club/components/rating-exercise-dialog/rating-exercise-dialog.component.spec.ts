import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingExerciseDialogComponent } from './rating-exercise-dialog.component';

describe('RatingExerciseDialogComponent', () => {
  let component: RatingExerciseDialogComponent;
  let fixture: ComponentFixture<RatingExerciseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingExerciseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingExerciseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
