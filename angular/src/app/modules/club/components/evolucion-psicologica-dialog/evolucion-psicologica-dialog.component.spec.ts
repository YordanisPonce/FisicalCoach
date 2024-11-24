import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolucionPsicologicaDialogComponent } from './evolucion-psicologica-dialog.component';

describe('EvolucionPsicologicaDialogComponent', () => {
  let component: EvolucionPsicologicaDialogComponent;
  let fixture: ComponentFixture<EvolucionPsicologicaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvolucionPsicologicaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucionPsicologicaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
