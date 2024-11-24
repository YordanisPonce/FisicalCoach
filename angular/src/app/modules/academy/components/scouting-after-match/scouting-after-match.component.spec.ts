import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoutingAfterMatchComponent } from './scouting-after-match.component';

describe('ScoutingAfterMatchComponent', () => {
  let component: ScoutingAfterMatchComponent;
  let fixture: ComponentFixture<ScoutingAfterMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoutingAfterMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutingAfterMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
