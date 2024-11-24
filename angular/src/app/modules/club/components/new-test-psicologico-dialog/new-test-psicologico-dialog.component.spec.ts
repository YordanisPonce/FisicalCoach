import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTestPsicologicoDialogComponent } from './new-test-psicologico-dialog.component';

describe('NewTestPsicologicoDialogComponent', () => {
  let component: NewTestPsicologicoDialogComponent;
  let fixture: ComponentFixture<NewTestPsicologicoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTestPsicologicoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTestPsicologicoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
