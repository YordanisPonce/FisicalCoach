import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveWorkoutDialogComponent } from './save-workout-dialog.component';

describe('SaveWorkoutDialogComponent', () => {
  let component: SaveWorkoutDialogComponent;
  let fixture: ComponentFixture<SaveWorkoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveWorkoutDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveWorkoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
