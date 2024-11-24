import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHealthInjuriesHistoryDataComponent } from './player-health-injuries-history-data.component';

describe('PlayerHealthInjuriesHistoryDataComponent', () => {
  let component: PlayerHealthInjuriesHistoryDataComponent;
  let fixture: ComponentFixture<PlayerHealthInjuriesHistoryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerHealthInjuriesHistoryDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerHealthInjuriesHistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
