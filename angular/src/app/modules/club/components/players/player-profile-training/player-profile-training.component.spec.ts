import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerProfileTrainingComponent } from './player-profile-training.component';

describe('PlayerProfileTrainingComponent', () => {
  let component: PlayerProfileTrainingComponent;
  let fixture: ComponentFixture<PlayerProfileTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerProfileTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerProfileTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
