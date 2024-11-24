import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerProfileGeneralComponent } from './player-profile-general.component';

describe('PlayerProfileGeneralComponent', () => {
  let component: PlayerProfileGeneralComponent;
  let fixture: ComponentFixture<PlayerProfileGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerProfileGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerProfileGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
