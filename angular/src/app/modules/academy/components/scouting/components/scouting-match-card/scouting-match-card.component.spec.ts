import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutingMatchCardComponent } from './scouting-match-card.component';

describe('ScoutingMatchCardComponent', () => {
  let component: ScoutingMatchCardComponent;
  let fixture: ComponentFixture<ScoutingMatchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoutingMatchCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutingMatchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
