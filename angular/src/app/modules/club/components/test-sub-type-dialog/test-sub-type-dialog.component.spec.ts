import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSubTypeDialogComponent } from './test-sub-type-dialog.component';

describe('TestSubTypeDialogComponent', () => {
  let component: TestSubTypeDialogComponent;
  let fixture: ComponentFixture<TestSubTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSubTypeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSubTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
