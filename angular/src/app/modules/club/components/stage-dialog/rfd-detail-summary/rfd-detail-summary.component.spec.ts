import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfdDetailSummaryComponent } from './rfd-detail-summary.component';

describe('RfdDetailSummaryComponent', () => {
  let component: RfdDetailSummaryComponent;
  let fixture: ComponentFixture<RfdDetailSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfdDetailSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfdDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
