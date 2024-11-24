import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSheetDialogComponent } from './create-sheet-dialog.component';

describe('CreateSheetDialogComponent', () => {
  let component: CreateSheetDialogComponent;
  let fixture: ComponentFixture<CreateSheetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSheetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
