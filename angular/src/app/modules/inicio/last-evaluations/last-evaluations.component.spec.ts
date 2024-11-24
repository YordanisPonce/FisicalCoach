import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastEvaluationsComponent } from './last-evaluations.component';

describe('LastEvaluationsComponent', () => {
  let component: LastEvaluationsComponent;
  let fixture: ComponentFixture<LastEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastEvaluationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
