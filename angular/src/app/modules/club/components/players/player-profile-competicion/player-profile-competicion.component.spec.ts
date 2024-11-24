import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerProfileCompeticionComponent } from './player-profile-competicion.component';

describe('PlayerProfileCompeticionComponent', () => {
  let component: PlayerProfileCompeticionComponent;
  let fixture: ComponentFixture<PlayerProfileCompeticionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerProfileCompeticionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerProfileCompeticionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
