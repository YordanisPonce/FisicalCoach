import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajoDiarioDialogComponent } from './trabajo-diario-dialog.component';

describe('TrabajoDiarioDialogComponent', () => {
  let component: TrabajoDiarioDialogComponent;
  let fixture: ComponentFixture<TrabajoDiarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabajoDiarioDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajoDiarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
