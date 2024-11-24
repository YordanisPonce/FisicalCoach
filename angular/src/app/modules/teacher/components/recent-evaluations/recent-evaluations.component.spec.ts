import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentEvaluationsComponent } from './recent-evaluations.component';

describe('RecentEvaluationsComponent', () => {
  let component: RecentEvaluationsComponent;
  let fixture: ComponentFixture<RecentEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentEvaluationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
