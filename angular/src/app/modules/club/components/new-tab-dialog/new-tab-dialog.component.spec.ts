import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTabDialogComponent } from './new-tab-dialog.component';

describe('NewTabDialogComponent', () => {
  let component: NewTabDialogComponent;
  let fixture: ComponentFixture<NewTabDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTabDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTabDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
