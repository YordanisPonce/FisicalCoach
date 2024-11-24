import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPersonalDataComponent } from './player-personal-data.component';

describe('PlayerPersonalDataComponent', () => {
  let component: PlayerPersonalDataComponent;
  let fixture: ComponentFixture<PlayerPersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerPersonalDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
