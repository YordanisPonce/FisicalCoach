import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWorkModalComponent } from './daily-work-modal.component';

describe('DailyWorkModalComponent', () => {
  let component: DailyWorkModalComponent;
  let fixture: ComponentFixture<DailyWorkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyWorkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyWorkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
