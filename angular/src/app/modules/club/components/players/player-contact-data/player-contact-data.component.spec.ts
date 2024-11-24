import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerContactDataComponent } from './player-contact-data.component';

describe('PlayerContactDataComponent', () => {
  let component: PlayerContactDataComponent;
  let fixture: ComponentFixture<PlayerContactDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerContactDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerContactDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
