import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitarMiembrosDialogComponent } from './invitar-miembros-dialog.component';

describe('InvitarMiembrosDialogComponent', () => {
  let component: InvitarMiembrosDialogComponent;
  let fixture: ComponentFixture<InvitarMiembrosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitarMiembrosDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitarMiembrosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
