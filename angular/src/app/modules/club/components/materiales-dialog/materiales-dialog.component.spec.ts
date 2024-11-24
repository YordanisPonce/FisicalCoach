import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesDialogComponent } from './materiales-dialog.component';

describe('MaterialesDialogComponent', () => {
  let component: MaterialesDialogComponent;
  let fixture: ComponentFixture<MaterialesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
