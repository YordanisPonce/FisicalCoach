import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerFamilyDataComponent } from './player-family-data.component';

describe('PlayerFamilyDataComponent', () => {
  let component: PlayerFamilyDataComponent;
  let fixture: ComponentFixture<PlayerFamilyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerFamilyDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerFamilyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
