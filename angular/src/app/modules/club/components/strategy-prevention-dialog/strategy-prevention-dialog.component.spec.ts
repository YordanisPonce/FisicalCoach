import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyPreventionDialogComponent } from './strategy-prevention-dialog.component';

describe('StrategyPreventionDialogComponent', () => {
  let component: StrategyPreventionDialogComponent;
  let fixture: ComponentFixture<StrategyPreventionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyPreventionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyPreventionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
