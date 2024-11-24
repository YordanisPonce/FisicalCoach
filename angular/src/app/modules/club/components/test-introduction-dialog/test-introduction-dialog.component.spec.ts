import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestIntroductionDialogComponent } from './test-introduction-dialog.component';

describe('TestIntroductionDialogComponent', () => {
  let component: TestIntroductionDialogComponent;
  let fixture: ComponentFixture<TestIntroductionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestIntroductionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestIntroductionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
