import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutGroupsDialogComponent } from './workout-groups-dialog.component';

describe('WorkoutGroupsDialogComponent', () => {
  let component: WorkoutGroupsDialogComponent;
  let fixture: ComponentFixture<WorkoutGroupsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutGroupsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutGroupsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
