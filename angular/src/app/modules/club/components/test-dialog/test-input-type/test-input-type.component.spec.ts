import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInputTypeComponent } from './test-input-type.component';

describe('TestInputTypeComponent', () => {
  let component: TestInputTypeComponent;
  let fixture: ComponentFixture<TestInputTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestInputTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInputTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
