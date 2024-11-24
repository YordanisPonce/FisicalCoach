import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortRecoveryComponent } from './effort-recovery.component';

describe('EffortRecoveryComponent', () => {
  let component: EffortRecoveryComponent;
  let fixture: ComponentFixture<EffortRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffortRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EffortRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
