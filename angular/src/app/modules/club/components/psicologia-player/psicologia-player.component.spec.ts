import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsicologiaPlayerComponent } from './psicologia-player.component';

describe('PsicologiaPlayerComponent', () => {
  let component: PsicologiaPlayerComponent;
  let fixture: ComponentFixture<PsicologiaPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsicologiaPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsicologiaPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
