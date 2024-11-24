import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPlayerResultsComponent } from './test-player-results.component';

describe('TestPlayerResultsComponent', () => {
  let component: TestPlayerResultsComponent;
  let fixture: ComponentFixture<TestPlayerResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPlayerResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPlayerResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
