import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSportingDataComponent } from './player-sporting-data.component';

describe('PlayerSportingDataComponent', () => {
  let component: PlayerSportingDataComponent;
  let fixture: ComponentFixture<PlayerSportingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerSportingDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSportingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
