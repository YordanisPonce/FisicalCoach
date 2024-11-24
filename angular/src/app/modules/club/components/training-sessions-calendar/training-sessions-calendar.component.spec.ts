import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSessionsCalendarComponent } from './training-sessions-calendar.component';

describe('TrainingSessionsCalendarComponent', () => {
  let component: TrainingSessionsCalendarComponent;
  let fixture: ComponentFixture<TrainingSessionsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingSessionsCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingSessionsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
