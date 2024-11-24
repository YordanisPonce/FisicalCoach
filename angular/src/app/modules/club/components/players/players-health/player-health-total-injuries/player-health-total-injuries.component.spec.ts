import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHealthTotalInjuriesComponent } from './player-health-total-injuries.component';

describe('PlayerHealthTotalInjuriesComponent', () => {
  let component: PlayerHealthTotalInjuriesComponent;
  let fixture: ComponentFixture<PlayerHealthTotalInjuriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerHealthTotalInjuriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerHealthTotalInjuriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
