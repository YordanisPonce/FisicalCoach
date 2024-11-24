import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerProfileInformationComponent } from './player-profile-information.component';

describe('PlayerProfileInformationComponent', () => {
  let component: PlayerProfileInformationComponent;
  let fixture: ComponentFixture<PlayerProfileInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerProfileInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerProfileInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
