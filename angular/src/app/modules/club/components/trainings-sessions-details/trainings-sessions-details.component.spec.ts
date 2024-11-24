import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingsSessionsDetailsComponent } from './trainings-sessions-details.component';

describe('TrainingsSessionsDetailsComponent', () => {
  let component: TrainingsSessionsDetailsComponent;
  let fixture: ComponentFixture<TrainingsSessionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingsSessionsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingsSessionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
