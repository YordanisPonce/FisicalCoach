import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCheckComponent } from './daily-check.component';

describe('DailyCheckComponent', () => {
  let component: DailyCheckComponent;
  let fixture: ComponentFixture<DailyCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
