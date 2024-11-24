import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerProfileHealthComponent } from './player-profile-health.component';

describe('PlayerProfileHealthComponent', () => {
  let component: PlayerProfileHealthComponent;
  let fixture: ComponentFixture<PlayerProfileHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerProfileHealthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerProfileHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
