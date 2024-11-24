import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIndicatorDialogComponent } from './new-indicator-dialog.component';

describe('NewIndicatorDialogComponent', () => {
  let component: NewIndicatorDialogComponent;
  let fixture: ComponentFixture<NewIndicatorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIndicatorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIndicatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
