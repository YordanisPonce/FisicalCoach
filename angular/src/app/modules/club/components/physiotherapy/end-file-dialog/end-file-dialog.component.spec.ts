import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndFileDialogComponent } from './end-file-dialog.component';

describe('EndFileDialogComponent', () => {
  let component: EndFileDialogComponent;
  let fixture: ComponentFixture<EndFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndFileDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
