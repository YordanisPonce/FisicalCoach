import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerWorkingDataComponent } from './player-working-data.component';

describe('PlayerWorkingDataComponent', () => {
  let component: PlayerWorkingDataComponent;
  let fixture: ComponentFixture<PlayerWorkingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerWorkingDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerWorkingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
