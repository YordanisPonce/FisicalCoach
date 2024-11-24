import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHealthInformationDataComponent } from './player-health-information-data.component';

describe('PlayerHealthInformationDataComponent', () => {
  let component: PlayerHealthInformationDataComponent;
  let fixture: ComponentFixture<PlayerHealthInformationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerHealthInformationDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerHealthInformationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
