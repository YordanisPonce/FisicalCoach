import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHealthInjuriesDetailsComponent } from './player-health-injuries-details.component';

describe('PlayerHealthInjuriesDetailsComponent', () => {
  let component: PlayerHealthInjuriesDetailsComponent;
  let fixture: ComponentFixture<PlayerHealthInjuriesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerHealthInjuriesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerHealthInjuriesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
