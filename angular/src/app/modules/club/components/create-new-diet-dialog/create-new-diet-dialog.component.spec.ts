import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDietDialogComponent } from './create-new-diet-dialog.component';

describe('CreateNewDietDialogComponent', () => {
  let component: CreateNewDietDialogComponent;
  let fixture: ComponentFixture<CreateNewDietDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewDietDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewDietDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
